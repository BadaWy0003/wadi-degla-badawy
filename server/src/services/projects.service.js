// Projects ("our projects around the world"), managed in the admin panel and shown on the
// website, which reads them at build time (GET /api/projects) and shows changes after a
// "Publish to website" (see publish.service.js).
//
// Firestore (through col(), so staging uses staging_*):
//   - projects:          one doc per project. The doc id is the project's number, which is
//                        also its web address (/projects/7), so existing links never break.
//   - project_countries: the country groups of the Projects page, with English + Arabic
//                        name and their order on the page.
//   - site_meta/projects: lastNumber (numbers are never reused, even after a delete).
// A project's "materials supplied" are product ids (materials collection). Product names
// are looked up when the list is read, so a renamed product stays linked and a hidden or
// deleted product simply stops showing.

const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const StorageService = require('./storage.service');
const SiteMeta = require('./site-meta.service');
const importData = require('../data/projects-import.json');

const projectsCol = () => db.collection(col('projects'));
const countriesCol = () => db.collection(col('project_countries'));
const counterDoc = () => db.collection(col('site_meta')).doc('projects');

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

// Photos may only be our own uploads or the website's existing photos in /Assets/Media/.
const isAllowedPhoto = (link) =>
  link === '' || StorageService.isOwnStorageUrl(link) || /^\/Assets\/Media\/[A-Za-z0-9._\-/]+$/.test(link);

const checkPhotos = ({ thumbnail, images }) => {
  const links = [thumbnail ?? '', ...(images || []).map((i) => i.src)];
  if (links.some((l) => !isAllowedPhoto(l))) throw httpError(400, 'Photos must be uploaded through the admin panel.');
};

const text = (field) => ({ en: field?.en || '', ar: field?.ar || '' });
const docs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.number ?? 0) - (b.number ?? 0);

const loadAll = async () => {
  const [projects, countries] = await Promise.all([projectsCol().get(), countriesCol().get()]);
  return { projects: docs(projects), countries: docs(countries).sort(byOrder) };
};

// Products that can be listed as "materials supplied" (not gallery photos).
const loadProducts = async () =>
  (await StorageService.fetchAllProducts({ includeHidden: true }))
    .filter((p) => p.type !== 'Gallery')
    .map((p) => ({ id: p.id, name: String(p.name || '').trim(), type: p.type, hidden: p.hidden === true }));

// Projects in page order: country groups in their order, then the projects' order inside.
const sortProjects = (projects, countries) => {
  const countryRank = new Map(countries.map((c, i) => [c.id, i]));
  const rank = (p) => (countryRank.has(p.countryId) ? countryRank.get(p.countryId) : countries.length);
  return [...projects].sort((a, b) => rank(a) - rank(b) || byOrder(a, b));
};

const ProjectsService = {};

// Public list for the website build: visible projects only, in page order, with their
// country and visible materials.
ProjectsService.listPublic = async () => {
  const [{ projects, countries }, products] = await Promise.all([loadAll(), loadProducts()]);
  const productById = new Map(products.filter((p) => !p.hidden).map((p) => [p.id, p]));
  const countryById = new Map(countries.map((c) => [c.id, c]));
  const visible = sortProjects(
    projects.filter((p) => p.hidden !== true && countryById.has(p.countryId)),
    countries,
  );
  return {
    countries: countries.filter((c) => visible.some((p) => p.countryId === c.id)).map((c) => ({ id: c.id, name: text(c.name) })),
    projects: visible.map((p) => ({
      id: p.id,
      number: p.number,
      name: text(p.name),
      city: text(p.city),
      description: text(p.description),
      country: { id: p.countryId, name: text(countryById.get(p.countryId).name) },
      thumbnail: p.thumbnail || '',
      images: (p.images || []).map((i) => ({ src: i.src, alt: i.alt || '' })),
      materials: (p.materials || [])
        .map((id) => productById.get(id))
        .filter(Boolean)
        .map((m) => ({ id: m.id, name: m.name, type: m.type })),
    })),
  };
};

// Admin panel: everything, plus the product list for the "materials supplied" picker.
ProjectsService.listAll = async () => {
  const [{ projects, countries }, products] = await Promise.all([loadAll(), loadProducts()]);
  return {
    countries: countries.map((c) => ({
      id: c.id,
      name: text(c.name),
      projectCount: projects.filter((p) => p.countryId === c.id).length,
    })),
    projects: sortProjects(projects, countries),
    products: products.sort((a, b) => a.name.localeCompare(b.name)),
  };
};

