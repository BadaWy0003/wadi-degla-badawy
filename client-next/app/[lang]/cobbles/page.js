import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Cobble = dynamic(() => import('../../../src/components/Cobble/Cobble'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'cobbles.pageTitle', 'Cobble | Wadi Degla'),
    description: t(lang, 'cobbles.metaDescription', ''),
    alternates: buildAlternates('/cobbles', lang),
  };
}

export default function CobblePage({ params }) {
  return <Cobble />;
}
