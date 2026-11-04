import { t, buildAlternates } from '../../../src/components/../util/meta';
import Fairs from '../../../src/components/Fairs/Fairs';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'fairs.pageTitle', 'Fairs | Wadi Degla'),
    description: t(lang, 'fairs.metaDescription', ''),
    alternates: buildAlternates('/fairs', lang),
    // Empty "Coming soon" page: kept out of Google (and out of the menu and sitemap) until it
    // has real fairs. Then remove this line and add it back to app/sitemap.js and site-menu.js.
    robots: { index: false, follow: true },
  };
}

export default function FairsPage({ params }) {
  return <Fairs />;
}
