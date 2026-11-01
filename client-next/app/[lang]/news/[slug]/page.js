import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import articles from '../../../../src/components/News/newsList';
const NewsDetail = dynamic(() => import('../../../../src/components/News/NewsDetail'), {
  ssr: false,
});

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    articles.map((article) => ({ lang, slug: article.slug })),
  );
}

export function generateMetadata({ params }) {
  const { lang, slug } = params;
  const article = articles.find((a) => a.slug === slug);
  return {
    // Each article gets its own title, description and canonical URL (it used to point
    // to /news/, which told Google to ignore the article pages).
    title: article
      ? `${article.title} | Wadi Degla`
      : t(lang, 'news.pageTitle', 'NewsDetail | Wadi Degla'),
    description: article?.excerpt || t(lang, 'news.metaDescription', ''),
    alternates: buildAlternates(`/news/${slug}`, lang),
  };
}

export default function NewsDetailPage({ params }) {
  return <NewsDetail />;
}
