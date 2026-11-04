// The company's contact details, shared by the Contact page's quick buttons and info panel.
// Keep them identical to the Organization JSON-LD in src/components/RootHtml.js, the Google
// Business Profile and every directory listing.

export const WHATSAPP_URL = 'https://wa.me/message/LAQ57AMNJ5ZON1?src=qr';
export const MAPS_URL = 'https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7';
export const MAIN_EMAIL = 'info@wadidegla-eg.com';

export const MAIN_PHONE = { tel: '+201067260314', label: '+20 10 6726 0314' };

export const PHONES = [
  {
    key: 'contactInfo.phoneHeadOffice',
    numbers: [MAIN_PHONE, { tel: '+201155559896', label: '+20 11 5555 9896' }],
  },
  {
    key: 'contactInfo.phoneSupport',
    numbers: [{ tel: '+201016667890', label: '+20 101 666 7890' }],
  },
];

export const EMAILS = [
  { key: 'contactInfo.emailHomes', email: 'sales@wadidegla-eg.com' },
  { key: 'contactInfo.emailProjects', email: 'projects@wadidegla-eg.com' },
  { key: 'contactInfo.emailExport', email: 'export@wadidegla-eg.com' },
  { key: 'contactInfo.emailInfo', email: MAIN_EMAIL },
];

export const DOWNLOADS = [
  {
    key: 'contactInfo.profileTitle',
    href: 'https://drive.google.com/file/d/1cr1xARl2DO_dmVo2NUaZrP6mJ0FyNHUa/view',
  },
  {
    key: 'contactInfo.catalogueTitle',
    href: 'https://drive.google.com/file/d/17sczDrWJN8pWQ4EPHMdIeh30TLbXYh-l/view?usp=sharing',
  },
];

const SOCIAL_ICONS = '/Assets/Icons/Social';
export const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/wadideglaco', icon: 'facebook' },
  { name: 'Instagram', href: 'https://instagram.com/wadideglaco', icon: 'instagram' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/',
    icon: 'linkedin',
  },
  { name: 'WhatsApp', href: WHATSAPP_URL, icon: 'whatsapp' },
  { name: 'Telegram', href: 'https://t.me/wadideglaco', icon: 'telegram' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@wadideglaco', icon: 'tiktok' },
].map((s) => ({ ...s, icon: `${SOCIAL_ICONS}/${s.icon}-circle-white-icon.svg` }));

export const QR = { href: 'https://wadideg.social/', img: `${SOCIAL_ICONS}/QR.png` };

// Opening hours: Saturday to Thursday, 9:00-17:00 Cairo time (closed on Friday).
// Returns true/false, or null when the browser can't tell the Cairo time.
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
    return day !== 'Fri' && hour >= 9 && hour < 17;
  } catch {
    return null;
  }
}
