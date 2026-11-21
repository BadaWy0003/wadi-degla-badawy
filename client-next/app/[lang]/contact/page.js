import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Contact from '../../../src/components/Contact/Contact';
import HeroPreload from '../../../src/components/HeroPreload';
import { sitePhoto } from '../../../src/util/site-content';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'contact.title', 'Contact | Wadi Degla');
  const description = t(lang, 'contact.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/contact', lang),
    ...buildSocial({ title, description, path: '/contact', lang }),
  };
}

export default async function ContactPage(props) {
  const params = await props.params;
  return (
    <>
      <HeroPreload page="contact" src={sitePhoto('contactPage', 'heroPhoto', undefined)} />
      <Contact />
    </>
  );
}
