import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Inspiration = dynamic(() => import('../../../src/components/Inspiration/Inspiration'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'inspiration.pageTitle', 'Inspiration | Wadi Degla'),
    description: t(lang, 'inspiration.metaDescription', ''),
    alternates: buildAlternates('/inspiration'),
  };
}

export default function InspirationPage() {
  return <Inspiration />;
}
