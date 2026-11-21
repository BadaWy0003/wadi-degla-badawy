import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Cobble from '../../../src/components/Cobble/Cobble';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'cobbles.pageTitle', 'Cobble | Wadi Degla');
  const description = t(lang, 'cobbles.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/cobbles', lang),
    ...buildSocial({ title, description, path: '/cobbles', lang }),
  };
}

export default async function CobblePage(props) {
  const params = await props.params;
  return (
    <Cobble>
      <RelatedPages lang={params.lang} page="cobbles" />
    </Cobble>
  );
}
