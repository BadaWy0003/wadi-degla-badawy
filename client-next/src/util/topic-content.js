// Texts of the topic pages (src/util/topic-pages.js), one JSON file per language in
// client-next/content/topics/. Read only at build time, by the topic pages' server
// components: they are NOT part of translations/*.json, which are sent to the browser on
// every page (thousands of words of topic text would make every page heavier).
// A text missing in a language falls back to English.

import { t } from './meta';
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

const CONTENT = { en, ar, fr, es, de, it, ro, ko, sq, ru, ja, zh };

const get = (obj, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), obj);

// topicText('ar', 'egyptianMarble.intro') -> Arabic value, or English if missing.
export function topicText(lang, path) {
  const lang2 = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  const value = get(CONTENT[lang2], path);
  return value === undefined || value === '' ? get(CONTENT.en, path) : value;
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
