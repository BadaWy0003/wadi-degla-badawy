import { t, buildAlternates } from '../../../src/util/meta';
import History from '../../../src/components/History/History';
import HeroPreload from '../../../src/components/HeroPreload';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'history.pageTitle', 'History | Wadi Degla'),
    description: t(lang, 'history.metaDescription', ''),
    alternates: buildAlternates('/history', lang),
  };
}

export default function HistoryPage({ params }) {
  return (
    <>
      <HeroPreload page="history" />
      <History />
      <RelatedPages lang={params.lang} page="history" />
    </>
  );
}
