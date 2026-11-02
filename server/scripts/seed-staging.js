#!/usr/bin/env node
// Copies the production products and gallery (Firestore "materials") into staging
// ("staging_materials"), so the staging website and admin panel have real content.
// Runs ONLY on the staging server app:
//
//   fly ssh console -a wadi-degla-server-staging
//   node /app/scripts/seed-staging.js            # only if staging_materials is empty
//   node /app/scripts/seed-staging.js --replace  # wipe staging_materials and copy again
//
// Production is only read, never written. The copied products keep their production
// photo links (photos are not copied, so this costs nothing); staging can't delete those
// photos (src/start/data-area.js), and new photos uploaded on staging go to "staging/".

const { IS_STAGING, col } = require('../src/start/data-area');

const BATCH_SIZE = 400; // Firestore allows 500 writes per batch

async function seed(db, { replace = false } = {}, log = console.log) {
  if (!IS_STAGING) throw new Error('Refusing to run: this is not the staging server (DATA_PREFIX is not set).');

  const source = db.collection('materials'); // production, read only
  const target = db.collection(col('materials')); // staging_materials
  if (target.path === source.path) throw new Error('Source and target are the same collection.');

  const existing = await target.get();
  if (!existing.empty && !replace) {
    log(`${target.path} already has ${existing.size} documents. Use --replace to copy again.`);
    return 0;
  }

  let batch = db.batch();
  let pending = 0;
  const flush = async () => {
    if (pending) await batch.commit();
    batch = db.batch();
    pending = 0;
  };

  for (const doc of existing.docs) {
    batch.delete(doc.ref);
    if (++pending >= BATCH_SIZE) await flush();
  }
  await flush();

  const products = await source.get();
  for (const doc of products.docs) {
    batch.set(target.doc(doc.id), doc.data()); // same ids, so links between environments match
    if (++pending >= BATCH_SIZE) await flush();
  }
  await flush();

  log(`Copied ${products.size} documents from ${source.path} to ${target.path}.`);
  return products.size;
}

if (require.main === module) {
  const { db } = require('../src/start/firebase'); // eslint-disable-line global-require
  seed(db, { replace: process.argv.includes('--replace') })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = { seed };
