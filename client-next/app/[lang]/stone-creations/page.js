import { t, buildAlternates } from '../../../src/components/../util/meta';
import StoneCreation from '../../../src/components/StoneCreation/StoneCreation';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'stoneCreation.pageTitle', 'StoneCreation | Wadi Degla'),
    description: t(lang, 'stoneCreation.metaDescription', ''),
    alternates: buildAlternates('/stone-creations', lang),
  };
}

export default function StoneCreationPage({ params }) {
  return <StoneCreation />;
}
