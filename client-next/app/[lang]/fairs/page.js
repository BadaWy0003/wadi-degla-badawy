import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Fairs = dynamic(() => import('../../../src/components/Fairs/Fairs'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'fairs.pageTitle', 'Fairs | Wadi Degla'),
    description: t(lang, 'fairs.metaDescription', ''),
    alternates: buildAlternates('/fairs', lang),
  };
}

export default function FairsPage({ params }) {
  return <Fairs />;
}
