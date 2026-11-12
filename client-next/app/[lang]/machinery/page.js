import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Machinery from '../../../src/components/Machinery/Machinery';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'machinery.pageTitle', 'Machinery | Wadi Degla');
  const description = t(lang, 'machinery.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/machinery', lang),
    ...buildSocial({ title, description, path: '/machinery', lang }),
  };
}

export default function MachineryPage({ params }) {
  return (
    <Machinery>
      <RelatedPages lang={params.lang} page="machinery" />
    </Machinery>
  );
}
