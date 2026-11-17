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
// hour (0-24), days (list of weekday codes), line (short plain text, + optional, max),
// image ({ src, width, height }, uploaded in the admin panel), images (list of images),
// i18n ({ en, ar } inside a list item; + multiline, optional, max), select (+ options),
// country (2-letter code), projects (list of project numbers), list (+ fields, itemLabel,
// titleField, min, max: repeatable items, each with an id).

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
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'The certificate photos (upload the renewed copies here), their numbers and the texts of the Certificates page.',
    usedOn: ['Certificates', 'Home (certificate logos)'],
    sections: [
      {
        id: 'docs',
        title: 'Certificate photos',
        help: "A clear photo or scan of each certificate (JPG, PNG or WebP). They open full size on the Certificates page and from the logos on the home page. Only facts that don't expire are written on the page, so no dates are needed.",
        fields: [
          { type: 'image', name: 'isoDoc', label: 'ISO 9001:2015 certificate' },
          { type: 'image', name: 'eosDoc', label: 'EOS registration' },
          { type: 'image', name: 'cbmiDoc', label: 'CBMI membership' },
        ],
      },
      {
        id: 'iso',
        title: 'ISO 9001:2015',
        fields: [
          { type: 'line', name: 'isoNumber', label: 'Certificate number', max: 60 },
          { type: 'line', name: 'isoIssuer', label: 'Issued by', max: 80 },
          { type: 'text', key: 'certificates.isoText', label: 'Text', multiline: true, max: 1200 },
          { type: 'text', key: 'certificates.isoScope', label: 'Scope', multiline: true, max: 400 },
          { type: 'text', key: 'certificates.isoAccredited', label: 'Accreditation', max: 200 },
        ],
      },
      {
        id: 'egypt',
        title: 'Registered in Egypt',
        fields: [
          { type: 'line', name: 'eosNumber', label: 'EOS registration number', max: 60 },
          { type: 'text', key: 'certificates.eosText', label: 'EOS text', multiline: true, max: 800 },
          { type: 'line', name: 'cbmiNumber', label: 'CBMI membership number', max: 60 },
          { type: 'text', key: 'certificates.cbmiText', label: 'CBMI text', multiline: true, max: 800 },
          { type: 'text', key: 'certificates.cbmiActivity', label: 'CBMI activity', max: 200 },
        ],
      },
      {
        id: 'page',
        title: 'Page header & Google',
        fields: [
          { type: 'text', key: 'certificates.pageHeading', label: 'Page title (H1)', max: 120 },
          { type: 'text', key: 'certificates.intro', label: 'Introduction', multiline: true, max: 600 },
          { type: 'text', key: 'certificates.pageTitle', label: 'Google title', max: 60 },
          { type: 'text', key: 'certificates.metaDescription', label: 'Google description', multiline: true, max: 155 },
        ],
      },
    ],
  },
  {
    id: 'fairs',
    title: 'Fairs & exhibitions',
    description: 'The fairs the team visited (add, change, reorder or remove a fair, with its photos), and the page texts.',
    usedOn: ['Fairs'],
    sections: [
      {
        id: 'list',
        title: 'Fairs',
        help: 'Newest first. The numbers at the top of the page (fairs, countries, continents) are counted from this list. Write only that the team visited, never "our stand".',
        fields: [
          {
            type: 'list',
            name: 'fairs',
            label: 'Fairs',
            itemLabel: 'fair',
            titleField: 'name',
            min: 1,
            max: 40,
            fields: [
              { type: 'line', name: 'name', label: 'Fair name', max: 80 },
              {
                type: 'line',
                name: 'city',
                label: 'City',
                optional: true,
                max: 60,
                help: 'Leave empty to show only the country.',
              },
              { type: 'country', name: 'country', label: 'Country' },
              {
                type: 'select',
                name: 'continent',
                label: 'Continent',
                options: [
                  { value: 'europe', label: 'Europe' },
                  { value: 'asia', label: 'Asia' },
                  { value: 'africa', label: 'Africa' },
                  { value: 'northAmerica', label: 'North America' },
                  { value: 'southAmerica', label: 'South America' },
                  { value: 'oceania', label: 'Oceania' },
                ],
              },
              { type: 'number', name: 'year', label: 'Year visited', min: 1980, max: 2100 },
              {
                type: 'select',
                name: 'month',
                label: 'Month visited',
                options: [
                  { value: 0, label: '(only the year)' },
                  ...[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((m, i) => ({ value: i + 1, label: m })),
                ],
              },
              { type: 'i18n', name: 'text', label: 'About the fair', multiline: true, max: 1500 },
              { type: 'images', name: 'photos', label: 'Photos', min: 1, max: 12, help: 'The first photo is the big one.' },
            ],
          },
        ],
      },
      {
        id: 'page',
        title: 'Page header & Google',
        fields: [
          { type: 'text', key: 'fairs.heading', label: 'Page title (H1)', max: 120 },
          { type: 'text', key: 'fairs.intro', label: 'Introduction', multiline: true, max: 600 },
          { type: 'text', key: 'fairs.pageTitle', label: 'Google title', max: 60 },
          { type: 'text', key: 'fairs.metaDescription', label: 'Google description', multiline: true, max: 155 },
        ],
      },
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns & pavers',
    description:
      'The names of the paving and split-face stones on the Patterns page (shown as "Stone 1, 2…" until named), and the page texts.',
    usedOn: ['Patterns / Pavers'],
    sections: [
      {
        id: 'pavers',
        title: 'Paving stones (pool deck)',
        help: 'In the order of the small pictures on the page. Leave a name empty to show "Stone 1", "Stone 2"...',
        fields: [1, 2, 3, 4].map((n) => ({
          type: 'line',
          name: `paver${n}`,
          label: `Paving stone ${n}`,
          optional: true,
          max: 60,
        })),
      },
      {
        id: 'splitFace',
        title: 'Split-face stones (house front)',
        help: 'In the order of the small pictures on the page.',
        fields: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
          type: 'line',
          name: `split${n}`,
          label: `Split-face stone ${n}`,
          optional: true,
          max: 60,
        })),
      },
      {
        id: 'page',
        title: 'Page header & Google',
        fields: [
          { type: 'text', key: 'patterns.heroTitle', label: 'Page title (H1)', max: 120 },
          { type: 'text', key: 'patterns.introText', label: 'Introduction', multiline: true, max: 800 },
          { type: 'text', key: 'patterns.pageTitle', label: 'Google title', max: 60 },
          { type: 'text', key: 'patterns.metaDescription', label: 'Google description', multiline: true, max: 155 },
        ],
      },
    ],
  },
  {
    id: 'partners',
    title: 'Partners & clients',
    description:
      'The partners and clients (logo, name, the projects done for them and a short story), used on the Partners page and the home page.',
    usedOn: ['Partners', 'Home'],
    sections: [
      {
        id: 'list',
        title: 'Partners',
        help: 'In page order. A partner with projects gets a "partner story" (its logo, story and project cards); the others are shown under "Also trusted by". Logos look best as a PNG or WebP with a transparent background.',
        fields: [
          {
            type: 'list',
            name: 'partners',
            label: 'Partners',
            itemLabel: 'partner',
            titleField: 'name',
            min: 1,
            max: 60,
            fields: [
              { type: 'line', name: 'name', label: 'Name', max: 80 },
              { type: 'image', name: 'logo', label: 'Logo' },
              { type: 'projects', name: 'projects', label: 'Projects done for them', optional: true },
              {
                type: 'i18n',
                name: 'story',
                label: 'Partner story (one or two sentences)',
                multiline: true,
                optional: true,
                max: 400,
                help: 'Shown when the partner has projects.',
              },
            ],
          },
        ],
      },
      {
        id: 'page',
        title: 'Page header & Google',
        fields: [
          { type: 'text', key: 'partners.pageHeading', label: 'Page title (H1)', max: 120 },
          { type: 'text', key: 'partners.introText', label: 'Introduction', multiline: true, max: 600 },
          { type: 'text', key: 'partners.pageTitle', label: 'Google title', max: 60 },
          { type: 'text', key: 'partners.metaDescription', label: 'Google description', multiline: true, max: 155 },
        ],
      },
    ],
  },
];

const getBlock = (id) => BLOCKS.find((b) => b.id === id) || null;
const fieldsOf = (block) => block.sections.flatMap((s) => s.fields);

module.exports = { BLOCKS, WEEKDAYS, getBlock, fieldsOf };
