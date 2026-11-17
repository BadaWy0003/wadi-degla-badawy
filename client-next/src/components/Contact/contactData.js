// The company's contact details, shared by the Contact page's quick buttons and info panel.
// Keep them identical to the Organization JSON-LD in src/components/RootHtml.js, the Google
// Business Profile and every directory listing.

// Since 2026-11-17 the values come from src/util/company.js: the website's own values with the
// client's changes from the admin panel ("Website" → "Company facts & contact") on top.
import { COMPANY, telOf } from '../../util/company';

export const WHATSAPP_URL = COMPANY.whatsappUrl;
export const MAPS_URL = COMPANY.mapsUrl;
// The company's Google Business Profile (the profile's own "Share" link). Listed in the
// Organization JSON-LD's sameAs so Google ties the profile to this website.
export const GOOGLE_PROFILE_URL = COMPANY.googleProfileUrl;
export const MAIN_EMAIL = COMPANY.emailInfo;

const phone = (label) => ({ tel: telOf(label), label });
export const MAIN_PHONE = phone(COMPANY.mainPhone);

export const PHONES = [
  {
    key: 'contactInfo.phoneHeadOffice',
    numbers: [MAIN_PHONE, phone(COMPANY.phone2)],
  },
  {
    key: 'contactInfo.phoneSupport',
    numbers: [phone(COMPANY.supportPhone)],
  },
];

export const EMAILS = [
  { key: 'contactInfo.emailHomes', email: COMPANY.emailSales },
  { key: 'contactInfo.emailProjects', email: COMPANY.emailProjects },
  { key: 'contactInfo.emailExport', email: COMPANY.emailExport },
  { key: 'contactInfo.emailInfo', email: MAIN_EMAIL },
];

export const DOWNLOADS = [
  { key: 'contactInfo.profileTitle', href: COMPANY.profileUrl },
  { key: 'contactInfo.catalogueTitle', href: COMPANY.catalogueUrl },
];

const SOCIAL_ICONS = '/Assets/Icons/Social';
export const SOCIALS = [
  { name: 'Facebook', href: COMPANY.facebook, icon: 'facebook' },
  { name: 'Instagram', href: COMPANY.instagram, icon: 'instagram' },
  { name: 'LinkedIn', href: COMPANY.linkedin, icon: 'linkedin' },
  { name: 'WhatsApp', href: WHATSAPP_URL, icon: 'whatsapp' },
  { name: 'Telegram', href: COMPANY.telegram, icon: 'telegram' },
  { name: 'TikTok', href: COMPANY.tiktok, icon: 'tiktok' },
].map((s) => ({ ...s, icon: `${SOCIAL_ICONS}/${s.icon}-circle-white-icon.svg` }));

export const QR = { href: 'https://wadideg.social/', img: `${SOCIAL_ICONS}/QR.png` };

// Opening hours (admin panel: open days and hours, Cairo time). Returns true/false, or null
// when the browser can't tell the Cairo time.
export function isOpenNow(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      weekday: 'short',
      hour: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(date);
    const day = parts.find((p) => p.type === 'weekday')?.value;
    const hour = Number(parts.find((p) => p.type === 'hour')?.value);
    return COMPANY.openDays.includes(day) && hour >= COMPANY.openHour && hour < COMPANY.closeHour;
  } catch {
    return null;
  }
}
