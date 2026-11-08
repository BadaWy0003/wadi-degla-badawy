import dynamic from 'next/dynamic';
import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
const Visualizer = dynamic(() => import('../../../src/components/Products/Visualizer'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'visualizer.pageTitle', 'Visualizer | Wadi Degla');
  const description = t(lang, 'visualizer.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/visualizer', lang),
    ...buildSocial({ title, description, path: '/visualizer', lang }),
  };
}

export default function VisualizerPage({ params }) {
  return <Visualizer />;
}
