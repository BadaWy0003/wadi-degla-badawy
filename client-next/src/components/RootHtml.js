import Script from 'next/script';

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
  // The site name Google shows in results. "Marble & Granite" tells it apart from the
  // Wadi Degla nature reserve, which searches for "Wadi Degla" return first.
  name: 'Wadi Degla Marble & Granite',
  alternateName: 'Wadi Degla',
  url: 'https://www.wadidegla-eg.com',
  description:
    'Egyptian marble, limestone, and granite exporter — Galala marble, Silvia marble, Shelly limestone, Black Aswan granite, and 80+ natural stone varieties available as slabs, tiles, and blocks.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.wadidegla-eg.com/en/products?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  // Same name as on the website footer (use it everywhere: Google Business Profile,
  // directories, social pages).
  name: 'Wadi Degla for Marble & Granite',
  alternateName: [
    'Wadi Degla',
    'Wadi Degla Marble',
    'Wadi Degla Co.',
    'وادي دجلة للرخام والجرانيت',
  ],
  foundingDate: '1980',
  // The company's own profiles (same links as the footer): helps Google connect them.
  sameAs: [
    'https://www.facebook.com/wadideglaco',
    'https://instagram.com/wadideglaco',
    'https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/',
    'https://t.me/wadideglaco',
    'https://www.tiktok.com/@wadideglaco',
  ],
  url: 'https://www.wadidegla-eg.com',
  logo: 'https://www.wadidegla-eg.com/favicon.svg',
  image: 'https://www.wadidegla-eg.com/preview.webp',
  description:
    'Wadi Degla Co. is an Egyptian natural stone company specializing in quarrying, manufacturing, and exporting premium marble, limestone, granite, and travertine. Products include Galala marble, Silvia marble, Shelly limestone, Rosa marble, and more — available as slabs, tiles, blocks, cobbles, kerbstones, and custom finishes for global residential, commercial, and landmark projects.',
  foundingLocation: {
    '@type': 'Place',
    name: 'Egypt',
  },
  // Name, address and phone must stay identical to the Contact page, Google Business
  // Profile and every directory listing (Google matches them to trust the company).
  address: {
    '@type': 'PostalAddress',
    streetAddress: '36, 241D Shaq Al-Thoaban Industrial Area for Marble & Granite, Tourrah',
    addressLocality: 'Cairo',
    addressRegion: 'Cairo',
    addressCountry: 'EG',
  },
  telephone: '+20 10 6726 0314',
  email: 'info@wadidegla-eg.com',
  hasMap: 'https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+20 10 6726 0314',
      email: 'sales@wadidegla-eg.com',
      availableLanguage: ['English', 'Arabic'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'export sales',
      email: 'export@wadidegla-eg.com',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Arabic'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+20 101 666 7890',
      availableLanguage: ['English', 'Arabic'],
    },
  ],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Egyptian marble',
    'Egyptian granite',
    'imported marble',
    'imported granite',
    'Galala marble',
    'Silvia marble',
    'Rosa marble',
    'Shelly limestone',
    'Egyptian limestone',
    'natural stone export',
    'marble slabs',
    'limestone tiles',
    'granite blocks',
    'travertine',
    'marble quarrying',
  ],
};

// The <html> element for every page. Rendered by the root layouts with the page's language,
// so the static HTML already says e.g. lang="ar" dir="rtl" (before any JavaScript runs).
export default function RootHtml({ lang = 'en', children }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={lang} dir={dir}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
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
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
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
