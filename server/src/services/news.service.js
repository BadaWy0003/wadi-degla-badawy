// News articles, managed in the admin panel and shown on the website.
//
// Stored in the Firestore collection "news" (col('news'), so staging uses staging_news).
// The website reads them at build time (GET /api/news) and shows them after a
// "Publish to website" (see publish.service.js), so pages stay static and readable by Google.

const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const StorageService = require('./storage.service');
const SiteMeta = require('./site-meta.service');
const importArticles = require('../data/news-import.json');

const newsCollection = () => db.collection(col('news'));

const NewsService = {};

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

// Photos may only be our own uploads or the website's existing photos in /Assets/Media/.
const isAllowedPhoto = (link) =>
  link === '' || StorageService.isOwnStorageUrl(link) || /^\/Assets\/Media\/[A-Za-z0-9._\-/]+$/.test(link);

const checkPhotos = ({ thumbnail, images }) => {
  const links = [thumbnail ?? '', ...(images || []).map((i) => i.src)];
  const bad = links.find((l) => !isAllowedPhoto(l));
  if (bad !== undefined) throw httpError(400, 'Photos must be uploaded through the admin panel.');
};

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'article';

const allDocs = async () => (await newsCollection().get()).docs.map((d) => ({ id: d.id, ...d.data() }));

// Newest first, the pinned article always on top (as the website did before).
const sortArticles = (list) =>
  [...list].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return b.year * 100 + b.month - (a.year * 100 + a.month);
  });

const markChanged = SiteMeta.markChanged;

const clean = (body) => ({
  title: { en: body.title.en, ar: body.title.ar || '' },
  content: { en: body.content.en, ar: body.content.ar || '' },
  excerpt: { en: body.excerpt?.en || '', ar: body.excerpt?.ar || '' },
  year: body.year,
  month: body.month,
  author: body.author || 'Wadi Degla Team',
  thumbnail: body.thumbnail || '',
  images: (body.images || []).map((i) => ({ src: i.src, alt: i.alt || '' })),
});

// Only one pinned article at a time.
const unpinOthers = async (keepId) => {
  const pinned = await newsCollection().where('pinned', '==', true).get();
  await Promise.all(pinned.docs.filter((d) => d.id !== keepId).map((d) => d.ref.update({ pinned: false })));
};

// Public list for the website: visible articles only.
NewsService.listPublic = async () => sortArticles((await allDocs()).filter((a) => a.hidden !== true));

// Admin list: everything, including hidden articles.
NewsService.listAll = async () => sortArticles(await allDocs());

NewsService.get = async (id) => {
  const doc = await newsCollection().doc(id).get();
  if (!doc.exists) throw httpError(404, 'Article not found');
  return { id: doc.id, ...doc.data() };
};

NewsService.create = async (body, by) => {
  checkPhotos(body);
  const existing = await allDocs();
  const taken = new Set(existing.map((a) => a.slug));
  let slug = body.slug || slugify(body.title.en);
  if (body.slug && taken.has(slug)) throw httpError(409, 'Another article already uses this web address.');
  for (let n = 2; taken.has(slug); n += 1) slug = `${slugify(body.title.en)}-${n}`;

  const now = Date.now();
  const data = {
    ...clean(body),
    slug,
    pinned: !!body.pinned,
    hidden: false,
    createdAt: now,
    updatedAt: now,
    updatedBy: by || null,
  };
  const ref = await newsCollection().add(data);
  if (data.pinned) await unpinOthers(ref.id);
  await markChanged(by);
  return { id: ref.id, ...data };
};

NewsService.update = async (id, body, by) => {
  checkPhotos(body);
  const before = await NewsService.get(id);
  const data = { ...clean(body), updatedAt: Date.now(), updatedBy: by || null };
  if (typeof body.pinned === 'boolean') data.pinned = body.pinned;
  await newsCollection().doc(id).update(data);
  if (data.pinned) await unpinOthers(id);

  // Uploaded photos that were removed from the article: delete them from Storage.
  const kept = new Set([data.thumbnail, ...data.images.map((i) => i.src)]);
  const removed = [before.thumbnail, ...(before.images || []).map((i) => i.src)].filter((l) => l && !kept.has(l));
  await StorageService.deleteStorageFiles([...new Set(removed)]);

  await markChanged(by);
  return { ...before, ...data };
};

NewsService.setHidden = async (id, hidden, by) => {
  await NewsService.get(id);
  await newsCollection()
    .doc(id)
    .update({ hidden, updatedAt: Date.now(), updatedBy: by || null });
  await markChanged(by);
  return { id, hidden };
};

NewsService.setPinned = async (id, pinned, by) => {
  await NewsService.get(id);
  await newsCollection()
    .doc(id)
    .update({ pinned, updatedAt: Date.now(), updatedBy: by || null });
  if (pinned) await unpinOthers(id);
  await markChanged(by);
  return { id, pinned };
};

// Like products: an article must be hidden before it can be deleted for good.
NewsService.remove = async (id, by) => {
  const article = await NewsService.get(id);
  if (article.hidden !== true) throw httpError(409, 'Hide the article first. Only hidden articles can be deleted permanently.');
  await newsCollection().doc(id).delete();
  // (a photo can be both the cover and in the gallery: delete each file once)
  await StorageService.deleteStorageFiles([...new Set([article.thumbnail, ...(article.images || []).map((i) => i.src)])]);
  await markChanged(by);
  return { id };
};

// Photos for an article: stored under uploads/News/, returns their public links.
NewsService.uploadPhotos = async (files) => Promise.all((files || []).map((f) => StorageService.uploadPhoto(f, 'News')));

// One-time copy of the articles that used to be in the website code. Only when the
// collection is empty, so it can never duplicate or overwrite anything.
NewsService.importExisting = async (by) => {
  const existing = await newsCollection().limit(1).get();
  if (!existing.empty) throw httpError(409, 'News articles already exist; nothing was imported.');
  const now = Date.now();
  const batch = db.batch();
  for (const a of importArticles) {
    const { legacyId, dateLabel, ...rest } = a;
    batch.set(newsCollection().doc(), {
      ...clean(rest),
      slug: a.slug,
      pinned: !!a.pinned,
      hidden: false,
      createdAt: now,
      updatedAt: now,
      updatedBy: by || null,
      importedFrom: `newsList.js#${legacyId}`,
    });
  }
  await batch.commit();
  await markChanged(by);
  return { imported: importArticles.length };
};

module.exports = NewsService;
