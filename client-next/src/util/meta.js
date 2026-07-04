/**
 * Server-side utility: get a translated string from JSON files directly.
 * No i18next instance needed — just JSON lookups.
 * Used in generateMetadata() for static HTML meta tags.
 */

import { SUPPORTED_LANGS, BASE_URL } from './supported-langs';
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

const translations = { en, ar, fr, es, de, it, ro, ko, sq, ru, ja, zh };

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
export function buildAlternates(path = '', lang = 'en') {
  const languages = {};
  for (const l of SUPPORTED_LANGS) {
    languages[l] = `${BASE_URL}/${l}${path}/`;
  }
  languages['x-default'] = `${BASE_URL}/en${path}/`;
  return {
    canonical: `${BASE_URL}/${lang}${path}/`,
    languages,
  };
}
