import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import News from '../../../src/components/News/News';
import { getNewsArticles } from '../../../src/util/news-data';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'news.pageTitle', 'News | Wadi Degla');
  const description = t(lang, 'news.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/news', lang),
    ...buildSocial({ title, description, path: '/news', lang }),
  };
}

// Articles come from the admin panel (read at build time, see src/util/news-data.js).
export default async function NewsPage(props) {
  const params = await props.params;
  const articles = await getNewsArticles(params.lang);
  return <News articles={articles} />;
}
