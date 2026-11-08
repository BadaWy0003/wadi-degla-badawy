import { t, buildAlternates, buildSocial } from '../../../src/components/../util/meta';
import Contact from '../../../src/components/Contact/Contact';
import HeroPreload from '../../../src/components/HeroPreload';

export function generateMetadata({ params }) {
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

export default function ContactPage({ params }) {
  return (
    <>
      <HeroPreload page="contact" />
      <Contact />
    </>
  );
}
