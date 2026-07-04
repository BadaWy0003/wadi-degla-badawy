import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Kerbstone = dynamic(() => import('../../../src/components/Kerbstone/Kerbstone'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'kerbstone.pageTitle', 'Kerbstone | Wadi Degla'),
    description: t(lang, 'kerbstone.metaDescription', ''),
    alternates: buildAlternates('/kerbstone', lang),
  };
}

export default function KerbstonePage({ params }) {
  return <Kerbstone />;
}
