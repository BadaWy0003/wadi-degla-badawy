import { t, buildAlternates } from '../../../src/util/meta';
import Quote from '../../../src/components/Quote/Quote';

// The visitor's own quote list (kept in their browser): not for Google, and not in the sitemap.
export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  return {
    title: t(lang, 'quote.pageTitle', 'Your quote list | Wadi Degla'),
    description: t(lang, 'quote.metaDescription', ''),
    alternates: buildAlternates('/quote', lang),
    robots: { index: false, follow: true },
  };
}

export default function QuotePage() {
  return <Quote />;
}
