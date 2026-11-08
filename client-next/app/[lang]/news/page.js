import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import News from '../../../src/components/News/News';
import { getNewsArticles } from '../../../src/util/news-data';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
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
export default async function NewsPage({ params }) {
  const articles = await getNewsArticles(params.lang);
  return (
    <>
      <HeroPreload page="news" />
      <News articles={articles} />
    </>
  );
}
