import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import StoneCreation from '../../../src/components/StoneCreation/StoneCreation';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'stoneCreation.pageTitle', 'StoneCreation | Wadi Degla');
  const description = t(lang, 'stoneCreation.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/stone-creations', lang),
    ...buildSocial({ title, description, path: '/stone-creations', lang }),
  };
}

export default async function StoneCreationPage(props) {
  const params = await props.params;
  return <StoneCreation />;
}
