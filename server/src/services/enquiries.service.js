// Enquiries inbox: every message sent through the website's contact form and sample-request
// form is saved in Firestore `enquiries` (col('enquiries')) before the email is sent, so a lead
// is never lost when the email fails. The admin panel lists them (ADMIN/SUPER_ADMIN), with a
// status (new / replied / won / lost / spam) and a private note.
//
// An attached file is kept privately in Storage under enquiries/<id>/ (no public link); the
// admin panel downloads it through the server.

const { db, bucket } = require('../start/firebase');
const { col, storagePath } = require('../start/data-area');

const STATUSES = ['new', 'replied', 'won', 'lost', 'spam'];
const KINDS = ['contact', 'sample'];
const LIST_LIMIT = 1000;

const enquiriesCol = () => db.collection(col('enquiries'));
const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

// The forms send small HTML snippets: turn them into plain text for the inbox.
const htmlToText = (html) =>
  String(html || '')
    .replace(/<\s*(br|\/p|\/li)\s*\/?>/gi, '\n')
    .replace(/<\s*li\s*>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

// Older website versions only send "<p><strong>Phone:</strong> …</p>" lines: read them too.
const LABELS = {
  'company/project': 'company',
  phone: 'phone',
  whatsapp: 'whatsapp',
  country: 'country',
  address: 'address',
  'port of destination': 'port',
  product: 'product',
  finish: 'finish',
};
const readLabelled = (html) => {
  const out = {};
  for (const m of String(html || '').matchAll(/(?:<strong>)?\s*([A-Za-z/ ]+?):\s*(?:<\/strong>)?\s*(?:<strong>)?([^<]*)/g)) {
    const key = LABELS[m[1].trim().toLowerCase()];
    const value = m[2].trim();
    if (key && value && value !== 'undefined' && !out[key]) out[key] = value.slice(0, 200);
  }
  return out;
};

// The enquiry as stored, from the form's body (already checked by the email route).
const fromForm = (body, { name, email, message, extraFields, subject }) => {
  const parsed = { ...readLabelled(extraFields), ...readLabelled(message) };
  const pick = (k, max = 200) => clean(body[k], max) || parsed[k] || '';
  let kind = clean(body.kind, 20);
  if (!KINDS.includes(kind)) kind = /sample/i.test(subject) ? 'sample' : 'contact';
  return {
    kind,
    status: 'new',
    name,
    email,
    phone: pick('phone', 40),
    whatsapp: pick('whatsapp', 40),
    company: pick('company'),
    country: pick('country', 80),
    address: pick('address', 300),
    port: pick('port'),
    product: pick('product'),
    finish: pick('finish', 80),
    // the sample form has no message of its own (it only repeats the stone and finish)
    message: kind === 'sample' ? '' : htmlToText(message).slice(0, 5000),
    page: clean(body.page, 300),
    lang: clean(body.lang, 5),
    note: '',
    attachment: null,
    emailSent: null,
    createdAt: Date.now(),
  };
};

const EnquiriesService = {};

// Saves the enquiry (and its file) and returns its id; the email is sent afterwards.
EnquiriesService.save = async (body, fields, file) => {
  const ref = enquiriesCol().doc();
  const doc = fromForm(body, fields);
  if (file) {
    const fileName = String(file.originalname || 'attachment')
      .replace(/[^\w.\- ]+/g, '_')
      .slice(-100);
    const path = storagePath(`enquiries/${ref.id}/${fileName}`);
    await bucket.file(path).save(file.buffer, { contentType: file.mimetype, resumable: false });
    doc.attachment = { path, name: fileName, size: file.size, type: file.mimetype };
  }
  await ref.set(doc);
  return ref.id;
};

EnquiriesService.markEmail = async (id, sent) => {
  if (id) await enquiriesCol().doc(id).set({ emailSent: sent }, { merge: true });
};

// Admin: newest first (the last 1000).
EnquiriesService.list = async () => {
  const snap = await enquiriesCol().orderBy('createdAt', 'desc').limit(LIST_LIMIT).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Admin: how many are new (for the menu badge).
EnquiriesService.countNew = async () => {
  const snap = await enquiriesCol().where('status', '==', 'new').count().get();
  return snap.data().count;
};

EnquiriesService.update = async (id, { status, note }, by) => {
  const ref = enquiriesCol().doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw httpError(404, 'This enquiry no longer exists.');
  const change = { updatedAt: Date.now(), updatedBy: by || null };
  if (status !== undefined) change.status = status;
  if (note !== undefined) change.note = note;
  await ref.set(change, { merge: true });
  return { id, ...doc.data(), ...change };
};

// Admin: the attached file (streamed by the route).
EnquiriesService.attachment = async (id) => {
  const doc = await enquiriesCol().doc(id).get();
  const a = doc.exists ? doc.data().attachment : null;
  if (!a?.path) throw httpError(404, 'This enquiry has no file.');
  return { file: bucket.file(a.path), name: a.name, type: a.type };
};

EnquiriesService.STATUSES = STATUSES;
module.exports = EnquiriesService;
