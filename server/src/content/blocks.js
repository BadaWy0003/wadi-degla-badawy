// The website content the client edits in the admin panel ("Website" menu), one "block" per
// page or shared part of the site. This list is the single description of every editable
// field: the admin panel builds its forms from it and the server validates against it.
//
// Two kinds of fields:
// - text: a website text (a key of client-next/translations/*.json, e.g. "contact.hours").
//   The client writes English and Arabic; saved as texts[key] = { en, ar }. The website puts
//   it over its own text at build time; the other 10 languages keep their translation until
//   the English changes, then show the new English (owner's choice, 2026-11-17).
// - data: anything else (numbers, phone numbers, links...); saved as data[name].
// Only changed fields are saved: a field that isn't saved shows the website's own value
// (its "original", read from /<lang>/content-defaults.json on the website).
//
// Field types: text (+ multiline, max), number (+ min, max, suffix), phone, email, url,
// hour (0-24), days (list of weekday codes).

const WEEKDAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const BLOCKS = [
  {
    id: 'company',
    title: 'Company facts & contact',
    description:
      'The numbers, phone numbers, emails, address, opening hours and links used all over the website (footer, Contact page, Google business data).',
    usedOn: [
      'Every page (footer)',
      'Home',
      'Why choose us',
      'History',
      'Contact',
      'Quarries',
      'Products',
      'Projects',
      'Exports',
      'Google',
    ],
    sections: [
      {
        id: 'numbers',
        title: 'Key numbers',
        help: 'Shown in the number counters on the Home, Why choose us, History, Quarries, Products, Projects and Exports pages, and inside sentences such as "more than 31 countries" in every language. The years in business are counted automatically from the founding year.',
        fields: [
          {
            type: 'number',
            name: 'foundedYear',
            label: 'Founding year',
            min: 1900,
            max: 2100,
            help: 'Years in business = this year minus the founding year (updates by itself every January).',
          },
          { type: 'number', name: 'quarries', label: 'Quarries', min: 0, max: 1000 },
          { type: 'number', name: 'factories', label: 'Factories', min: 0, max: 100 },
          { type: 'number', name: 'exportCountries', label: 'Export countries', min: 0, max: 250, suffix: '+' },
          { type: 'number', name: 'workers', label: 'Skilled workers', min: 0, max: 100000, suffix: '+' },
          { type: 'number', name: 'projects', label: 'Projects completed', min: 0, max: 100000, suffix: '+' },
          { type: 'number', name: 'dailyCapacity', label: 'Production per day', min: 0, max: 1000000, suffix: ' m²' },
          { type: 'number', name: 'factoryArea', label: 'Total factory area', min: 0, max: 10000000, suffix: ' m²' },
        ],
      },
      {
        id: 'phones',
        title: 'Phone numbers',
        help: "Written with the country code, e.g. +20 10 6726 0314. The main number is used in the footer, on the Contact page and in Google's business data.",
        fields: [
          { type: 'phone', name: 'mainPhone', label: 'Main phone (head office)' },
          { type: 'phone', name: 'phone2', label: 'Second head office phone' },
          { type: 'phone', name: 'supportPhone', label: 'Support phone' },
        ],
      },
      {
        id: 'emails',
        title: 'Email addresses',
        help: "The main email is used in the footer and in Google's business data; the others are listed on the Contact page.",
        fields: [
          { type: 'email', name: 'emailInfo', label: 'Main email (for more information)' },
          { type: 'email', name: 'emailSales', label: 'Homes, retail & sales' },
          { type: 'email', name: 'emailProjects', label: 'Projects, local & international' },
          { type: 'email', name: 'emailExport', label: 'Wholesalers, distributors & agents' },
        ],
      },
      {
        id: 'address',
        title: 'Address & opening hours',
        help: 'Keep the address exactly as on the Google Business Profile (Google compares them).',
        fields: [
          { type: 'text', key: 'contactInfo.addressLine', label: 'Address', multiline: true, max: 300 },
          { type: 'url', name: 'mapsUrl', label: 'Google Maps link' },
          { type: 'text', key: 'contact.hours', label: 'Opening hours (as written on the site)', max: 120 },
          {
            type: 'days',
            name: 'openDays',
            label: 'Open days',
            help: 'Used for the live "Open now / Closed now" badge and Google.',
          },
          { type: 'hour', name: 'openHour', label: 'Opens at (Cairo time)' },
          { type: 'hour', name: 'closeHour', label: 'Closes at (Cairo time)' },
        ],
      },
      {
        id: 'links',
        title: 'WhatsApp & social pages',
        help: 'Full links starting with https://. The WhatsApp link is used by every "WhatsApp" button on the site.',
        fields: [
          { type: 'url', name: 'whatsappUrl', label: 'WhatsApp chat link' },
          { type: 'url', name: 'googleProfileUrl', label: 'Google Business Profile link' },
          { type: 'url', name: 'facebook', label: 'Facebook' },
          { type: 'url', name: 'instagram', label: 'Instagram' },
          { type: 'url', name: 'linkedin', label: 'LinkedIn' },
          { type: 'url', name: 'telegram', label: 'Telegram' },
          { type: 'url', name: 'tiktok', label: 'TikTok' },
        ],
      },
      {
        id: 'downloads',
        title: 'Downloads',
        help: 'Links to the files offered on the Contact page.',
        fields: [
          { type: 'url', name: 'profileUrl', label: 'Company profile (PDF link)' },
          { type: 'url', name: 'catalogueUrl', label: 'Special products catalogue (PDF link)' },
        ],
      },
    ],
  },
];

const getBlock = (id) => BLOCKS.find((b) => b.id === id) || null;
const fieldsOf = (block) => block.sections.flatMap((s) => s.fields);

module.exports = { BLOCKS, WEEKDAYS, getBlock, fieldsOf };
