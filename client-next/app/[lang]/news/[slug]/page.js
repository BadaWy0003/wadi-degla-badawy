import { t, buildAlternates, buildSocial } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import NewsDetail from '../../../../src/components/News/NewsDetail';
import {
  getNewsSlugs,
  getNewsArticle,
  getNewsArticles,
  getNewsIndexedLangs,
} from '../../../../src/util/news-data';

// One page per article and language, from the admin panel (read at build time).
// With no visible articles (e.g. all hidden), a static export can't have an empty dynamic
// route, so a placeholder page (shows "article not found", noindex, not in the sitemap) is built.
const EMPTY_SLUG = 'no-articles';

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  const list = slugs.length ? slugs : [EMPTY_SLUG];
  return SUPPORTED_LANGS.flatMap((lang) => list.map((slug) => ({ lang, slug })));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang, slug } = params;
  const article = await getNewsArticle(slug, lang);
  const langs = await getNewsIndexedLangs(slug);
  // " | Wadi Degla" is left off when the title would pass 60 characters (Google cuts the rest)
  const title = article
    ? `${article.title} | Wadi Degla`.length > 60
      ? article.title
      : `${article.title} | Wadi Degla`
    : t(lang, 'news.pageTitle', 'NewsDetail | Wadi Degla');
  const description = article?.excerpt || t(lang, 'news.metaDescription', '');
  return {
    // Each article gets its own title, description and canonical URL.
    title,
    description,
    alternates: buildAlternates(`/news/${slug}`, lang, langs),
    // Shared links show the article's cover photo.
    ...buildSocial({ title, description, path: `/news/${slug}`, lang, image: article?.thumbnail }),
    // Not found, or not written in this language (English text shown): keep out of Google.
    ...(article && langs.includes(lang) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function NewsDetailPage(props) {
  const params = await props.params;
  const article = await getNewsArticle(params.slug, params.lang);
  // "More news": the three newest other articles.
  const more = (await getNewsArticles(params.lang))
    .filter((a) => a.slug !== params.slug)
    .slice(0, 3);
  return <NewsDetail article={article} more={more} lang={params.lang} />;
}
