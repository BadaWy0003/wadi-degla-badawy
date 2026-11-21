import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Kerbstone from '../../../src/components/Kerbstone/Kerbstone';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'kerbstone.pageTitle', 'Kerbstone | Wadi Degla');
  const description = t(lang, 'kerbstone.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/kerbstone', lang),
    ...buildSocial({ title, description, path: '/kerbstone', lang }),
  };
}

export default async function KerbstonePage(props) {
  const params = await props.params;
  return (
    <Kerbstone>
      <RelatedPages lang={params.lang} page="kerbstone" />
    </Kerbstone>
  );
}