ProjectsService.get = async (id) => {
  const doc = await projectsCol().doc(String(id)).get();
  if (!doc.exists) throw httpError(404, 'Project not found');
  return { id: doc.id, ...doc.data() };
};

const getCountry = async (id) => {
  const doc = await countriesCol().doc(String(id)).get();
  if (!doc.exists) throw httpError(400, 'Please choose a country from the list.');
  return { id: doc.id, ...doc.data() };
};

const checkMaterials = async (ids) => {
  const known = new Set((await loadProducts()).map((p) => p.id));
  if ((ids || []).some((id) => !known.has(id)))
    throw httpError(400, 'One of the chosen materials no longer exists. Please reload the page.');
};

const nextOrderIn = async (countryId) => {
  const snap = await projectsCol().where('countryId', '==', countryId).get();
  return snap.docs.reduce((max, d) => Math.max(max, d.data().order ?? 0), -1) + 1;
};

const clean = (body) => ({
  name: text(body.name),
  city: text(body.city),
  description: text(body.description),
  countryId: body.countryId,
  thumbnail: body.thumbnail || '',
  images: (body.images || []).map((i) => ({ src: i.src, alt: i.alt || '' })),
  materials: [...new Set(body.materials || [])],
});

ProjectsService.create = async (body, by) => {
  checkPhotos(body);
  await getCountry(body.countryId);
  await checkMaterials(body.materials);
  const order = await nextOrderIn(body.countryId);

  // The number is the web address: take the next one, never reuse an old one.
  const now = Date.now();
  const data = await db.runTransaction(async (tx) => {
    const counter = await tx.get(counterDoc());
    let last = counter.exists ? counter.data().lastNumber || 0 : 0;
    if (!last) {
      const all = await tx.get(projectsCol());
      last = all.docs.reduce((max, d) => Math.max(max, d.data().number || 0), 0);
    }
    const number = last + 1;
    const project = {
      ...clean(body),
      number,
      order,
      legacyMaterials: [],
      hidden: false,
      createdAt: now,
      updatedAt: now,
      updatedBy: by || null,
    };
    tx.set(counterDoc(), { lastNumber: number }, { merge: true });
    tx.set(projectsCol().doc(String(number)), project);
    return { id: String(number), ...project };
  });
  await SiteMeta.markChanged(by);
  return data;
};

ProjectsService.update = async (id, body, by) => {
  checkPhotos(body);
  const before = await ProjectsService.get(id);
  await getCountry(body.countryId);
  await checkMaterials(body.materials);
  const data = { ...clean(body), updatedAt: Date.now(), updatedBy: by || null };
  // Material names from the old website that matched no product: they can only be removed.
  if (Array.isArray(body.legacyMaterials)) {
    data.legacyMaterials = (before.legacyMaterials || []).filter((n) => body.legacyMaterials.includes(n));
  }
  // Moved to another country: goes to the end of that group.
  if (data.countryId !== before.countryId) data.order = await nextOrderIn(data.countryId);
  await projectsCol().doc(before.id).update(data);

  // Uploaded photos that were removed from the project: delete them from Storage.
  const kept = new Set([data.thumbnail, ...data.images.map((i) => i.src)]);
  const removed = [before.thumbnail, ...(before.images || []).map((i) => i.src)].filter((l) => l && !kept.has(l));
  await StorageService.deleteStorageFiles([...new Set(removed)]);

  await SiteMeta.markChanged(by);
  return { ...before, ...data };
};

ProjectsService.setHidden = async (id, hidden, by) => {
  const project = await ProjectsService.get(id);
  await projectsCol()
    .doc(project.id)
    .update({ hidden, updatedAt: Date.now(), updatedBy: by || null });
  await SiteMeta.markChanged(by);
  return { id: project.id, hidden };
};

// Swap with the neighbour above/below, then renumber the group 0..n so orders stay clean.
const moveInList = (list, id, direction) => {
  const i = list.findIndex((x) => x.id === id);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return false;
  [list[i], list[j]] = [list[j], list[i]];
  return true;
};

ProjectsService.move = async (id, direction, by) => {
  const project = await ProjectsService.get(id);
  const group = docs(await projectsCol().where('countryId', '==', project.countryId).get()).sort(byOrder);
  if (!moveInList(group, project.id, direction)) return { id: project.id, moved: false };
  const batch = db.batch();
  group.forEach((p, order) => batch.update(projectsCol().doc(p.id), { order }));
  await batch.commit();
  await SiteMeta.markChanged(by);
  return { id: project.id, moved: true };
};

