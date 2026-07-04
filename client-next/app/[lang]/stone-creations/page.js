import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const StoneCreation = dynamic(() => import('../../../src/components/StoneCreation/StoneCreation'), { ssr: false });

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
