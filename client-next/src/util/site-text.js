// Build time only (server side): the website texts as visitors see them.
// 1. The texts the client changed in the admin panel (@site-content/texts.json, by
//    translation key, { en, ar }) go over the translation files:
//    - English and Arabic pages show the client's text (Arabic falls back to their English);
//    - the other 10 languages keep their own translation while the client's English is the
//      same as the original English, and show the client's English once it differs (the
//      translation was made for the old text; owner's choice 2026-11-17).
// 2. {{facts.years}}, {{facts.exportCountries}}... inside any text are replaced by the
//    company numbers (src/util/company.js), so changing a number in the admin panel updates
//    every sentence that mentions it, in every language.
import SITE_TEXTS from '@site-content/texts.json';
import { FACT_NUMBERS } from './company';

const getPath = (obj, path) =>
  path.split('.').reduce((v, k) => (v == null ? undefined : v[k]), obj);
const setPath = (obj, path, value) => {
  const parts = path.split('.');
  let o = obj;
  for (const p of parts.slice(0, -1)) {
    if (typeof o[p] !== 'object' || o[p] === null) o[p] = {};
    o = o[p];
  }
  o[parts[parts.length - 1]] = value;
};

const FACT_RE = /\{\{facts\.([a-zA-Z]+)\}\}/g;
// "27,000" in English and Arabic, "27.000" in German, "27 000" in French...; years as is.
const formatFact = (name, lang) => {
  const n = FACT_NUMBERS[name];
  if (n === undefined) return undefined;
  if (name === 'foundedYear' || name === 'years') return String(n);
  try {
    return new Intl.NumberFormat(lang === 'ar' || !lang ? 'en-US' : lang).format(n);
  } catch {
    return String(n);
  }
};
export const fillFacts = (s, lang) =>
  typeof s === 'string' ? s.replace(FACT_RE, (m, name) => formatFact(name, lang) ?? m) : s;

// Fills the placeholders in every string of an object / array (returns a copy).
export const fillFactsDeep = (v, lang) => {
  if (typeof v === 'string') return fillFacts(v, lang);
  if (Array.isArray(v)) return v.map((x) => fillFactsDeep(x, lang));
  if (v && typeof v === 'object') {
    const out = {};
    for (const [k, x] of Object.entries(v)) out[k] = fillFactsDeep(x, lang);
    return out;
  }
  return v;
};

// The client's version of one text in one language, or undefined to keep the file's text.
export const overrideFor = (key, lang, originalEn) => {
  const o = SITE_TEXTS[key];
  if (!o || !o.en) return undefined;
  if (lang === 'en') return o.en;
  if (lang === 'ar') return o.ar || o.en;
  return o.en !== originalEn ? o.en : undefined;
};

// The topic pages' texts (content/topics/*.json) are saved under "topics.<path>"; the
// translation files never get them (they are sent to the browser on every page).
export const TOPIC_PREFIX = 'topics.';

// A translation file (or, with prefix = TOPIC_PREFIX, a topic texts file) with the client's
// changes and the numbers filled in.
export function applySiteTexts(dict, lang, enDict, prefix = '') {
  const out = JSON.parse(JSON.stringify(dict));
  for (const key of Object.keys(SITE_TEXTS)) {
    const isTopic = key.startsWith(TOPIC_PREFIX);
    if (prefix ? !key.startsWith(prefix) : isTopic) continue;
    const path = key.slice(prefix.length);
    const v = overrideFor(key, lang, getPath(enDict, path));
    if (v !== undefined) setPath(out, path, v);
  }
  return fillFactsDeep(out, lang);
}

// Whether any text was changed in the admin panel (for logs/tests).
export const changedTextKeys = () => Object.keys(SITE_TEXTS);
