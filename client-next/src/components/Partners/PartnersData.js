// Partners and clients: logo files, names, and the projects (numbers from the admin panel,
// i.e. /projects/<n>) done for them, which the Partners page shows as "partner stories".
// The home page uses partnerLogos / PARTNER_NAMES (original logos, same order).
const DIR = '/Assets/Icons/partners';

export const PARTNERS = [
  { id: 'wyndham', name: 'Wyndham', logo: `${DIR}/wyndham.webp`, projects: ['1', '2', '15'] },
  { id: 'emaar', name: 'Emaar', logo: `${DIR}/emaar.svg`, projects: ['11'] },
  {
    id: 'mountain-view',
    name: 'Mountain View',
    logo: `${DIR}/mountain-view.png`,
    projects: ['13'],
  },
  {
    id: 'egy-consulate-kuwait',
    name: 'Consulate General of Egypt in Kuwait',
    logo: `${DIR}/egy-consulate-kuwait.jpeg`,
    projects: ['8'],
  },
  {
    id: 'wd-developments',
    name: 'WD Developments',
    logo: `${DIR}/wd-developments.jpeg`,
    projects: ['14'],
  },
  { id: 'otrovato', name: 'Otrovato', logo: `${DIR}/otrovato.webp`, projects: [] },
  { id: 'orascom', name: 'Orascom', logo: `${DIR}/orascom.png`, projects: [] },
  { id: 'hydepark', name: 'Hyde Park Developments', logo: `${DIR}/hydepark.webp`, projects: [] },
  {
    id: 'majid-alfuttaim',
    name: 'Majid Al Futtaim',
    logo: `${DIR}/majid-alfuttaim.png`,
    projects: [],
  },
  {
    id: 'trade-logistics',
    name: 'Trade Logistics',
    logo: `${DIR}/trade-logistics.webp`,
    projects: [],
  },
  { id: 'ckpc', name: 'CKPC', logo: `${DIR}/ckpc.jpeg`, projects: [] },
];

// transparent copy of a logo (tools/make-transparent-logos.js), for the dark pages
export const clearLogo = (id) => `/Assets/Icons/logos-transparent/${id}.webp`;

// home page order (kept as it was)
const HOME_ORDER = [
  'otrovato',
  'orascom',
  'emaar',
  'egy-consulate-kuwait',
  'wyndham',
  'hydepark',
  'majid-alfuttaim',
  'trade-logistics',
  'ckpc',
  'wd-developments',
  'mountain-view',
];
const byId = Object.fromEntries(PARTNERS.map((p) => [p.id, p]));
export const partnerLogos = HOME_ORDER.map((id) => byId[id].logo);
export const PARTNER_NAMES = HOME_ORDER.map((id) => byId[id].name);
