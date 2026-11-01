import { t, buildAlternates } from '../../../src/components/../util/meta';
import News from '../../../src/components/News/News';

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
