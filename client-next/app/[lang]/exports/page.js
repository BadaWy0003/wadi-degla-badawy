import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Exports from '../../../src/components/Exports/Exports';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'exports.pageTitle', 'Exports | Wadi Degla');
  const description = t(lang, 'exports.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/exports', lang),
    ...buildSocial({ title, description, path: '/exports', lang }),
  };
}

export default function ExportsPage() {
  return <Exports />;
}
