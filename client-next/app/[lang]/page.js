import { t, buildAlternates, buildSocial } from '../../src/util/meta';
import Home from '../../src/components/Home/Home';
import HeroPreload from '../../src/components/HeroPreload';
import { getProducts, productSlug } from '../../src/util/product-slugs';

// Stones of the home "showroom" (same list as the old featured cube), read at build time so
// their names, photos and links are in the static HTML.
const FEATURED = [
  'Creamy White Pearl',
  'Pietra Grey',
  'Sunny Light',
  'Calacatta Italy',
  'Arabescato',
  'Triesta Beige',
  'New Halayeb',
  'Red Aswan',
];

async function featuredStones() {
  const all = (await getProducts()) || [];
  return FEATURED.map((name) => all.find((p) => String(p.name).trim() === name))
    .filter(Boolean)
    .map((p) => {
      const f =
        p.finishes?.find((x) => x.finish === 'Polished') ||
        p.finishes?.find((x) => x.finish === 'Honed') ||
        p.finishes?.[0];
      return f?.link
        ? { name: p.name.trim(), type: p.type, slug: productSlug(p.name), img: f.thumb || f.link }
        : null;
    })
    .filter(Boolean);
}

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
    alternates: buildAlternates('', lang),
    ...buildSocial({ title: pageTitle, description, path: '', lang }),
  };
}

export default async function HomePage({ params }) {
  const featured = await featuredStones();
  return (
    <>
      <HeroPreload page="home" />
      {/* Plain <script>, not next/script: next/script here made every page load the home page's code */}
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Home featured={featured} />
    </>
  );
}
