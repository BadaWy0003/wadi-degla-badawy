// Texts of the topic pages (src/util/topic-pages.js), one JSON file per language in
// client-next/content/topics/. Read only at build time, by the topic pages' server
// components: they are NOT part of translations/*.json, which are sent to the browser on
// every page (thousands of words of topic text would make every page heavier).
// A text missing in a language falls back to English.

import { t } from './meta';
import { TOPIC_PREFIX, applySiteTexts, fillFactsDeep } from './site-text';
import { SUPPORTED_LANGS } from './supported-langs';
import en from '../../content/topics/en.json';
import ar from '../../content/topics/ar.json';
import fr from '../../content/topics/fr.json';
import es from '../../content/topics/es.json';
import de from '../../content/topics/de.json';
import it from '../../content/topics/it.json';
import ro from '../../content/topics/ro.json';
import ko from '../../content/topics/ko.json';
import sq from '../../content/topics/sq.json';
import ru from '../../content/topics/ru.json';
import ja from '../../content/topics/ja.json';
import zh from '../../content/topics/zh.json';

const RAW = { en, ar, fr, es, de, it, ro, ko, sq, ru, ja, zh };
// With the client's changes from the admin panel (Website → the topic pages, keys
// "topics.<path>"): same 12-language rule as the other texts (src/util/site-text.js).
const CONTENT = Object.fromEntries(
  Object.entries(RAW).map(([lang, dict]) => [lang, applySiteTexts(dict, lang, en, TOPIC_PREFIX)]),
);

const get = (obj, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), obj);

// topicText('ar', 'egyptianMarble.intro') -> Arabic value, or English if missing.
export function topicText(lang, path) {
  const lang2 = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  const value = get(CONTENT[lang2], path);
  // {{facts.*}} placeholders: the company numbers from the admin panel (src/util/company.js)
  return fillFactsDeep(value === undefined || value === '' ? get(CONTENT.en, path) : value, lang2);
}

export const fillText = (text, values) =>
  Object.entries(values).reduce((s, [k, v]) => s.split(`{{${k}}}`).join(v), String(text || ''));

// Category name in the page's language (same labels as the product pages and visualizer).
export const categoryLabel = (lang, key) =>
  ({
    egyptianMarble: t(lang, 'visualizer.egyptianMarble'),
    egyptianGranite: t(lang, 'visualizer.egyptianGranite'),
    importedMarble: t(lang, 'visualizer.importedMarble'),
    importedGranite: t(lang, 'visualizer.importedGranite'),
  })[key];
