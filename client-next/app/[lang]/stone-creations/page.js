import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import StoneCreation from '../../../src/components/StoneCreation/StoneCreation';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'stoneCreation.pageTitle', 'StoneCreation | Wadi Degla');
  const description = t(lang, 'stoneCreation.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/stone-creations', lang),
    ...buildSocial({ title, description, path: '/stone-creations', lang }),
  };
}

export default function StoneCreationPage({ params }) {
  return <StoneCreation />;
}
