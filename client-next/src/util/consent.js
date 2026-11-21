'use client';
// Cookie consent (2026-11-21). Google Analytics only stores its cookies when the visitor
// agrees, where the law asks for that (Europe/UK, GDPR); elsewhere it counts as before.
// - RootHtml.js sets Google's Consent Mode defaults before the tag loads: statistics denied
//   for EEA/UK/CH visitors (Google decides the country), allowed elsewhere; ads always denied
//   (the site runs no ads). A choice saved here is applied there too, on every page.
// - The banner (CookieBanner.js) shows to visitors whose clock is set to a European time
//   zone and who haven't chosen yet; the footer's "Cookie settings" opens it for anyone.
// The quote list and login are needed for the site to work and are not covered by this.
export const CONSENT_KEY = 'wd-consent';
export const OPEN_SETTINGS_EVENT = 'wd:cookie-settings';

export function readConsent() {
  try {
    const v = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
    return v && (v.analytics === 'granted' || v.analytics === 'denied') ? v.analytics : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, at: Date.now() }));
  } catch {
    // private mode: the choice lasts for this page only
  }
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: analytics });
  }
}

// Europe by the visitor's clock (no outside lookup needed). Google uses the visitor's real
// country for its own defaults, so a mismatch only means the banner is or isn't offered.
export function inEurope() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    return (
      tz.startsWith('Europe/') || /^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)/.test(tz)
    );
  } catch {
    return false;
  }
}
