// Admin panel home page ("what needs attention"): one call that gathers the numbers and the
// content gaps from Firestore. Moderators get the stone checks only; Admins and Super Admins
// also get enquiries, the website's publish state, projects, news and the Patterns names.
// About 250 document reads per call (well inside Firestore's free daily quota).

const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const PublishService = require('./publish.service');
const EnquiriesService = require('./enquiries.service');

// The website shows stones of these categories only (client-next src/util/product-types.js).
const CATEGORIES = ['Egyptian Marble', 'Egyptian Limestone', 'Egyptian Granite', 'Imported Marble', 'Imported Granite'];
const CATEGORY_ALIASES = { 'Egyptian Emperador': 'Egyptian Marble', 'Egyptian Onyx': 'Egyptian Marble' };
const ROOM_FINISHES = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];
const LIST_MAX = 12; // names shown per item

const all = async (name) => (await db.collection(col(name)).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const text = (v, lang) => (v && typeof v === 'object' ? String(v[lang] || '').trim() : '');
const names = (list, pick) => list.slice(0, LIST_MAX).map(pick);

// One line of the "Needs attention" list. level: 'important' (visitors see a gap) or 'tip'.
const item = (id, level, count, label, path, list = []) => (count ? { id, level, count, label, path, names: list } : null);

const stoneChecks = (materials, details) => {
  const stones = materials.filter((m) => String(m.type || '').trim() !== 'Gallery');
  const visible = stones.filter((m) => m.hidden !== true);
  const category = (m) => {
    const t = String(m.type || '').trim();
    return CATEGORY_ALIASES[t] || t;
  };
  const photos = (m) => (m.finishes || []).filter((f) => f?.link && !ROOM_FINISHES.includes(f.finish));
  const byId = new Map(details.map((d) => [d.id, d]));

  const noCategory = visible.filter((m) => !CATEGORIES.includes(category(m)));
  const noCardPhoto = visible.filter((m) => !(m.finishes || []).some((f) => f?.link && ['Honed', 'Polished'].includes(f.finish)));
  const noDetails = visible.filter((m) => !text(byId.get(m.id)?.description, 'en'));
  const noArabic = visible.filter((m) => text(byId.get(m.id)?.description, 'en') && !text(byId.get(m.id)?.description, 'ar'));
  // technical data from the client's lab reports (Stones → open the stone → Specifications &
  // uses); without any value the stone page and spec sheet show no "Technical data" table
  const noTech = visible.filter((m) => !Object.values(byId.get(m.id)?.tech || {}).some((v) => typeof v === 'number'));
  const noRoom = visible.filter((m) => !(m.finishes || []).some((f) => f?.link && ['indoorMockup', 'mockup'].includes(f.finish)));
  const missingCopies = materials.reduce(
    (n, m) => n + (m.finishes || []).filter((f) => f?.link && (!f.thumb || !f.mini)).length,
    0,
  );
  const stoneName = (m) => String(m.name || '').trim();

  return {
    stats: {
      stones: visible.length,
      hiddenStones: stones.length - visible.length,
      galleryPhotos: materials.filter((m) => String(m.type || '').trim() === 'Gallery').length,
      stonePhotos: visible.reduce((n, m) => n + photos(m).length, 0),
    },
    items: [
      item(
        'noCategory',
        'important',
        noCategory.length,
        "Stones in a category the website doesn't know (shown nowhere)",
        '/products',
        names(noCategory, (m) => `${stoneName(m)} (${String(m.type || '').trim() || 'no category'})`),
      ),
      item(
        'noCardPhoto',
        'important',
        noCardPhoto.length,
        'Stones without a Honed or Polished photo (their card has no picture)',
        '/products',
        names(noCardPhoto, stoneName),
      ),
      item(
        'noDetails',
        'important',
        noDetails.length,
        'Stones without a description (Stones → open the stone → Description)',
        '/products',
        names(noDetails, stoneName),
      ),
      item(
        'missingCopies',
        'tip',
        missingCopies,
        'Photos without small copies (Stones → Create small photos)',
        '/products',
      ),
      item('noArabic', 'tip', noArabic.length, 'Stones without an Arabic description', '/products', names(noArabic, stoneName)),
      item(
        'noTech',
        'tip',
        noTech.length,
        'Stones without technical data (Stones → open the stone → Specifications & uses)',
        '/products',
        names(noTech, stoneName),
      ),
      item(
        'noRoom',
        'tip',
        noRoom.length,
        'Stones without a room photo (not in the Visualizer)',
        '/products',
        names(noRoom, stoneName),
      ),
    ].filter(Boolean),
  };
};

const adminChecks = async () => {
  const [projects, news, patternsDoc, publish, newCount, recent] = await Promise.all([
    all('projects'),
    all('news'),
    db.collection(col('site_content')).doc('patterns').get(),
    PublishService.status().catch(() => null),
    EnquiriesService.countNew(),
    // only the new ones (no extra index needed), newest first
    db
      .collection(col('enquiries'))
      .where('status', '==', 'new')
      .limit(200)
      .get()
      .then((snap) =>
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          .slice(0, 5)
          .map((e) => ({
            id: e.id,
            name: e.name,
            kind: e.kind,
            product: e.product || '',
            country: e.country || '',
            createdAt: e.createdAt,
            emailSent: e.emailSent,
          })),
      ),
  ]);

  const shownProjects = projects.filter((p) => p.hidden !== true);
  const pName = (p) => text(p.name, 'en') || `#${p.id}`;
  const noDescription = shownProjects.filter((p) => !text(p.description, 'en'));
  const noArabicProject = shownProjects.filter((p) => text(p.description, 'en') && !text(p.description, 'ar'));
  const noPhotos = shownProjects.filter((p) => !(p.images || []).length && !p.thumbnail);
  const shownNews = news.filter((a) => a.hidden !== true);
  const noArabicNews = shownNews.filter((a) => !text(a.title, 'ar') || !text(a.content, 'ar'));
  const patternData = (patternsDoc.exists && patternsDoc.data().data) || {};
  const unnamed = [1, 2, 3, 4]
    .map((n) => `paver${n}`)
    .concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `split${n}`))
    .filter((k) => !String(patternData[k] || '').trim());

  return {
    enquiries: { newCount, recent },
    publish: publish && {
      unpublishedChanges: publish.unpublishedChanges,
      lastPublishAt: publish.lastPublishAt,
      run: publish.run,
    },
    stats: { projects: shownProjects.length, news: shownNews.length },
    items: [
      item('projectNoPhotos', 'important', noPhotos.length, 'Projects without photos', '/projects', names(noPhotos, pName)),
      item(
        'patternsUnnamed',
        'important',
        unnamed.length,
        'Patterns stones without a name (shown as "Stone 1", "Stone 2"…)',
        '/website/patterns',
      ),
      item(
        'projectNoDescription',
        'tip',
        noDescription.length,
        'Projects without a description',
        '/projects',
        names(noDescription, pName),
      ),
      item(
        'projectNoArabic',
        'tip',
        noArabicProject.length,
        'Projects without an Arabic description (their Arabic page is hidden from Google)',
        '/projects',
        names(noArabicProject, pName),
      ),
      item(
        'newsNoArabic',
        'tip',
        noArabicNews.length,
        'News without Arabic text (their Arabic page is hidden from Google)',
        '/news',
        names(noArabicNews, (a) => text(a.title, 'en')),
      ),
    ].filter(Boolean),
  };
};

const OverviewService = {};

OverviewService.get = async (role) => {
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const [materials, details, admin] = await Promise.all([
    all('materials'),
    all('product_details'),
    isAdmin ? adminChecks() : Promise.resolve(null),
  ]);
  const stones = stoneChecks(materials, details);
  const order = { important: 0, tip: 1 };
  return {
    isAdmin,
    stats: { ...stones.stats, ...(admin?.stats || {}) },
    enquiries: admin?.enquiries || null,
    publish: admin?.publish || null,
    items: [...stones.items, ...(admin?.items || [])].sort((a, b) => order[a.level] - order[b.level]),
  };
};

module.exports = OverviewService;
