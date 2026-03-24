import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translations/en.json';
import translationAR from './translations/ar.json';
import translationFR from './translations/fr.json';
import translationES from './translations/es.json';
import translationDE from './translations/de.json';
import translationIT from './translations/it.json';
import translationRO from './translations/ro.json';
import translationKO from './translations/ko.json';
import translationSQ from './translations/sq.json';
import translationRU from './translations/ru.json';
import translationJA from './translations/ja.json';
import translationZH from './translations/zh.json';

export const SUPPORTED_LANGS = ['en', 'ar', 'fr', 'es', 'de', 'it', 'ro', 'ko', 'sq', 'ru', 'ja', 'zh'];
export const DEFAULT_LANG = 'en';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR },
  fr: { translation: translationFR },
  es: { translation: translationES },
  de: { translation: translationDE },
  it: { translation: translationIT },
  ro: { translation: translationRO },
  ko: { translation: translationKO },
  sq: { translation: translationSQ },
  ru: { translation: translationRU },
  ja: { translation: translationJA },
  zh: { translation: translationZH },
};

// Only initialize once
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
