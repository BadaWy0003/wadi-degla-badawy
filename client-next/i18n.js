import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGS = ['en', 'ar', 'fr', 'es', 'de', 'it', 'ro', 'ko', 'sq', 'ru', 'ja', 'zh'];
export const DEFAULT_LANG = 'en';

// Texts are NOT bundled here (that shipped all 12 languages to every page).
// The [lang] root layout passes the current language's texts to AppShell,
// which registers them with setLanguageMessages() below.

// Only initialize once
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {},
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    interpolation: { escapeValue: false },
  });
}

export function setLanguageMessages(lang, messages) {
  if (messages && !i18n.hasResourceBundle(lang, 'translation')) {
    i18n.addResourceBundle(lang, 'translation', messages, true, true);
  }
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
}

export default i18n;
