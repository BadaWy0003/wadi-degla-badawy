import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import articles from '../../../../src/components/News/newsList';
const NewsDetail = dynamic(() => import('../../../../src/components/News/NewsDetail'), { ssr: false });

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    articles.map((article) => ({ lang, slug: article.slug }))
  );
}

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'news.pageTitle', 'NewsDetail | Wadi Degla'),
    description: t(lang, 'news.metaDescription', ''),
    alternates: buildAlternates('/news', lang),
  };
}

export default function NewsDetailPage({ params }) {
  return <NewsDetail />;
}
