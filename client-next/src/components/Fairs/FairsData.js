// The international fairs Wadi Degla's team visited (owner, 2026-11-16), newest first.
// name/city are proper names (not translated); the country is shown in the page's language
// (Intl.DisplayNames), the date as "2026" or "April 2024" (Intl.DateTimeFormat).
// Texts: fairs.items.<id> in all 12 translation files (facts from the organisers' sites,
// checked 2026-11-16).
// photos: [file in /Assets/Media/Fairs/, width, height]: 1 photo, 2 (the second overlaps the
// first's corner) or 3+ (a big first photo with the small ones under it: one row up to 4, then rows of 3). To add a fair: add it here (and its
// text in the 12 files); the numbers at the top are counted from this list.
import { siteData } from '../../util/site-content';

const PHOTO = (name) => `/Assets/Media/Fairs/${name}.webp`;

export const FAIRS_DEFAULT = [
  {
    id: 'marmomac',
    name: 'Marmomac',
    city: 'Verona',
    country: 'IT',
    continent: 'europe',
    year: 2026,
    month: 9, // 60th edition, Veronafiere, 22-25 September 2026
    // the team photo and the four meeting photos were taken at Marmomac (owner, 2026-11-17); not our own stand
    photos: [
      [PHOTO('marmomac'), 900, 1200],
      [PHOTO('marmomac-4'), 1200, 900],
      [PHOTO('fair-meeting'), 1200, 900],
      [PHOTO('marmomac-2'), 1200, 900],
      [PHOTO('marmomac-3'), 1200, 900],
      [PHOTO('marmomac-5'), 1200, 900],
    ],
  },
  {
    id: 'coverings',
    name: 'Coverings',
    city: 'Las Vegas',
    country: 'US',
    continent: 'northAmerica',
    year: 2026,
    month: 3, // Las Vegas Convention Center, 30 March - 2 April 2026
    photos: [[PHOTO('coverings'), 899, 1200]],
  },
  {
    id: 'futurescape',
    name: 'FutureScape',
    city: 'Farnborough',
    country: 'GB',
    continent: 'europe',
    year: 2026,
    month: 10, // Farnborough International, 13-14 October 2026
    photos: [
      [PHOTO('futurescape'), 900, 1200],
      [PHOTO('futurescape-2'), 1200, 900],
    ],
  },
  {
    id: 'izmir',
    name: 'Marble İzmir',
    city: 'İzmir',
    country: 'TR',
    continent: 'asia',
    year: 2024,
    month: 4, // fuarizmir, 17-20 April 2024 (29th edition)
    photos: [
      [PHOTO('marble-izmir'), 900, 1200],
      [PHOTO('marble-izmir-2'), 1200, 900],
    ],
  },
];

// The admin panel's list ("Website" → "Fairs & exhibitions") replaces the default list once
// the client changed it: same fields; photos are { src, width, height } there; text { en, ar }
// (resolved per language at build time by app/[lang]/fairs/page.js).
const CMS_FAIRS = siteData('fairs').fairs;
export const FAIRS = CMS_FAIRS
  ? CMS_FAIRS.map((f) => ({
      id: f.id,
      name: f.name,
      city: f.city || null,
      country: f.country,
      continent: f.continent,
      year: f.year,
      month: f.month || null,
      text: f.text,
      photos: (f.photos || []).map((ph) => [ph.src, ph.width, ph.height]),
    }))
  : FAIRS_DEFAULT;

// The default list in the admin panel's shape (for /<lang>/content-defaults.json).
export const fairsForAdmin = (textOf) =>
  FAIRS_DEFAULT.map((f) => ({
    id: f.id,
    name: f.name,
    city: f.city || '',
    country: f.country,
    continent: f.continent,
    year: f.year,
    month: f.month || 0,
    text: textOf(f.id),
    photos: f.photos.map(([src, width, height]) => ({ src, width, height })),
  }));

// The questions & answers on the page (fairs.faq<Key>Q / A), also used by the page's FAQPage
// JSON-LD in app/[lang]/fairs/page.js (this file is not a client component, so both can import it).
export const FAQ_KEYS = ['Attend', 'Meet', 'Samples', 'Export'];
