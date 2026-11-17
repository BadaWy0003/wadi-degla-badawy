// The international fairs Wadi Degla's team visited (owner, 2026-11-16), newest first.
// name/city are proper names (not translated); the country is shown in the page's language
// (Intl.DisplayNames), the date as "2026" or "April 2024" (Intl.DateTimeFormat).
// Texts: fairs.items.<id> in all 12 translation files (facts from the organisers' sites,
// checked 2026-11-16).
// photos: [file in /Assets/Media/Fairs/, width, height]: 1 photo, 2 (the second overlaps the
// first's corner) or 3+ (a big first photo with a row of small ones under it). To add a fair: add it here (and its
// text in the 12 files); the numbers at the top are counted from this list.
const PHOTO = (name) => `/Assets/Media/Fairs/${name}.webp`;

export const FAIRS = [
  {
    id: 'marmomac',
    name: 'Marmomac',
    city: 'Verona',
    country: 'IT',
    continent: 'europe',
    year: 2026,
    month: 9, // 60th edition, Veronafiere, 22-25 September 2026
    // the three meeting photos were taken at Marmomac (owner, 2026-11-17); not our own stand
    photos: [
      [PHOTO('marmomac'), 900, 1200],
      [PHOTO('fair-meeting'), 1200, 900],
      [PHOTO('marmomac-2'), 1200, 900],
      [PHOTO('marmomac-3'), 1200, 900],
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

// The questions & answers on the page (fairs.faq<Key>Q / A), also used by the page's FAQPage
// JSON-LD in app/[lang]/fairs/page.js (this file is not a client component, so both can import it).
export const FAQ_KEYS = ['Attend', 'Meet', 'Samples', 'Export'];
