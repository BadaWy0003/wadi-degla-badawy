import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import Fairs from '../../../src/components/Fairs/Fairs';
import { FAQ_KEYS } from '../../../src/components/Fairs/FairsData';
import RelatedPages from '../../../src/components/RelatedPages/RelatedPages';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'fairs.pageTitle', 'Fairs & Exhibitions | Wadi Degla');
  const description = t(lang, 'fairs.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/fairs', lang),
    ...buildSocial({
      title,
      description,
      path: '/fairs',
      lang,
      image: '/Assets/Media/Fairs/marble-izmir.webp',
    }),
  };
}

export default function FairsPage({ params }) {
  const { lang } = params;
  // the questions & answers shown on the page, for Google
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((k) => ({
      '@type': 'Question',
      name: t(lang, `fairs.faq${k}Q`),
      acceptedAnswer: { '@type': 'Answer', text: t(lang, `fairs.faq${k}A`) },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <Fairs>
        <RelatedPages lang={lang} page="fairs" />
      </Fairs>
    </>
  );
}
