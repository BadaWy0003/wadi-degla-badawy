import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import History from '../../../src/components/History/History';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'history.pageTitle', 'History | Wadi Degla');
  const description = t(lang, 'history.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/history', lang),
    ...buildSocial({ title, description, path: '/history', lang }),
  };
}

export default function HistoryPage({ params }) {
  return (
    <History>
      <RelatedPages lang={params.lang} page="history" />
    </History>
  );
}
