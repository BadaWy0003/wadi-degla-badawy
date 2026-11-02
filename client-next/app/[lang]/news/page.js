import { t, buildAlternates } from '../../../src/util/meta';
import News from '../../../src/components/News/News';
import { getNewsArticles } from '../../../src/util/news-data';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'news.pageTitle', 'News | Wadi Degla'),
    description: t(lang, 'news.metaDescription', ''),
    alternates: buildAlternates('/news', lang),
  };
}

// Articles come from the admin panel (read at build time, see src/util/news-data.js).
export default async function NewsPage({ params }) {
  const articles = await getNewsArticles(params.lang);
  return <News articles={articles} />;
}
