import '../src/index.css';
import '../src/App.css';

export const metadata = {
  metadataBase: new URL('https://www.wadidegla-eg.com'),
  title: {
    default: 'Wadi Degla Co.',
  },
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

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
