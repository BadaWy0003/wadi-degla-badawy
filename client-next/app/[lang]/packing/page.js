import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Packing from '../../../src/components/Packing/Packing';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'packing.pageTitle', 'Packing | Wadi Degla');
  const description = t(lang, 'packing.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/packing', lang),
    ...buildSocial({ title, description, path: '/packing', lang }),
  };
}

export default function PackingPage({ params }) {
  return (
    <>
      <Packing />
      <RelatedPages lang={params.lang} page="packing" />
    </>
  );
}
