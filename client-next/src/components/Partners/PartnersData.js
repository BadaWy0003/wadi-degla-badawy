// Partners and clients: logo files, names, and the projects (numbers from the admin panel,
// i.e. /projects/<n>) done for them, which the Partners page shows as "partner stories".
// The home page uses partnerLogos / PARTNER_NAMES (original logos, same order).
import { siteData } from '../../util/site-content';

const DIR = '/Assets/Icons/partners';

const PARTNERS_DEFAULT = [
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
const DEFAULT_LOGO = Object.fromEntries(PARTNERS_DEFAULT.map((p) => [p.id, p.logo]));

// The admin panel's list ("Website" → "Partners & clients") replaces the default list once the
// client changed it. `clear`: the logo shown on the dark pages: the transparent copy while the
// logo is the original one, else the uploaded logo. `story` { en, ar } is resolved per language
// by app/[lang]/partners/page.js.
const CMS_PARTNERS = siteData('partners').partners;
export const PARTNERS = CMS_PARTNERS
  ? CMS_PARTNERS.map((p) => ({
      id: p.id,
      name: p.name,
      logo: p.logo.src,
      projects: (p.projects || []).map(String),
      story: p.story,
      clear: DEFAULT_LOGO[p.id] === p.logo.src ? clearLogo(p.id) : p.logo.src,
    }))
  : PARTNERS_DEFAULT.map((p) => ({ ...p, clear: clearLogo(p.id) }));

// The default list in the admin panel's shape (for /<lang>/content-defaults.json).
export const partnersForAdmin = (storyOf, sizeOf) =>
  PARTNERS_DEFAULT.map((p) => ({
    id: p.id,
    name: p.name,
    logo: { src: p.logo, ...sizeOf(p.logo) },
    projects: p.projects,
    story: storyOf(p.id),
  }));

// home page order (kept as it was while the list is the default one)
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
// The home page's logos: { logo (light copy), name }, in the admin panel's order once edited.
export const HOME_PARTNERS = CMS_PARTNERS
  ? PARTNERS.map((p) => ({ logo: p.clear, name: p.name }))
  : HOME_ORDER.map((id) => ({ logo: byId[id].clear, name: byId[id].name }));
