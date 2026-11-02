import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import NewsDetail from '../../../../src/components/News/NewsDetail';
import { getNewsSlugs, getNewsArticle } from '../../../../src/util/news-data';

// One page per article and language, from the admin panel (read at build time).
export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return SUPPORTED_LANGS.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = params;
  const article = await getNewsArticle(slug, lang);
  return {
    // Each article gets its own title, description and canonical URL.
    title: article ? `${article.title} | Wadi Degla` : t(lang, 'news.pageTitle', 'NewsDetail | Wadi Degla'),
    description: article?.excerpt || t(lang, 'news.metaDescription', ''),
    alternates: buildAlternates(`/news/${slug}`, lang),
  };
}

export default async function NewsDetailPage({ params }) {
  const article = await getNewsArticle(params.slug, params.lang);
  return <NewsDetail article={article} />;
}
