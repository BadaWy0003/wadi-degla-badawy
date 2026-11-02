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
  name: 'Wadi Degla',
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
  name: 'Wadi Degla Co.',
  alternateName: 'Wadi Degla',
  url: 'https://www.wadidegla-eg.com',
  logo: 'https://www.wadidegla-eg.com/favicon.svg',
  image: 'https://www.wadidegla-eg.com/preview.webp',
  description:
    'Wadi Degla Co. is an Egyptian natural stone company specializing in quarrying, manufacturing, and exporting premium marble, limestone, granite, and travertine. Products include Galala marble, Silvia marble, Shelly limestone, Rosa marble, and more — available as slabs, tiles, blocks, cobbles, kerbstones, and custom finishes for global residential, commercial, and landmark projects.',
  foundingLocation: {
    '@type': 'Place',
    name: 'Egypt',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EG',
    addressRegion: 'Cairo',
    addressLocality: 'Cairo',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English', 'Arabic'],
    },
  ],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Egyptian marble',
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
        `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
