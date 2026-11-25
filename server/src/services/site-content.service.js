// Website content edited in the admin panel ("Website" menu). One Firestore doc per block
// (see src/content/blocks.js): site_content/<blockId> = { texts, data, updatedAt, updatedBy }.
// Only the fields the client changed are stored; the website uses its own value for the rest.
// Every save keeps the previous version in site_content/<blockId>/versions (last 30), so a
// change can be undone. The website reads GET /api/content at build time, so changes go live
// with "Publish to website".

const { db } = require('../start/firebase');
const { col, IS_STAGING } = require('../start/data-area');
const SiteMeta = require('./site-meta.service');
const StorageService = require('./storage.service');
const { BLOCKS, WEEKDAYS, getBlock, fieldsOf } = require('../content/blocks');

const contentCol = () => db.collection(col('site_content'));
const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const KEEP_VERSIONS = 30;

// The website's own texts and values ("originals"), published by every website build at
// /<lang>/content-defaults.json. Cached for 10 minutes.
const SITE_URL = process.env.SITE_URL || 'https://www.wadidegla-eg.com';
let defaultsCache = { at: 0, value: null };
const fetchJson = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};
const loadDefaults = async () => {
  if (defaultsCache.value && Date.now() - defaultsCache.at < 10 * 60 * 1000) return defaultsCache.value;
  try {
    const [en, ar] = await Promise.all([
      fetchJson(`${SITE_URL}/en/content-defaults.json`),
      fetchJson(`${SITE_URL}/ar/content-defaults.json`),
    ]);
    defaultsCache = { at: Date.now(), value: { en, ar } };
  } catch (e) {
    console.error('Content defaults unavailable:', e.message);
    if (!defaultsCache.value) return { en: { texts: {}, data: {} }, ar: { texts: {}, data: {} } };
  }
  return defaultsCache.value;
};

const getPath = (obj, path) => path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), obj);

// The original value of every field of a block: texts { key: { en, ar } }, data { name: value }.
const defaultsFor = async (block) => {
  const d = await loadDefaults();
  const texts = {};
  const data = {};
  for (const f of fieldsOf(block)) {
    if (f.type === 'text') {
      texts[f.key] = { en: getPath(d.en.texts, f.key) ?? '', ar: getPath(d.ar.texts, f.key) ?? '' };
    } else {
      data[f.name] = d.en.data?.[block.id]?.[f.name] ?? null;
    }
  }
  return { texts, data };
};

