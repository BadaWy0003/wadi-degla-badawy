import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const History = dynamic(() => import('../../../src/components/History/History'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'history.pageTitle', 'History | Wadi Degla'),
    description: t(lang, 'history.metaDescription', ''),
    alternates: buildAlternates('/history'),
  };
}

export default function HistoryPage() {
  return <History />;
}
