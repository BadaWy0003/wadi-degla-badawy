// Bookkeeping for "Publish to website", shared by everything the website reads at build
// time (news, projects): when something was last changed and when the website was last
// published. Stored in site_meta/news (the name is historical: news came first).

const { db } = require('../start/firebase');
const { col } = require('../start/data-area');

const metaDoc = () => db.collection(col('site_meta')).doc('news');

const SiteMeta = {};

SiteMeta.get = async () => {
  const doc = await metaDoc().get();
  return doc.exists ? doc.data() : {};
};

SiteMeta.set = async (data) => metaDoc().set(data, { merge: true });

// Remember that the website no longer matches the database (shown in the admin panel).
SiteMeta.markChanged = async (by) => SiteMeta.set({ lastChangeAt: Date.now(), lastChangeBy: by || null });

module.exports = SiteMeta;
