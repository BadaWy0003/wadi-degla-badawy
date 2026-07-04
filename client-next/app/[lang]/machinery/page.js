import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Machinery = dynamic(() => import('../../../src/components/Machinery/Machinery'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'machinery.pageTitle', 'Machinery | Wadi Degla'),
    description: t(lang, 'machinery.metaDescription', ''),
    alternates: buildAlternates('/machinery', lang),
  };
}

export default function MachineryPage() {
  return <Machinery />;
}
