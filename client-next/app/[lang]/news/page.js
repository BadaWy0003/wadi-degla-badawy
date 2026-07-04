import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const News = dynamic(() => import('../../../src/components/News/News'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'news.pageTitle', 'News | Wadi Degla'),
    description: t(lang, 'news.metaDescription', ''),
    alternates: buildAlternates('/news', lang),
  };
}

export default function NewsPage({ params }) {
  return <News />;
}
