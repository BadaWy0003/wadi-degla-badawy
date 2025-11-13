import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translations/en.json';
import translationES from './translations/es.json';
import translationRO from './translations/ro.json';
import translationFR from './translations/fr.json';

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