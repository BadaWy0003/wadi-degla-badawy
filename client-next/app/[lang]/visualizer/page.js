import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Visualizer = dynamic(() => import('../../../src/components/Products/Visualizer'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'products.pageTitle', 'Visualizer | Wadi Degla'),
    description: t(lang, 'products.metaDescription', ''),
    alternates: buildAlternates('/visualizer'),
  };
}

export default function VisualizerPage({ params }) {
  return <Visualizer />;
}
