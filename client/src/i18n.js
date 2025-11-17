import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translations/en.json';
import translationES from './translations/es.json';
import translationRO from './translations/ro.json';
import translationFR from './translations/fr.json';
import translationDE from './translations/de.json';
import translationIT from './translations/it.json';
import translationKO from './translations/ko.json';
import translationSQ from './translations/sq.json';
import translationRU from './translations/ru.json';
import translationJA from './translations/ja.json';
import translationAR from './translations/ar.json';

const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  },
  ro: {
    translation: translationRO
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  it: {
    translation: translationIT
  },
  ko: {
    translation: translationKO
  },
  sq: {
    translation: translationSQ
  },
  ru: {
    translation: translationRU
  },
  ja: {
    translation: translationJA
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;