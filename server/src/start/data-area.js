// Which part of Firebase this server may use.
//
// Production and staging share one Firebase project. Staging keeps its data apart:
//   - Firestore collections get the prefix "staging_" (staging_materials, staging_admins, ...)
//   - Storage files live under "staging/" (staging/uploads/..., staging/documents/...)
// Set DATA_PREFIX=staging_ on the staging app (fly.staging.toml). Production leaves it unset.
//
// Every collection and storage path in the server goes through these helpers, and staging
// refuses to delete any file outside "staging/" (staging products may point at production
// photos, which must never be deleted from staging).

const ALLOWED_PREFIXES = ['', 'staging_'];

const DATA_PREFIX = process.env.DATA_PREFIX || '';
const IS_STAGING = DATA_PREFIX !== '';
const STORAGE_PREFIX = IS_STAGING ? 'staging/' : '';

// Fail fast on a typo, or on a staging app that forgot its prefix (it would write to production).
const checkDataArea = () => {
  if (!ALLOWED_PREFIXES.includes(DATA_PREFIX)) {
    throw new Error(`DATA_PREFIX must be empty (production) or "staging_", got "${DATA_PREFIX}"`);
  }
  const appName = process.env.FLY_APP_NAME || '';
  if (appName.includes('staging') && !IS_STAGING) {
    throw new Error(`App ${appName} looks like staging but DATA_PREFIX is not set: refusing to use production data.`);
  }
};
checkDataArea();

// Firestore collection name for this environment ("materials" -> "staging_materials").
const col = (name) => `${DATA_PREFIX}${name}`;

// Storage path for this environment ("uploads/x.webp" -> "staging/uploads/x.webp").
const storagePath = (path) => `${STORAGE_PREFIX}${path}`;

// May this environment delete the file at this storage path?
const canDeleteStoragePath = (path) => !IS_STAGING || path.startsWith(STORAGE_PREFIX);

module.exports = { DATA_PREFIX, IS_STAGING, STORAGE_PREFIX, col, storagePath, canDeleteStoragePath };
