// Company facts and contact details: the website's own values, with what the client changed
// in the admin panel ("Website" → "Company facts & contact", data block "company") on top.
// Used by the number counters, Contact/contactData.js (footer, Contact page, Google's
// business data) and the {{facts.*}} placeholders in the texts (src/util/site-text.js).
// Small on purpose: client components import it too.
import SITE_DATA from '@site-content/data.json';

export const COMPANY_DEFAULTS = {
  foundedYear: 1980,
  quarries: 14,
  factories: 3,
  exportCountries: 31,
  workers: 500,
  projects: 300,
  dailyCapacity: 3000,
  factoryArea: 27000,
  mainPhone: '+20 10 6726 0314',
  phone2: '+20 11 5555 9896',
  supportPhone: '+20 101 666 7890',
  emailInfo: 'info@wadidegla-eg.com',
  emailSales: 'sales@wadidegla-eg.com',
  emailProjects: 'projects@wadidegla-eg.com',
  emailExport: 'export@wadidegla-eg.com',
  mapsUrl: 'https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7',
  openDays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
  openHour: 9,
  closeHour: 17,
  whatsappUrl: 'https://wa.me/message/LAQ57AMNJ5ZON1?src=qr',
  // the number behind it (owner, 2026-11-28): WhatsApp buttons open a chat with a ready message
  // (src/util/whatsapp.js); the business link above can't carry a text
  whatsappNumber: '+20 10 6726 0314',
  // the Google Business Profile's own "Share" link (2026-11-09)
  googleProfileUrl: 'https://share.google/Rd6wSY83M15CWZ6OR',
  facebook: 'https://www.facebook.com/wadideglaco',
  instagram: 'https://instagram.com/wadideglaco',
  linkedin: 'https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/',
  telegram: 'https://t.me/wadideglaco',
  tiktok: 'https://www.tiktok.com/@wadideglaco',
  profileUrl: 'https://drive.google.com/file/d/1cr1xARl2DO_dmVo2NUaZrP6mJ0FyNHUa/view',
  catalogueUrl:
    'https://drive.google.com/file/d/17sczDrWJN8pWQ4EPHMdIeh30TLbXYh-l/view?usp=sharing',
};

export const COMPANY = { ...COMPANY_DEFAULTS, ...(SITE_DATA.company || {}) };

// Years in business, counted from the founding year in the build year (set in
// next.config.js, so the HTML and the browser agree). Becomes 47 with the first build of 2027.
const BUILD_YEAR = Number(process.env.BUILD_YEAR) || 2026;
export const YEARS = BUILD_YEAR - COMPANY.foundedYear;

// "+20 10 6726 0314" -> "+201067260314" for tel: links
export const telOf = (label) => String(label).replace(/[^\d+]/g, '');

// The numbers usable inside texts as {{facts.<name>}} (filled in by src/util/site-text.js in
// each language's own number format).
export const FACT_NUMBERS = {
  years: YEARS,
  foundedYear: COMPANY.foundedYear,
  quarries: COMPANY.quarries,
  factories: COMPANY.factories,
  exportCountries: COMPANY.exportCountries,
  workers: COMPANY.workers,
  projects: COMPANY.projects,
  dailyCapacity: COMPANY.dailyCapacity,
  factoryArea: COMPANY.factoryArea,
};

// The same numbers as shown in the stat boxes ("27,000", the same in every language).
const fmt = (n) => Number(n).toLocaleString('en-US');
export const FACTS = Object.fromEntries(
  Object.entries(FACT_NUMBERS).map(([k, v]) => [k, k === 'foundedYear' ? String(v) : fmt(v)]),
);

// "31+" as shown in the stat boxes
export const EXPORT_COUNTRIES_LABEL = `${COMPANY.exportCountries}+`;
