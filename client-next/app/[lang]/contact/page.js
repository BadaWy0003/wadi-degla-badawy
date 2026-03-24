import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Contact = dynamic(() => import('../../../src/components/Contact/Contact'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'contact.title', 'Contact | Wadi Degla'),
    description: t(lang, 'contact.metaDescription', ''),
    alternates: buildAlternates('/contact'),
  };
}

export default function ContactPage({ params }) {
  return <Contact />;
}
