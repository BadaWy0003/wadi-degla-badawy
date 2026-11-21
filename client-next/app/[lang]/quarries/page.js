import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Quarries from '../../../src/components/Quarries/Quarries';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'quarries.pageTitle', 'Quarries | Wadi Degla');
  const description = t(lang, 'quarries.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/quarries', lang),
    ...buildSocial({ title, description, path: '/quarries', lang }),
  };
}

export default async function QuarriesPage(props) {
  const params = await props.params;
  return (
    <Quarries>
      <RelatedPages lang={params.lang} page="quarries" />
    </Quarries>
  );
}
