import apiClient from './client';
import { uploadSitePhotos } from './news';

// "Website" menu: the website content the client edits (texts, numbers, contact details...).
// The pages and fields come from the server (server/src/content/blocks.js); the same rules
// are checked again by the server when saving.

export const WEEKDAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_NAMES = { Sat: 'Saturday', Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };

const URL_RE = /^https:\/\/[^\s<>"]+$/i;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[0-9][0-9 ()-]{5,22}$/;

// A field's "id" in the form: texts by translation key, the rest by name.
export const fieldId = f => (f.type === 'text' ? `t:${f.key}` : `d:${f.name}`);

// The problem with a value, or '' when it's fine (shown under the field before saving).
export const checkField = (f, value) => {
  if (f.type === 'text') {
    if (!value?.en?.trim()) return "The English text can't be empty.";
    const max = f.max || (f.multiline ? 5000 : 500);
    if (value.en.length > max || (value.ar || '').length > max) return `At most ${max} characters.`;
    for (const ph of f.placeholders || []) {
      if (!value.en.includes(`{{${ph}}}`)) return `Keep {{${ph}}} in the English text: the website puts the real value there.`;
      if (value.ar?.trim() && !value.ar.includes(`{{${ph}}}`)) return `Keep {{${ph}}} in the Arabic text too.`;
    }
    return '';
  }
  if (value === null || value === undefined || value === '') return 'This field is required.';
  switch (f.type) {
    case 'number': {
      const n = Number(value);
      if (!Number.isInteger(n)) return 'Enter a whole number.';
      if (n < f.min || n > f.max) return `Between ${f.min} and ${f.max}.`;
      return '';
    }
    case 'hour':
      return Number.isInteger(Number(value)) && value >= 0 && value <= 24 ? '' : 'Choose an hour.';
    case 'phone':
      return PHONE_RE.test(String(value).trim()) ? '' : 'Write it like +20 10 6726 0314.';
    case 'email':
      return EMAIL_RE.test(String(value).trim()) ? '' : 'Enter a valid email address.';
    case 'url':
      return URL_RE.test(String(value).trim()) ? '' : 'A full link starting with https://';
    case 'days':
      return Array.isArray(value) && value.length ? '' : 'Choose at least one day.';
    default:
      return '';
  }
};

// Same, for the field types used in lists and photos (empty values allowed where optional).
const checkMore = (f, value) => {
  switch (f.type) {
    case 'line': {
      const v = String(value ?? '').trim();
      if (!v && !f.optional) return "Can't be empty.";
      if (v.length > (f.max || 120)) return `At most ${f.max || 120} characters.`;
      return /[<>]/.test(v) ? '< and > are not allowed.' : '';
    }
    case 'image': {
      if (!value?.src) return 'Upload a photo.';
      const r = value.width / value.height;
      if (f.ratio && !value.src.startsWith('/Assets/') && !(r >= f.ratio[0] && r <= f.ratio[1]))
        return `This photo is ${value.width} × ${value.height}: ${f.ratioHelp || 'wrong shape.'}`;
      return '';
    }
    case 'images':
      return (value || []).length >= (f.min || 0) ? '' : `Add at least ${f.min} photo${f.min === 1 ? '' : 's'}.`;
    case 'i18n':
      return value?.en?.trim() || f.optional ? '' : "The English text can't be empty.";
    case 'select':
      return (f.options || []).some(o => String(o.value) === String(value)) ? '' : 'Choose one.';
    case 'country':
      return /^[A-Z]{2}$/.test(String(value || '')) ? '' : 'Choose a country.';
    case 'projects':
      return (value || []).length || f.optional ? '' : 'Choose at least one project.';
    case 'products': {
      const n = (value || []).length;
      const unit = f.kind === 'gallery' ? 'photos' : 'stones';
      if (n < (f.min || 0)) return `Choose at least ${f.min} ${unit}.`;
      return n > (f.max || 50) ? `At most ${f.max || 50} ${unit}.` : '';
    }
    case 'list': {
      const items = value || [];
      if (items.length < (f.min || 0)) return `Add at least ${f.min} ${f.itemLabel || 'item'}.`;
      for (let i = 0; i < items.length; i += 1) {
        for (const sub of f.fields) {
          const err = checkAny(sub, items[i][sub.name]);
          if (err) return `${f.itemLabel || 'Item'} ${i + 1} (${items[i][f.titleField] || 'new'}) › ${sub.label}: ${err}`;
        }
      }
      return '';
    }
    default:
      return null;
  }
};

// Any field type: '' when fine, else the problem.
export const checkAny = (f, value) => {
  const more = checkMore(f, value);
  return more === null ? checkField(f, value) : more;
};

// A new list item's id, from its name ("Marble İzmir" -> "marble-izmir"), unique in the list.
export const newItemId = (name, taken) => {
  const base =
    String(name || 'item')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'item';
  let id = base;
  for (let n = 2; taken.includes(id); n += 1) id = `${base}-${n}`;
  return id;
};

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

// Whether a field's current value differs from the website's original.
export const isChanged = (f, value, original) =>
  f.type === 'text'
    ? (value?.en || '') !== (original?.en || '') || (value?.ar || '') !== (original?.ar || '')
    : !same(f.type === 'number' || f.type === 'hour' ? Number(value) : value, original);

// What to save: only the fields that differ from the original.
export const buildSaveBody = (fields, values, defaults) => {
  const body = { texts: {}, data: {} };
  for (const f of fields) {
    const v = values[fieldId(f)];
    if (f.type === 'text') {
      const orig = defaults.texts[f.key] || {};
      if (isChanged(f, v, orig)) body.texts[f.key] = { en: v.en.trim(), ar: (v.ar || '').trim() };
    } else {
      const orig = defaults.data[f.name];
      const val = f.type === 'number' || f.type === 'hour' ? Number(v) : v;
      if (isChanged(f, val, orig)) body.data[f.name] = val;
    }
  }
  return body;
};

// The value shown in each field: the saved change, or else the website's original.
export const initialValues = (fields, saved, defaults) => {
  const values = {};
  for (const f of fields) {
    if (f.type === 'text') {
      const s = saved.texts[f.key];
      const d = defaults.texts[f.key] || { en: '', ar: '' };
      values[fieldId(f)] = s ? { en: s.en || '', ar: s.ar || '' } : { en: d.en || '', ar: d.ar || '' };
    } else {
      values[fieldId(f)] = saved.data[f.name] !== undefined ? saved.data[f.name] : (defaults.data[f.name] ?? '');
    }
  }
  return values;
};

export const originalOf = (f, defaults) => (f.type === 'text' ? defaults.texts[f.key] || { en: '', ar: '' } : (defaults.data[f.name] ?? ''));

// {{facts.years}} etc. inside a text: filled in by the website with the company numbers.
export const FACT_LABELS = {
  years: 'years in business',
  foundedYear: 'founding year',
  quarries: 'quarries',
  factories: 'factories',
  exportCountries: 'export countries',
  workers: 'skilled workers',
  projects: 'projects',
  dailyCapacity: 'production per day',
  factoryArea: 'factory area',
};
export const factsIn = text => [...new Set([...String(text || '').matchAll(/\{\{facts\.([a-zA-Z]+)\}\}/g)].map(m => m[1]))];

export const loadBlocks = async () => (await apiClient.get('/api/content/admin/blocks')).data.data;
export const loadBlock = async id => (await apiClient.get(`/api/content/admin/blocks/${id}`)).data.data;
export const saveBlock = async (id, body) => (await apiClient.put(`/api/content/admin/blocks/${id}`, body)).data.data;
export const loadVersions = async id => (await apiClient.get(`/api/content/admin/blocks/${id}/versions`)).data.data;
export const restoreVersion = async (id, versionId) =>
  (await apiClient.post(`/api/content/admin/blocks/${id}/versions/${versionId}/restore`)).data.data;
export const uploadWebsitePhotos = (files, onProgress) => uploadSitePhotos('/api/content/admin/photos', files, onProgress);

// New list items are added as "new-<thing>-…"; when saving they get an id from their name
// ("Marble İzmir" -> "marble-izmir"), used by the website (page anchors, translations).
export const nameNewItems = (fields, values) => {
  const out = { ...values };
  for (const f of fields) {
    if (f.type !== 'list') continue;
    const items = out[fieldId(f)] || [];
    const named = [];
    for (const it of items) {
      if (it.id.startsWith('new-')) named.push({ ...it, id: newItemId(it[f.titleField], [...items.map(x => x.id), ...named.map(x => x.id)]) });
      else named.push(it);
    }
    out[fieldId(f)] = named;
  }
  return out;
};

// 2-letter country codes for the country picker (names come from the browser).
export const COUNTRY_CODES =
  'AD AE AF AG AI AL AM AO AR AT AU AW AZ BA BB BD BE BF BG BH BI BJ BM BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KM KN KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NZ OM PA PE PG PH PK PL PR PS PT PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW'.split(
    ' ',
  );

export const timeAgo = ms => {
  if (!ms) return '';
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};
