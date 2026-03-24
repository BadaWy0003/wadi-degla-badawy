import '../src/index.css';
import '../src/App.css';

export const metadata = {
  metadataBase: new URL('https://www.wadidegla-eg.com'),
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