// Like products and news: a project must be hidden before it can be deleted for good.
ProjectsService.remove = async (id, by) => {
  const project = await ProjectsService.get(id);
  if (project.hidden !== true) throw httpError(409, 'Hide the project first. Only hidden projects can be deleted permanently.');
  await projectsCol().doc(project.id).delete();
  await StorageService.deleteStorageFiles([...new Set([project.thumbnail, ...(project.images || []).map((i) => i.src)])]);
  await SiteMeta.markChanged(by);
  return { id: project.id };
};

ProjectsService.uploadPhotos = async (files) => Promise.all((files || []).map((f) => StorageService.uploadPhoto(f, 'Projects')));

// ----- Countries -----

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

ProjectsService.createCountry = async (body, by) => {
  const countries = docs(await countriesCol().get());
  if (countries.some((c) => sameName(c.name?.en || '', body.name.en)))
    throw httpError(409, 'This country is already in the list.');
  const data = { name: text(body.name), order: countries.reduce((max, c) => Math.max(max, c.order ?? 0), -1) + 1 };
  const ref = await countriesCol().add(data);
  await SiteMeta.markChanged(by);
  return { id: ref.id, ...data };
};

ProjectsService.updateCountry = async (id, body, by) => {
  const country = await getCountry(id);
  const countries = docs(await countriesCol().get());
  if (countries.some((c) => c.id !== country.id && sameName(c.name?.en || '', body.name.en))) {
    throw httpError(409, 'This country is already in the list.');
  }
  await countriesCol()
    .doc(country.id)
    .update({ name: text(body.name) });
  await SiteMeta.markChanged(by);
  return { id: country.id, name: text(body.name) };
};

ProjectsService.moveCountry = async (id, direction, by) => {
  const list = docs(await countriesCol().get()).sort(byOrder);
  if (!moveInList(list, String(id), direction)) return { id, moved: false };
  const batch = db.batch();
  list.forEach((c, order) => batch.update(countriesCol().doc(c.id), { order }));
  await batch.commit();
  await SiteMeta.markChanged(by);
  return { id, moved: true };
};

ProjectsService.removeCountry = async (id, by) => {
  const country = await getCountry(id);
  const used = await projectsCol().where('countryId', '==', country.id).limit(1).get();
  if (!used.empty) throw httpError(409, 'This country still has projects. Move or delete them first.');
  await countriesCol().doc(country.id).delete();
  await SiteMeta.markChanged(by);
  return { id: country.id };
};

// ----- One-time import -----

// Copies the 16 projects that used to be in the website code (client-next/src/components/
// Projects/projectList.js) with the same numbers, order and photos. Only when there are no
// projects and no countries yet, so it can never duplicate or overwrite anything.
ProjectsService.importExisting = async (by) => {
  const [p, c] = await Promise.all([projectsCol().limit(1).get(), countriesCol().limit(1).get()]);
  if (!p.empty || !c.empty) throw httpError(409, 'Projects already exist; nothing was imported.');

  // Material names -> product ids (same rule as the old website: by name, ignoring case;
  // spaces around a name are ignored too). Names without a product are kept aside and shown
  // as a warning in the admin panel.
  const products = await loadProducts();
  const productByName = new Map();
  for (const prod of products)
    if (!productByName.has(prod.name.toLowerCase())) productByName.set(prod.name.toLowerCase(), prod.id);

  const now = Date.now();
  const batch = db.batch();
  const countryIds = new Map();
  importData.countries.forEach((country, order) => {
    const ref = countriesCol().doc();
    countryIds.set(country.en, ref.id);
    batch.set(ref, { name: text(country), order });
  });
  const orderIn = new Map();
  let lastNumber = 0;
  for (const proj of importData.projects) {
    const order = orderIn.get(proj.country) || 0;
    orderIn.set(proj.country, order + 1);
    const ids = [];
    const legacy = [];
    for (const name of proj.materialNames) {
      const found = productByName.get(name.trim().toLowerCase());
      if (found) ids.push(found);
      else legacy.push(name);
    }
    lastNumber = Math.max(lastNumber, proj.number);
    batch.set(projectsCol().doc(String(proj.number)), {
      ...clean({ ...proj, countryId: countryIds.get(proj.country), materials: ids }),
      number: proj.number,
      order,
      legacyMaterials: legacy,
      hidden: false,
      createdAt: now,
      updatedAt: now,
      updatedBy: by || null,
      importedFrom: `projectList.js#${proj.number}`,
    });
  }
  batch.set(counterDoc(), { lastNumber }, { merge: true });
  await batch.commit();
  await SiteMeta.markChanged(by);
  return { imported: importData.projects.length, countries: importData.countries.length };
};

module.exports = ProjectsService;
