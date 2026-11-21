import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import History from '../../../src/components/History/History';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function HistoryPage(props) {
  const params = await props.params;
  return (
    <History>
      <RelatedPages lang={params.lang} page="history" />
    </History>
  );
}
