import { t, buildAlternates } from '../../../src/util/meta';
import History from '../../../src/components/History/History';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'history.pageTitle', 'History | Wadi Degla'),
    description: t(lang, 'history.metaDescription', ''),
    alternates: buildAlternates('/history', lang),
  };
}

export default function HistoryPage() {
  return <History />;
}
