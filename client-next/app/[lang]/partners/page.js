import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Partners from '../../../src/components/Partners/Partners';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'partners.pageTitle', 'Partners | Wadi Degla');
  const description = t(lang, 'partners.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/partners', lang),
    ...buildSocial({ title, description, path: '/partners', lang }),
  };
}

export default function PartnersPage() {
  return <Partners />;
}
