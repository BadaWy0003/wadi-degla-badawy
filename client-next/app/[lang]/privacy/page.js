import { buildAlternates, buildSocial } from '../../../src/util/meta';
import Privacy from '../../../src/components/Privacy/Privacy';
import { PRIVACY } from '../../../src/components/Privacy/privacyTexts';

// Written in English and Arabic only: the other languages show English and are noindex.
const WRITTEN = Object.keys(PRIVACY);

export async function generateMetadata(props) {
  const { lang } = await props.params;
  const x = PRIVACY[lang] || PRIVACY.en;
  const title = `${x.title} | Wadi Degla`;
  const description = x.intro.slice(0, 155);
  return {
    title,
    description,
    alternates: buildAlternates('/privacy', lang, WRITTEN),
    ...buildSocial({ title, description, path: '/privacy', lang }),
    ...(WRITTEN.includes(lang) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function PrivacyPage(props) {
  const { lang } = await props.params;
  return <Privacy lang={lang} />;
}