// ---------- validation (against the block's field list) ----------
const URL_RE = /^https:\/\/[^\s<>"]+$/i;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[0-9][0-9 ()-]{5,22}$/;

const cleanText = (value, field) => {
  if (!value || typeof value !== 'object') throw httpError(400, `${field.label}: invalid text.`);
  const out = {};
  for (const lang of ['en', 'ar']) {
    if (value[lang] === undefined) continue;
    if (typeof value[lang] !== 'string') throw httpError(400, `${field.label}: invalid text.`);
    const v = value[lang].replace(/\r\n/g, '\n').trim();
    const max = field.max || (field.multiline ? 5000 : 500);
    if (v.length > max) throw httpError(400, `${field.label}: at most ${max} characters.`);
    if (/<\s*\/?\s*script/i.test(v)) throw httpError(400, `${field.label}: HTML scripts are not allowed.`);
    out[lang] = v;
  }
  if (!out.en) throw httpError(400, `${field.label}: the English text can't be empty.`);
  // {{name}}-style blanks the website fills in (e.g. the stone's name) must stay in the text
  for (const ph of field.placeholders || []) {
    for (const lang of ['en', 'ar']) {
      if (out[lang] && !out[lang].includes(`{{${ph}}}`))
        throw httpError(400, `${field.label}: keep {{${ph}}} in the ${lang === 'en' ? 'English' : 'Arabic'} text (the website puts the real value there).`);
    }
  }
  return out;
};

// A photo: { src, width, height }; src is our own upload or a website photo.
const cleanImage = (value, bad, field = {}) => {
  const v = value && typeof value === 'object' ? value : {};
  const src = String(v.src || '');
  if (!StorageService.isOwnStorageUrl(src) && !/^\/Assets\/[A-Za-z0-9._\-/]+$/.test(src))
    throw bad('upload the photo through the admin panel.');
  const width = Math.round(Number(v.width));
  const height = Math.round(Number(v.height));
  if (!(width > 0 && width < 20000 && height > 0 && height < 20000)) throw bad('the photo size is missing; upload it again.');
  // Some places need a photo of a given shape (e.g. the home page's phone header).
  if (field.ratio && !src.startsWith('/Assets/')) {
    const r = width / height;
    if (r < field.ratio[0] || r > field.ratio[1]) throw bad(field.ratioHelp || 'the photo has the wrong shape.');
  }
  return { src, width, height };
};

const cleanData = (value, field) => {
  const bad = (msg) => httpError(400, `${field.label}: ${msg}`);
  switch (field.type) {
    case 'number': {
      const n = Number(value);
      if (!Number.isFinite(n) || !Number.isInteger(n)) throw bad('enter a whole number.');
      if (n < field.min || n > field.max) throw bad(`must be between ${field.min} and ${field.max}.`);
      return n;
    }
    case 'hour': {
      const n = Number(value);
      if (!Number.isInteger(n) || n < 0 || n > 24) throw bad('enter an hour from 0 to 24.');
      return n;
    }
    case 'phone': {
      const v = String(value || '').trim();
      if (!PHONE_RE.test(v)) throw bad('enter a phone number such as +20 10 6726 0314.');
      return v;
    }
    case 'email': {
      const v = String(value || '')
        .trim()
        .toLowerCase();
      if (!EMAIL_RE.test(v)) throw bad('enter a valid email address.');
      return v;
    }
    case 'url': {
      const v = String(value || '').trim();
      if (!URL_RE.test(v) || v.length > 500) throw bad('enter a full link starting with https://');
      return v;
    }
    case 'days': {
      if (!Array.isArray(value) || !value.length || value.some((d) => !WEEKDAYS.includes(d)))
        throw bad('choose at least one day.');
      return WEEKDAYS.filter((d) => value.includes(d));
    }
    case 'line': {
      const v = String(value ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!v && !field.optional) throw bad("can't be empty.");
      if (v.length > (field.max || 120)) throw bad(`at most ${field.max || 120} characters.`);
      if (/[<>]/.test(v)) throw bad('< and > are not allowed.');
      return v;
    }
    case 'image':
      return cleanImage(value, bad, field);
    case 'images': {
      if (!Array.isArray(value)) throw bad('invalid photos.');
      if (value.length < (field.min || 0)) throw bad(`add at least ${field.min} photo${field.min === 1 ? '' : 's'}.`);
      if (value.length > (field.max || 30)) throw bad(`at most ${field.max || 30} photos.`);
      return value.map((v) => cleanImage(v, bad));
    }
    case 'i18n': {
      const v = value && typeof value === 'object' ? value : {};
      const max = field.max || (field.multiline ? 5000 : 500);
      const out = {};
      for (const lang of ['en', 'ar']) {
        const t = typeof v[lang] === 'string' ? v[lang].replace(/\r\n/g, '\n').trim() : '';
        if (t.length > max) throw bad(`at most ${max} characters.`);
        if (/<\s*\/?\s*script/i.test(t)) throw bad('HTML scripts are not allowed.');
        out[lang] = t;
      }
      if (!out.en && !field.optional) throw bad("the English text can't be empty.");
      return out;
    }
    case 'select': {
      const opt = (field.options || []).find((o) => String(o.value) === String(value));
      if (!opt) throw bad('choose one of the options.');
      return opt.value;
    }
    case 'country': {
      const v = String(value || '').toUpperCase();
      if (!/^[A-Z]{2}$/.test(v)) throw bad('choose a country.');
      return v;
    }
    case 'projects': {
      const list = Array.isArray(value) ? value.map(String) : [];
      if (list.some((n) => !/^\d{1,6}$/.test(n))) throw bad('invalid project.');
      if (!list.length && !field.optional) throw bad('choose at least one project.');
      return [...new Set(list)];
    }
    case 'products': {
      // product ids (Firestore "materials" doc ids), in the chosen order
      const list = Array.isArray(value) ? value.map(String) : [];
      // (kind 'gallery': Gallery photos, also "materials" doc ids)
      const unit = field.kind === 'gallery' ? 'photos' : 'stones';
      if (list.some((id) => !/^[A-Za-z0-9_-]{1,64}$/.test(id))) throw bad(`invalid ${unit.slice(0, -1)}.`);
      const ids = [...new Set(list)];
      if (ids.length < (field.min || 0)) throw bad(`choose at least ${field.min} ${unit}.`);
      if (ids.length > (field.max || 50)) throw bad(`at most ${field.max || 50} ${unit}.`);
      return ids;
    }
    case 'list': {
      if (!Array.isArray(value)) throw bad('invalid list.');
      if (value.length < (field.min || 0)) throw bad(`add at least ${field.min} ${field.itemLabel || 'item'}.`);
      if (value.length > (field.max || 100)) throw bad(`at most ${field.max || 100} items.`);
      const ids = new Set();
      return value.map((item, i) => {
        if (!item || typeof item !== 'object') throw bad('invalid item.');
        const id = String(item.id || '');
        if (!/^[a-z0-9-]{1,60}$/.test(id) || ids.has(id)) throw bad(`item ${i + 1} has an invalid id.`);
        ids.add(id);
        const out = { id };
        for (const sub of field.fields) {
          const label = `${field.label} ${i + 1} (${item[field.titleField] || field.itemLabel || 'item'}) › ${sub.label}`;
          out[sub.name] = cleanData(item[sub.name], { ...sub, label });
        }
        return out;
      });
    }
    default:
      throw bad('unknown field.');
  }
};

const cleanBlock = (block, body) => {
  const fields = fieldsOf(block);
  const texts = {};
  const data = {};
  for (const [key, value] of Object.entries(body.texts || {})) {
    const field = fields.find((f) => f.type === 'text' && f.key === key);
    if (!field) throw httpError(400, `Unknown text: ${key}`);
    texts[key] = cleanText(value, field);
  }
  for (const [name, value] of Object.entries(body.data || {})) {
    const field = fields.find((f) => f.type !== 'text' && f.name === name);
    if (!field) throw httpError(400, `Unknown field: ${name}`);
    data[name] = cleanData(value, field);
  }
  return { texts, data };
};

// ---------- reading and saving ----------
// When each field was last really changed (for the website's sitemap dates):
// { texts: { key: { en: ms, ar: ms } }, data: { name: ms } }. Blocks saved before this was
// kept have none: their saved fields count as changed at the block's last save.
const changedAtOf = (v) => {
  if (v.changedAt) return { texts: v.changedAt.texts || {}, data: v.changedAt.data || {} };
  const at = v.updatedAt;
  if (!at) return { texts: {}, data: {} };
  const texts = {};
  for (const [key, val] of Object.entries(v.texts || {})) {
    texts[key] = {};
    for (const lang of ['en', 'ar']) if (val?.[lang]) texts[key][lang] = at;
  }
  return { texts, data: Object.fromEntries(Object.keys(v.data || {}).map((name) => [name, at])) };
};

// The fields that differ between two saves (a removed field = back to the original = a change).
const markChanges = (before, next, now) => {
  const out = { texts: { ...before.changedAt.texts }, data: { ...before.changedAt.data } };
  for (const key of new Set([...Object.keys(before.texts), ...Object.keys(next.texts)])) {
    for (const lang of ['en', 'ar']) {
      const a = before.texts[key]?.[lang] || '';
      const b = next.texts[key]?.[lang] || '';
      if (a !== b) out.texts[key] = { ...out.texts[key], [lang]: now };
    }
  }
  for (const name of new Set([...Object.keys(before.data), ...Object.keys(next.data)])) {
    if (JSON.stringify(before.data[name] ?? null) !== JSON.stringify(next.data[name] ?? null)) out.data[name] = now;
  }
  return out;
};

const readDoc = async (id) => {
  const doc = await contentCol().doc(id).get();
  const v = doc.exists ? doc.data() : {};
  return {
    texts: v.texts || {},
    data: v.data || {},
    updatedAt: v.updatedAt || null,
    updatedBy: v.updatedBy || null,
    changedAt: changedAtOf(v),
  };
};

const SiteContentService = {};

// Public (website build): { blockId: { texts, data, changedAt } } for every block that has changes.
SiteContentService.listPublic = async () => {
  const snap = await contentCol().get();
  const out = {};
  snap.docs.forEach((d) => {
    if (!getBlock(d.id)) return;
    const v = d.data();
    out[d.id] = { texts: v.texts || {}, data: v.data || {}, changedAt: changedAtOf(v) };
  });
  return out;
};

// Admin: every block with its title and when it was last changed.
SiteContentService.listBlocks = async () => {
  const snap = await contentCol().get();
  const byId = Object.fromEntries(snap.docs.map((d) => [d.id, d.data()]));
  return BLOCKS.map((b) => {
    const v = byId[b.id] || {};
    const changed = Object.keys(v.texts || {}).length + Object.keys(v.data || {}).length;
    return {
      id: b.id,
      title: b.title,
      description: b.description,
      usedOn: b.usedOn,
      changedFields: changed,
      totalFields: fieldsOf(b).length,
      updatedAt: v.updatedAt || null,
      updatedBy: v.updatedBy || null,
    };
  });
};

// Admin: one block = its field list, the saved changes and the website's originals.
SiteContentService.getBlock = async (id) => {
  const block = getBlock(id);
  if (!block) throw httpError(404, 'Unknown page.');
  const [saved, defaults] = await Promise.all([readDoc(id), defaultsFor(block)]);
  return { block, saved, defaults };
};

SiteContentService.saveBlock = async (id, body, by) => {
  const block = getBlock(id);
  if (!block) throw httpError(404, 'Unknown page.');
  const next = cleanBlock(block, body);
  const ref = contentCol().doc(id);
  const before = await readDoc(id);
  // keep the previous version
  if (before.updatedAt) {
    await ref
      .collection('versions')
      .add({ texts: before.texts, data: before.data, savedAt: before.updatedAt, savedBy: before.updatedBy });
    const old = await ref.collection('versions').orderBy('savedAt', 'desc').offset(KEEP_VERSIONS).get();
    await Promise.all(old.docs.map((d) => d.ref.delete()));
  }
  const now = Date.now();
  const changedAt = markChanges(before, next, now);
  await ref.set({ texts: next.texts, data: next.data, updatedAt: now, updatedBy: by || null, changedAt });
  await SiteMeta.markChanged(by);
  return { texts: next.texts, data: next.data, updatedAt: now, updatedBy: by || null };
};

// The earlier versions, newest first, then "the website's original" (no changes at all) once
// something was saved, so even the first change can be undone.
SiteContentService.listVersions = async (id) => {
  if (!getBlock(id)) throw httpError(404, 'Unknown page.');
  const [snap, current] = await Promise.all([
    contentCol().doc(id).collection('versions').orderBy('savedAt', 'desc').limit(KEEP_VERSIONS).get(),
    readDoc(id),
  ]);
  const original = current.updatedAt ? [{ id: 'original', original: true, savedAt: null, savedBy: null, changedFields: 0 }] : [];
  return snap.docs.map((d) => {
    const v = d.data();
    return {
      id: d.id,
      savedAt: v.savedAt,
      savedBy: v.savedBy,
      changedFields: Object.keys(v.texts || {}).length + Object.keys(v.data || {}).length,
    };
  }).concat(original);
};

// Puts an older version back (the current one is kept as a version too, so this can be undone).
SiteContentService.restoreVersion = async (id, versionId, by) => {
  if (!getBlock(id)) throw httpError(404, 'Unknown page.');
  if (versionId === 'original') return SiteContentService.saveBlock(id, { texts: {}, data: {} }, by);
  const v = await contentCol().doc(id).collection('versions').doc(versionId).get();
  if (!v.exists) throw httpError(404, 'This version no longer exists.');
  const { texts, data } = v.data();
  return SiteContentService.saveBlock(id, { texts: texts || {}, data: data || {} }, by);
};

SiteContentService.uploadPhotos = async (files) => Promise.all((files || []).map((f) => StorageService.uploadPhoto(f, 'Site')));

// A PDF for a link field (company profile, catalogue; 2026-11-25): stored publicly at
// uploads/Site/files/ and returned as an address on our own domain (the website's nginx
// passes /uploads/Site/files/ on to Storage). The address keeps the Storage path, so the
// "Find unused photos" scan still sees the file as used. Staging gets the Storage address.
SiteContentService.uploadFile = async (file) => {
  const url = await StorageService.uploadPhoto(file, 'Site/files');
  const path = url.split('/uploads/Site/files/')[1];
  if (IS_STAGING || !path) return { url };
  return { url: `https://www.wadidegla-eg.com/uploads/Site/files/${path}` };
};

module.exports = SiteContentService;
