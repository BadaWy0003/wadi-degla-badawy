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

export const timeAgo = ms => {
  if (!ms) return '';
  const min = Math.round((Date.now() - ms) / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h} h ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};
