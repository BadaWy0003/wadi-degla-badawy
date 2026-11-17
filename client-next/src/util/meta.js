/**
 * Server-side utility: get a translated string from JSON files directly.
 * No i18next instance needed — just JSON lookups.
 * Used in generateMetadata() for static HTML meta tags.
 */

import { SUPPORTED_LANGS, BASE_URL } from './supported-langs';
import { applySiteTexts } from './site-text';
export { SUPPORTED_LANGS };

// Import all translation JSON files directly
import en from '../../translations/en.json';
import ar from '../../translations/ar.json';
import fr from '../../translations/fr.json';
import es from '../../translations/es.json';
import de from '../../translations/de.json';
import it from '../../translations/it.json';
import ro from '../../translations/ro.json';
import ko from '../../translations/ko.json';
import sq from '../../translations/sq.json';
import ru from '../../translations/ru.json';
import ja from '../../translations/ja.json';
import zh from '../../translations/zh.json';

const RAW = { en, ar, fr, es, de, it, ro, ko, sq, ru, ja, zh };

// Each language's texts with the client's admin-panel changes and the company numbers
// filled in (src/util/site-text.js), worked out once per language.
const prepared = {};
const translations = new Proxy(RAW, {
  get(target, lang) {
    if (typeof lang !== 'string' || !target[lang]) return undefined;
    if (!prepared[lang]) prepared[lang] = applySiteTexts(target[lang], lang, RAW.en);
    return prepared[lang];
  },
});

/**
 * Get a nested translation value. Key format: "section.key" e.g. "home.pageTitle"
 * @param {string} lang  - language code
 * @param {string} key   - dot-separated key path
 * @param {string} fallback - fallback value
 */
export function t(lang, key, fallback = '') {
  const dict = translations[lang] || translations['en'];
  const parts = key.split('.');
  let val = dict;
  for (const part of parts) {
    val = val?.[part];
    if (val === undefined) break;
  }
  if (typeof val === 'string') return val;
  // Try English fallback
  val = translations['en'];
  for (const part of parts) {
    val = val?.[part];
    if (val === undefined) break;
  }
  return typeof val === 'string' ? val : fallback;
}

/**
 * Build hreflang alternates and canonical URL for a given path (e.g. "/products")
 */
// `langs`: the languages this page really exists in (default: all 12). News and projects are
// only written in English (and sometimes Arabic), so their other language copies are left
// out of hreflang (and carry noindex, see indexedLangs in news-data / projects-data).
export function buildAlternates(path = '', lang = 'en', langs = SUPPORTED_LANGS) {
  const languages = {};
  for (const l of langs) {
    languages[l] = `${BASE_URL}/${l}${path}/`;
  }
  languages['x-default'] = `${BASE_URL}/en${path}/`;
  return {
    canonical: `${BASE_URL}/${lang}${path}/`,
    languages,
  };
}

// Open Graph / Twitter card language (og:locale) for each site language.
const OG_LOCALES = {
  en: 'en_US',
  ar: 'ar_EG',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
  ro: 'ro_RO',
  ko: 'ko_KR',
  sq: 'sq_AL',
  ru: 'ru_RU',
  ja: 'ja_JP',
  zh: 'zh_CN',
};
export const DEFAULT_SOCIAL_IMAGE = '/preview.webp';

/**
 * The page's own preview for links shared on WhatsApp, Facebook, LinkedIn, X… (Open Graph +
 * Twitter card). Spread it into generateMetadata: `...buildSocial({ title, description, path,
 * lang, image })`. og:url is the page's canonical (same as buildAlternates). Next.js replaces
 * the root layout's openGraph/twitter as a whole, so every field is set here.
 * image: a site path (/Assets/...) or a full https link; defaults to /preview.webp.
 */
export function buildSocial({ title, description, path = '', lang = 'en', image }) {
  const url = `${BASE_URL}/${lang}${path}/`;
  const img = image || DEFAULT_SOCIAL_IMAGE;
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: 'Wadi Degla',
      locale: OG_LOCALES[lang] || 'en_US',
      images: [{ url: img }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [img],
    },
  };
}

// Deep-merge `override` onto `base` (objects only; strings/arrays from `override` win).
function mergeMessages(base, override) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && base?.[key] && typeof base[key] === 'object'
        ? mergeMessages(base[key], value)
        : value;
  }
  return out;
}

/**
 * All UI texts for one language, with English filling any missing keys.
 * Passed from the [lang] root layout to the client, so each page ships only
 * its own language instead of all 12 translation files.
 */
export function getMessages(lang) {
  return lang === 'en' ? translations.en : mergeMessages(translations.en, translations[lang] || {});
}
