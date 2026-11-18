// "Unused photos" (admin panel, Website page): finds uploaded photos that nothing uses any
// more and moves them to a bin, so they stop costing Storage.
//
// Safety rules:
//   - Only files under uploads/ are looked at (never documents/ = invoices).
//   - A file counts as used when its path appears in ANY Firestore document of this
//     environment: every top-level collection plus every "versions" subcollection (the
//     website content History, so restoring an old version never points at a missing photo).
//   - Files uploaded in the last 7 days are skipped (a form may still be open).
//   - Nothing is moved while the website has unpublished changes or a website update is
//     running / failed: the live site may still show a photo that was just removed.
//   - Photos go to a private bin (trash/...) first. "Put them back" restores them; photos
//     in the bin for more than 30 days are deleted for good at the next clean-up.

const { db, bucket } = require('../start/firebase');
const { DATA_PREFIX, IS_STAGING, STORAGE_PREFIX, storagePath, canDeleteStoragePath } = require('../start/data-area');
const PublishService = require('./publish.service');

const DAY = 24 * 60 * 60 * 1000;
const MIN_AGE_MS = 7 * DAY;
const BIN_KEEP_MS = 30 * DAY;
const MAX_PER_CALL = 300;

const UPLOADS = () => storagePath('uploads/');
const BIN = () => storagePath('trash/');

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const publicUrl = (path) => `https://storage.googleapis.com/${bucket.name}/${path}`;

// Every string inside a Firestore value (also URL-decoded, for firebasestorage links).
const collectStrings = (value, out) => {
  if (typeof value === 'string') {
    out.push(value);
    if (value.includes('%')) {
      try {
        out.push(decodeURIComponent(value));
      } catch {
        // not URL-encoded: the raw string is enough
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, out));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((v) => collectStrings(v, out));
  }
};

// One big text with every string of every document of this environment.
const referenceText = async () => {
  const strings = [];
  const collections = await db.listCollections();
  // Production reads all collections (also staging_*: more references only means safer);
  // staging only its own.
  const mine = collections.filter((c) => !DATA_PREFIX || c.id.startsWith(DATA_PREFIX));
  for (const c of mine) {
    const snap = await c.get();
    snap.docs.forEach((d) => collectStrings(d.data(), strings));
  }
  const versions = await db.collectionGroup('versions').get();
  versions.docs.forEach((d) => collectStrings(d.data(), strings));
  return strings.join('\n');
};

const fileInfo = (f) => ({
  path: f.name,
  size: Number(f.metadata.size) || 0,
  createdAt: Date.parse(f.metadata.timeCreated) || 0,
});

// Why a clean-up can't run right now ('' = it can).
const blockedReason = async () => {
  const status = await PublishService.status();
  if (status.unpublishedChanges) {
    return 'There are changes that are not on the website yet. Press "Publish to website" first and wait until it has finished.';
  }
  if (status.run && status.run.status !== 'completed') {
    return 'The website is being updated. Please wait until it has finished.';
  }
  if (status.run && status.run.conclusion !== 'success') {
    return 'The last website update did not finish. Publish again and wait until it has finished.';
  }
  return '';
};

const scan = async () => {
  const [[files], refs] = await Promise.all([bucket.getFiles({ prefix: UPLOADS() }), referenceText()]);
  const now = Date.now();
  const unused = [];
  let recent = 0;
  for (const f of files) {
    if (f.name.endsWith('/')) continue; // folder marker
    if (refs.includes(f.name)) continue;
    const info = fileInfo(f);
    if (now - info.createdAt < MIN_AGE_MS) {
      recent += 1;
      continue;
    }
    unused.push(info);
  }
  unused.sort((a, b) => b.size - a.size);
  return { unused, recent, totalFiles: files.length };
};

const binSummary = async () => {
  const [files] = await bucket.getFiles({ prefix: BIN() });
  const items = files.filter((f) => !f.name.endsWith('/')).map(fileInfo);
  return {
    count: items.length,
    bytes: items.reduce((s, i) => s + i.size, 0),
    oldestAt: items.length ? Math.min(...items.map((i) => i.createdAt)) : null,
  };
};

// Runs fn over items, a few at a time.
const eachLimited = async (items, fn, limit = 5) => {
  let i = 0;
  const worker = async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
};

const UnusedPhotos = {};

UnusedPhotos.list = async () => {
  const [{ unused, recent, totalFiles }, blocked, bin] = await Promise.all([scan(), blockedReason(), binSummary()]);
  return {
    blocked,
    files: unused.map((u) => ({ ...u, url: publicUrl(u.path) })),
    totalBytes: unused.reduce((s, u) => s + u.size, 0),
    recentSkipped: recent,
    totalFiles,
    bin,
    staging: IS_STAGING,
  };
};

// Moves the chosen photos to the bin, after checking again that each one is still unused.
UnusedPhotos.clean = async (paths) => {
  if (!Array.isArray(paths) || !paths.length) throw httpError(400, 'No photos chosen.');
  if (paths.length > MAX_PER_CALL) throw httpError(400, `At most ${MAX_PER_CALL} photos at a time.`);
  const blocked = await blockedReason();
  if (blocked) throw httpError(409, blocked);

  const { unused } = await scan();
  const stillUnused = new Set(unused.map((u) => u.path));
  const chosen = [...new Set(paths)].filter((p) => typeof p === 'string' && stillUnused.has(p) && canDeleteStoragePath(p));

  let moved = 0;
  let failed = 0;
  await eachLimited(chosen, async (p) => {
    try {
      await bucket.file(p).move(BIN() + p.slice(STORAGE_PREFIX.length));
      moved += 1;
    } catch (error) {
      failed += 1;
      console.error('Unused photos: move failed:', error.message);
    }
  });

  // Empty what has been in the bin for more than 30 days.
  const [binFiles] = await bucket.getFiles({ prefix: BIN() });
  const old = binFiles.filter((f) => Date.now() - fileInfo(f).createdAt > BIN_KEEP_MS && canDeleteStoragePath(f.name));
  let deleted = 0;
  await eachLimited(old, async (f) => {
    try {
      await f.delete();
      deleted += 1;
    } catch (error) {
      console.error('Unused photos: delete failed:', error.message);
    }
  });

  return { moved, failed, skipped: paths.length - chosen.length, deletedFromBin: deleted };
};

// Puts every photo in the bin back where it was (public again).
UnusedPhotos.restore = async () => {
  const [files] = await bucket.getFiles({ prefix: BIN() });
  let restored = 0;
  let failed = 0;
  await eachLimited(
    files.filter((f) => !f.name.endsWith('/')),
    async (f) => {
      try {
        const back = storagePath(f.name.slice(BIN().length));
        await f.move(back);
        await bucket.file(back).makePublic();
        restored += 1;
      } catch (error) {
        failed += 1;
        console.error('Unused photos: restore failed:', error.message);
      }
    },
  );
  return { restored, failed };
};

module.exports = UnusedPhotos;
