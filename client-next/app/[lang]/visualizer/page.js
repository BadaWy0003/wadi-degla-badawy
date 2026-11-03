import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Visualizer = dynamic(() => import('../../../src/components/Products/Visualizer'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'visualizer.pageTitle', 'Visualizer | Wadi Degla'),
    description: t(lang, 'visualizer.metaDescription', ''),
    alternates: buildAlternates('/visualizer', lang),
  };
}

export default function VisualizerPage({ params }) {
  return <Visualizer />;
}
