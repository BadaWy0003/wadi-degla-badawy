#!/usr/bin/env node
/**
 * Server smoke check: loads the REAL route files (server/src/start/routes.js) with a fake,
 * empty Firestore/Storage and a fake login, then calls the main addresses and compares each
 * answer with what it should be. Nothing touches the real database, email or Storage.
 *
 * It catches the mistakes that a mocked API misses: a route file that fails to load, a
 * wrong path, a missing require, the wrong role on an admin page, a crash on empty data.
 * Add a line to CHECKS when you add a route.
 *
 * Usage (from the repository root, after `npm ci` in server/):
 *   node tools/checks/server-check.js
 * Exit code 1 when an answer is not the expected one.
 */
const path = require('path');
const Module = require('module');

const SERVER = path.resolve(__dirname, '../../server');
const SRC = path.join(SERVER, 'src');
const NM = path.join(SERVER, 'node_modules');

// ---- fake, empty Firestore + Storage ----
const emptySnap = { docs: [], empty: true, size: 0, exists: false, data: () => undefined, forEach: () => {} };
const query = () => ({
  get: async () => emptySnap,
  where: query,
  orderBy: query,
  limit: query,
  offset: query,
  count: () => ({ get: async () => ({ data: () => ({ count: 0 }) }) }),
});
const docRef = (id = 'fake') => ({
  id,
  get: async () => ({ id, exists: false, data: () => undefined, ref: docRef(id) }),
  set: async () => {},
  update: async () => {},
  delete: async () => {},
  collection: () => collection(),
});
const collection = () => ({ ...query(), doc: docRef, add: async () => docRef('new') });
const db = {
  collection,
  collectionGroup: collection,
  listCollections: async () => [],
  batch: () => ({ set() {}, update() {}, delete() {}, commit: async () => {} }),
  runTransaction: async (fn) => fn({ get: async () => emptySnap, set() {}, update() {}, delete() {} }),
};
const bucket = { name: 'fake-bucket', file: () => ({ save: async () => {}, delete: async () => {}, makePublic: async () => {}, exists: async () => [false] }), getFiles: async () => [[]] };
class Firestore {
  collection(n) { return collection(n); }
}

// ---- fake login: the role comes from the x-role header ("none" = not logged in) ----
const auth = (kind) => (req, res, next) => {
  const role = req.headers['x-role'];
  if (!role || role === 'none') return res.status(401).json({ message: 'Unauthorized' });
  req.user = kind === 'admin' ? { id: 'a1', email: 'admin@test', role } : { id: 'c1', email: 'customer@test' };
  return next();
};

const stubs = {
  [path.join(SRC, 'start/firebase.js')]: { db, bucket },
  [path.join(SRC, 'middlewares/authenticate.middleware.js')]: { adminAuth: auth('admin'), customerAuth: auth('customer') },
  [require.resolve(path.join(NM, '@google-cloud/firestore'))]: { Firestore },
  [require.resolve(path.join(NM, 'nodemailer'))]: { createTransport: () => ({ sendMail: async () => ({}) }) },
};
const load = Module._load;
Module._load = function stubbed(request, parent, ...rest) {
  const file = Module._resolveFilename(request, parent, ...rest);
  return stubs[file] || load.call(this, request, parent, ...rest);
};
process.env.FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'fake-bucket';
const realFetch = globalThis.fetch; // kept for this script's own requests
global.fetch = async () => ({ ok: false, status: 503, json: async () => ({}) }); // no outside calls (GitHub, website)

// [method, address, role ('none' = logged out), expected status]
const CHECKS = [
  // public
  ['GET', '/api/index', 'none', 200], // health address for the uptime monitor (no database reads)
  ['GET', '/api/storage/all', 'none', 200],
  ['GET', '/api/storage/details', 'none', 200],
  ['GET', '/api/news', 'none', 200],
  ['GET', '/api/projects', 'none', 200],
  ['GET', '/api/content', 'none', 200],
  ['GET', '/api/order/my-invoices', 'none', 404], // removed 2026-11-20
  ['GET', '/api/storage/spec-sheet/unknown-stone?lang=ar', 'none', 404], // spec sheet PDF (2026-11-20)
  ['GET', '/api/storage/spec-sheet/bad!id', 'none', 400],
  ['GET', '/api/storage/catalogue?lang=ar', 'none', 404], // stone catalogue PDF (2026-11-21): 404 while there are no stones
  // admin pages: refused when logged out
  ['GET', '/api/overview/admin', 'none', 401],
  ['GET', '/api/enquiries/admin', 'none', 401],
  ['GET', '/api/storage/admin/all', 'none', 401],
  // moderators: products yes, the rest no
  ['GET', '/api/overview/admin', 'MODERATOR', 200],
  ['GET', '/api/storage/admin/all', 'MODERATOR', 200],
  ['GET', '/api/enquiries/admin', 'MODERATOR', 403],
  ['GET', '/api/news/admin/all', 'MODERATOR', 403],
  ['GET', '/api/projects/admin/all', 'MODERATOR', 403],
  ['GET', '/api/content/admin/blocks', 'MODERATOR', 403],
  // admins
  ['GET', '/api/overview/admin', 'ADMIN', 200],
  ['GET', '/api/enquiries/admin', 'ADMIN', 200],
  ['GET', '/api/enquiries/admin/count-new', 'ADMIN', 200],
  ['GET', '/api/news/admin/all', 'ADMIN', 200],
  ['GET', '/api/projects/admin/all', 'ADMIN', 200],
  ['GET', '/api/content/admin/blocks', 'ADMIN', 200],
  ['GET', '/api/content/admin/blocks/stonePage', 'ADMIN', 200],
  ['GET', '/api/content/admin/blocks/nope!', 'ADMIN', 400],
  ['GET', '/api/publish', 'ADMIN', 200],
  ['PUT', '/api/enquiries/admin/abc', 'ADMIN', 400, { status: 'deleted' }],
  ['PUT', '/api/enquiries/admin/abc', 'ADMIN', 404, { status: 'won' }],
  // website forms: a bot (honeypot filled) gets a quiet success, a bad email a 400
  ['POST', '/api/send-email', 'none', 200, { name: 'Bot', email: 'b@b.co', message: 'x', website: 'http://spam' }],
  ['POST', '/api/send-email', 'none', 400, { name: 'A', email: 'not-an-email', message: 'x' }],
  // a quote request from the website's quote list (2026-11-20)
  ['POST', '/api/send-email', 'none', 200, { name: 'Q', email: 'q@test.co', message: '', kind: 'quote', items: [{ name: 'Galala', finish: 'Polished', quantity: '1 container' }] }],
];

const express = require(path.join(NM, 'express'));
const app = express();
app.use(express.json());
require(path.join(SRC, 'start/routes.js'))(app);

const server = app.listen(0, async () => {
  const base = `http://127.0.0.1:${server.address().port}`;
  let failed = 0;
  for (const [method, url, role, expected, body] of CHECKS) {
    let status;
    try {
      const res = await realFetch(base + url, {
        method,
        headers: { 'x-role': role, ...(body ? { 'content-type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      status = res.status;
    } catch (e) {
      status = `error ${e.message}`;
    }
    const ok = status === expected;
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${method.padEnd(4)} ${url} as ${role}: ${status}${ok ? '' : ` (expected ${expected})`}`);
  }
  console.log(`RESULT: ${failed ? `${failed} of ${CHECKS.length} failed` : `all ${CHECKS.length} as expected`}`);
  server.close();
  process.exit(failed ? 1 : 0);
});
