import { t, buildAlternates } from '../../../src/components/../util/meta';
import Contact from '../../../src/components/Contact/Contact';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'contact.title', 'Contact | Wadi Degla'),
    description: t(lang, 'contact.metaDescription', ''),
    alternates: buildAlternates('/contact', lang),
  };
}

export default function ContactPage({ params }) {
  return <Contact />;
}
