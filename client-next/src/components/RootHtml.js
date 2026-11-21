import Script from 'next/script';
import {
  MAIN_EMAIL,
  MAIN_PHONE,
  MAPS_URL,
  GOOGLE_PROFILE_URL,
  PHONES,
  EMAILS,
  SOCIALS,
} from './Contact/contactData';
import { SITE_URL, ORG_ID, WEBSITE_ID } from '../util/schema-ids';
import { t } from '../util/meta';

// Staging build (fly.staging.toml): hidden from search engines and no Google Analytics,
// so tests never show up in Google or in the visitor statistics.
const IS_STAGING = process.env.NEXT_PUBLIC_SITE_ENV === 'staging';

export const rootMetadata = {
  metadataBase: new URL('https://www.wadidegla-eg.com'),
  title: {
    default: 'Wadi Degla Co.',
  },
  robots: IS_STAGING ? { index: false, follow: false } : { index: true, follow: true },
  description:
    'Discover premium Egyptian marble and limestone from Wadi Degla. Quarry ownership, advanced manufacturing, and global export of slabs, tiles, and blocks for residential, commercial, and landmark projects worldwide.',
  openGraph: {
    title: 'Premium Egyptian Marble & Limestone Supplier | Wadi Degla',
    description:
      'Discover premium Egyptian marble and limestone from Wadi Degla. Quarry ownership, advanced manufacturing, and global export of slabs, tiles, and blocks for residential, commercial, and landmark projects worldwide.',
    url: 'https://www.wadidegla-eg.com/',
    siteName: 'Wadi Degla',
    images: [{ url: '/preview.webp' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Egyptian Marble & Limestone Supplier | Wadi Degla',
    description:
      'Discover premium Egyptian marble and limestone from Wadi Degla. Quarry ownership, advanced manufacturing, and global export of slabs, tiles, and blocks for residential, commercial, and landmark projects worldwide.',
    images: ['/preview.webp'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  // The site name Google shows in results. "Marble & Granite" tells it apart from the
  // Wadi Degla nature reserve, which searches for "Wadi Degla" return first.
  name: 'Wadi Degla Marble & Granite',
  alternateName: 'Wadi Degla',
  url: 'https://www.wadidegla-eg.com',
  description:
    'Egyptian marble, limestone, and granite exporter — Galala marble, Sunny marble, Shelly limestone, Black Aswan granite, and 80+ natural stone varieties available as slabs, tiles, and blocks.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.wadidegla-eg.com/en/products?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: { '@id': ORG_ID },
};

// Contact details come straight from the Contact page's data (contactData.js), so the two
// can never differ.
const phone = (key) => PHONES.find((p) => p.key === key).numbers;
const email = (key) => EMAILS.find((e) => e.key === key).email;
const [, headOffice2] = phone('contactInfo.phoneHeadOffice');
const [support] = phone('contactInfo.phoneSupport');
const LANGS = ['English', 'Arabic'];
const ADDRESS = {
  '@type': 'PostalAddress',
  // the English address from the admin panel (or the site's own), without ", Cairo, Egypt"
  streetAddress: t('en', 'contactInfo.addressLine').replace(/,\s*Cairo,\s*Egypt\s*$/i, ''),
  addressLocality: 'Cairo',
  addressRegion: 'Cairo',
  addressCountry: 'EG',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  // Same name as on the website footer (use it everywhere: Google Business Profile,
  // directories, social pages).
  name: 'Wadi Degla for Marble & Granite',
  legalName: 'Wadi Degla Co. for Marble & Granite',
  alternateName: [
    'Wadi Degla',
    'Wadi Degla Marble',
    'Wadi Degla Co.',
    'وادي دجلة للرخام والجرانيت',
    'شركة وادي دجلة للرخام والجرانيت',
    '와디 데글라',
  ],
  // Tells Google this is not one of the other, unrelated "Wadi Degla" names.
  disambiguatingDescription:
    'Egyptian marble, limestone and granite quarry owner and exporter, founded 1980. Not affiliated with Wadi Degla Holding, Wadi Degla Developments or Wadi Degla Sporting Club.',
  foundingDate: '1980',
  // The company's own profiles (same links as the footer): helps Google connect them.
  // WhatsApp is a chat link, not a profile.
  sameAs: [GOOGLE_PROFILE_URL, ...SOCIALS.filter((s) => s.name !== 'WhatsApp').map((s) => s.href)],
  url: SITE_URL,
  // Google needs a raster logo (PNG/JPG, at least 112x112), not SVG. Made from the colour logo
  // by tools/make-logo-png.js.
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo-512.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/preview.webp`,
  description:
    'Wadi Degla Co. is an Egyptian natural stone company specializing in quarrying, manufacturing, and exporting premium marble, limestone, granite, and travertine. Products include Galala marble, Sunny marble, Shelly limestone, Rosa marble, and more — available as slabs, tiles, blocks, cobbles, kerbstones, and custom finishes for global residential, commercial, and landmark projects.',
  foundingLocation: {
    '@type': 'Place',
    name: 'Egypt',
  },
  // Name, address and phone must stay identical to the Contact page, Google Business
  // Profile and every directory listing (Google matches them to trust the company).
  address: ADDRESS,
  // The map link belongs to a place (schema.org has no hasMap on Organization).
  location: { '@type': 'Place', address: ADDRESS, hasMap: MAPS_URL },
  telephone: MAIN_PHONE.label,
  email: MAIN_EMAIL,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: MAIN_PHONE.label,
      email: email('contactInfo.emailHomes'),
      availableLanguage: LANGS,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: headOffice2.label,
      availableLanguage: LANGS,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'project sales',
      email: email('contactInfo.emailProjects'),
      availableLanguage: LANGS,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'export sales',
      email: email('contactInfo.emailExport'),
      areaServed: 'Worldwide',
      availableLanguage: LANGS,
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: support.label,
      availableLanguage: LANGS,
    },
  ],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Egyptian marble',
    'Galala marble',
    'Egyptian granite',
    'limestone',
    'natural stone export',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'ISO 9001:2015',
    credentialCategory: 'certification',
  },
};

// The <html> element for every page. Rendered by the root layouts with the page's language,
// so the static HTML already says e.g. lang="ar" dir="rtl" (before any JavaScript runs).
export default function RootHtml({ lang = 'en', children }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={lang} dir={dir}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body lang={lang}>
        {children}
        {!IS_STAGING && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-R2Y9CCM4YC"
              strategy="lazyOnload"
            />
            {/* The Google tag downloads after the page has loaded (it used to compete with the
                main photo). gtag() below queues the page view and events until it arrives. */}
            <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          // Cookie consent (src/util/consent.js): statistics wait for consent in the EEA/UK/CH,
          // are allowed elsewhere; no ads. A choice made on the banner is applied straight away.
          var noAds = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
          gtag('consent', 'default', Object.assign({ analytics_storage: 'denied', wait_for_update: 500, region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'] }, noAds));
          gtag('consent', 'default', Object.assign({ analytics_storage: 'granted' }, noAds));
          try { var c = JSON.parse(localStorage.getItem('wd-consent') || 'null'); if (c && c.analytics) gtag('consent', 'update', { analytics_storage: c.analytics }); } catch (e) {}
          gtag('js', new Date());
          gtag('config', 'G-R2Y9CCM4YC');
          gtag('config', 'G-HK6F9VF9R5');
        `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
