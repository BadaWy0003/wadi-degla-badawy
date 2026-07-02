import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../src/util/meta';
const Home = dynamic(() => import('../../src/components/Home/Home'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  const pageTitle = t(lang, 'home.pageTitle', 'Wadi Degla | Egyptian Natural Stone');
  return {
    title: pageTitle,
    description: t(lang, 'home.metaDescription', ''),
    openGraph: { title: pageTitle },
    alternates: buildAlternates(''),
  };
}

export default function HomePage() {
  return <Home />;
}
