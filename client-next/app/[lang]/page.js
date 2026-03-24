import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../src/util/meta';
const Home = dynamic(() => import('../../src/components/Home/Home'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'home.pageTitle', 'Wadi Degla | Egyptian Natural Stone'),
    description: t(lang, 'home.metaDescription', ''),
    alternates: buildAlternates(''),
  };
}

export default function HomePage() {
  return <Home />;
}
