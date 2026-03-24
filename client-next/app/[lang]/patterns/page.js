import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Patterns = dynamic(() => import('../../../src/components/Patterns/Patterns'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'patterns.pageTitle', 'Patterns | Wadi Degla'),
    description: t(lang, 'patterns.metaDescription', ''),
    alternates: buildAlternates('/patterns'),
  };
}

export default function PatternsPage({ params }) {
  return <Patterns />;
}
