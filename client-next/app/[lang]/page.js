import { t, buildAlternates } from '../../src/util/meta';
import Home from '../../src/components/Home/Home';
import HeroPreload from '../../src/components/HeroPreload';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What products does Wadi Degla supply?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wadi Degla supplies Egyptian marble (Galala, Sunny, Rosa, Halayeb, Cleopatra), limestone (Shelly), granite (Black Aswan, Red Aswan, Red Fersan), and imported marble and granite — available as slabs, tiles, blocks, cobbles, kerbstones, and custom finishes.',
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
  const description = t(lang, 'home.metaDescription', '');
  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: `https://www.wadidegla-eg.com/${lang}/`,
      siteName: 'Wadi Degla',
      images: [{ url: '/preview.webp' }],
      type: 'website',
    },
    alternates: buildAlternates('', lang),
  };
}

export default function HomePage({ params }) {
  const lang = params?.lang || 'en';
  const pageTitle = t(lang, 'home.pageTitle', 'Wadi Degla | Egyptian Natural Stone');
  return (
    <>
      <HeroPreload page="home" />
      {/* Plain <script>, not next/script: next/script here made every page load the home page's code */}
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="sr-only">{pageTitle}</h1>
      <Home />
    </>
  );
}
