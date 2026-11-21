import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Packing from '../../../src/components/Packing/Packing';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function PackingPage(props) {
  const params = await props.params;
  return (
    <Packing>
      <RelatedPages lang={params.lang} page="packing" />
    </Packing>
  );
}
