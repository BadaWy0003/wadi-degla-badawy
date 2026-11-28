// One-time fixes from the website audit (owner, 2026-11-25), run at server start until they have
// run once (flag site_meta/news.auditFixesAt). Data: server/src/data/audit-fixes-2026-11-25.json.
//  1. every stone's thickness becomes "1–8" (cm)
//  2. the Egyptian limestones' descriptions say "limestone", never "marble" (all 12 languages);
//     a description is only replaced while its English text is still the one the fix was written
//     from, so a text the client edited since is kept
//  3. two project names with typos are corrected (only while they still have the typo)
//  4. the Exports page's payment text saved in the admin panel ("50% After Shipping") is removed,
//     so the website's own text applies (50% deposit, 50% against copy of B/L, all 12 languages);
//     saved through the content service, so the History dialog keeps the old version
const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const SiteMeta = require('./site-meta.service');
const SiteContent = require('./site-content.service');

const BY = 'website audit fixes';

const AuditFixes = {};

AuditFixes.apply = async () => {
  const meta = await SiteMeta.get();
  if (meta.auditFixesAt) return;
  const fixes = require('../data/audit-fixes-2026-11-25.json');
  const now = Date.now();
  const done = { thicknesses: 0, descriptions: 0, projects: 0, texts: 0 };

  // 1 + 2: stone details (every stone of the 5 categories; Gallery photos have no details)
  const [materials, details] = await Promise.all([db.collection(col('materials')).get(), db.collection(col('product_details')).get()]);
  const detailById = Object.fromEntries(details.docs.map((d) => [d.id, d.data()]));
  const descById = Object.fromEntries(fixes.descriptions.map((d) => [d.id, d]));
  const batch = db.batch();
  for (const m of materials.docs) {
    if (String(m.data().type || '').trim() === 'Gallery') continue;
    const before = detailById[m.id] || {};
    const update = { thicknesses: fixes.thicknesses, updatedAt: now, updatedBy: BY };
    done.thicknesses += 1;
    const fix = descById[m.id];
    if (fix && String(before.description?.en || '').trim() === fix.oldEn.trim()) {
      update.description = fix.description;
      done.descriptions += 1;
    }
    batch.set(db.collection(col('product_details')).doc(m.id), update, { merge: true });
  }
  // 3: project names
  for (const p of fixes.projects) {
    const ref = db.collection(col('projects')).doc(p.id);
    const doc = await ref.get();
    if (doc.exists && String(doc.data().name?.en || '').trim() === p.old) {
      batch.set(ref, { name: { ...doc.data().name, en: p.new } }, { merge: true });
      done.projects += 1;
    }
  }
  await batch.commit();

  // 4: texts saved in the admin panel that the website's own texts now replace
  for (const r of fixes.removeTexts) {
    const doc = await db.collection(col('site_content')).doc(r.block).get();
    const saved = doc.exists ? doc.data() : {};
    if (!saved.texts || !(r.key in saved.texts)) continue;
    const texts = { ...saved.texts };
    delete texts[r.key];
    await SiteContent.saveBlock(r.block, { texts, data: saved.data || {} }, BY);
    done.texts += 1;
  }

  await SiteMeta.set({ auditFixesAt: now });
  await SiteMeta.markChanged(BY);
  console.log('[audit-fixes] applied', JSON.stringify(done));
};

// Second set of one-time fixes (owner, 2026-11-28, after the client's design/text audit), run at
// server start until they have run once (flag site_meta/news.auditFixes2At). Each fix only
// applies while the old text is still there, so anything edited since is kept:
//  1. "Sunny Menia …" is removed from every stone's "Also known as" (the company keeps that
//     name off the site; it came in with the test sheet import)
//  2. stone names with a space before/after them are trimmed (Border Beige, Breccia Daino,
//     Oriental White; the web address doesn't change)
//  3. the Viva Miches news post: "and and" → "and"
//  4. project 15: "viva tangerine by wyndham (full remodelation)" → proper capitals, "Full Renovation"
const PROJECT_15 = { old: 'viva tangerine by wyndham (full remodelation)', new: 'Viva Tangerine by Wyndham (Full Renovation)' };
AuditFixes.applySecond = async () => {
  const meta = await SiteMeta.get();
  if (meta.auditFixes2At) return;
  const BY2 = 'website audit fixes 2';
  const now = Date.now();
  const done = { otherNames: 0, names: 0, news: 0, projects: 0 };
  const batch = db.batch();
  const details = await db.collection(col('product_details')).get();
  for (const d of details.docs) {
    const names = d.data().otherNames || [];
    const kept = names.filter((n) => !/menia/i.test(String(n)));
    if (kept.length === names.length) continue;
    batch.set(d.ref, { otherNames: kept, updatedAt: now, updatedBy: BY2 }, { merge: true });
    done.otherNames += 1;
  }
  const materials = await db.collection(col('materials')).get();
  for (const m of materials.docs) {
    const name = m.data().name;
    if (typeof name !== 'string' || name === name.trim()) continue;
    batch.set(m.ref, { name: name.trim() }, { merge: true });
    done.names += 1;
  }
  const news = await db.collection(col('news')).get();
  for (const n of news.docs) {
    const en = n.data().content?.en;
    if (typeof en !== 'string' || !/\band and\b/.test(en)) continue;
    batch.set(n.ref, { content: { ...n.data().content, en: en.replace(/\band and\b/g, 'and') } }, { merge: true });
    done.news += 1;
  }
  const project = await db.collection(col('projects')).doc('15').get();
  if (project.exists && String(project.data().name?.en || '').trim() === PROJECT_15.old) {
    batch.set(project.ref, { name: { ...project.data().name, en: PROJECT_15.new } }, { merge: true });
    done.projects += 1;
  }
  await batch.commit();
  await SiteMeta.set({ auditFixes2At: now });
  await SiteMeta.markChanged(BY2);
  console.log('[audit-fixes-2] applied', JSON.stringify(done));
};

module.exports = AuditFixes;
