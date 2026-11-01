import { t, buildAlternates } from '../../../src/util/meta';
import Partners from '../../../src/components/Partners/Partners';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'partners.pageTitle', 'Partners | Wadi Degla'),
    description: t(lang, 'partners.metaDescription', ''),
    alternates: buildAlternates('/partners', lang),
  };
}

export default function PartnersPage() {
  return <Partners />;
}
