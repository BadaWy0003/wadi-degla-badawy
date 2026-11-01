import { t, buildAlternates } from '../../../src/util/meta';
import Machinery from '../../../src/components/Machinery/Machinery';

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
