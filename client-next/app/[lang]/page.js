import dynamic from 'next/dynamic';
import Script from 'next/script';
import { t, buildAlternates } from '../../src/util/meta';
const Home = dynamic(() => import('../../src/components/Home/Home'), { ssr: false });

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What products does Wadi Degla supply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wadi Degla supplies Egyptian marble (Galala, Silvia, Rosa, Halayeb, Cleopatra), limestone (Shelly), granite (Black Aswan, Red Aswan, Red Fersan), and imported marble and granite — available as slabs, tiles, blocks, cobbles, kerbstones, and custom finishes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Wadi Degla export worldwide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Wadi Degla exports to Europe, North America, GCC (Saudi Arabia, UAE, Kuwait), Africa (Gambia, Senegal, Kenya, Libya), Asia (China, South Korea, Russia), Australia, and worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Wadi Degla support large-scale and mega projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Wadi Degla owns quarries and operates three factories covering over 27,000 m², enabling consistent supply for mega projects, luxury hotels, resorts, and large commercial developments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What stone finishes does Wadi Degla offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wadi Degla offers polished, honed, brushed, flamed, tumbled, bush hammered, antique, leathered, and custom finishes for marble, limestone, and granite products.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I request pricing or samples from Wadi Degla?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can contact Wadi Degla\'s sales team via the Contact page on the website for pricing quotations, technical specifications, and sample requests. We respond to all international inquiries.',
      },
    },
  ],
};

export function generateMetadata({ params }) {
  const { lang } = params;
  const pageTitle = t(lang, 'home.pageTitle', 'Wadi Degla | Egyptian Natural Stone');
  return {
    title: pageTitle,
    description: t(lang, 'home.metaDescription', ''),
    openGraph: { title: pageTitle },
    alternates: buildAlternates(''),
  };
}

export default function HomePage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Home />
    </>
  );
}
