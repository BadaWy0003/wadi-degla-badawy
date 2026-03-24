import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Packing = dynamic(() => import('../../../src/components/Packing/Packing'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'packing.pageTitle', 'Packing | Wadi Degla'),
    description: t(lang, 'packing.metaDescription', ''),
    alternates: buildAlternates('/packing'),
  };
}

export default function PackingPage() {
  return <Packing />;
}
