import { t, buildAlternates, buildSocial } from '../../src/util/meta';
import {
  FEATURED_DEFAULT_NAMES,
  FEATURED_IDS,
  HERO_CHANGED,
  HOME_PHOTOS,
} from '../../src/components/Home/homeData';
import Home from '../../src/components/Home/Home';
import HeroPreload from '../../src/components/HeroPreload';
import { getProducts, productSlug } from '../../src/util/product-slugs';

// Stones of the home "showroom" (chosen in the admin panel, else the website's own list), read
// at build time so their names, photos and links are in the static HTML.
async function featuredStones() {
  const all = (await getProducts()) || [];
  const chosen = FEATURED_IDS
    ? FEATURED_IDS.map((id) => all.find((p) => String(p.id) === String(id)))
    : FEATURED_DEFAULT_NAMES.map((name) => all.find((p) => String(p.name).trim() === name));
  return chosen
    .filter(Boolean)
    .map((p) => {
      // the Honed photo (owner, 2026-11-27), else Polished, else any stone photo (not a room)
      const is = (name) => (x) => String(x?.finish || '').trim().toLowerCase() === name;
      const f =
        p.finishes?.find(is('honed')) ||
        p.finishes?.find(is('polished')) ||
        p.finishes?.find((x) => x?.link && !/mockup/i.test(x.finish || ''));
      return f?.link
        ? { name: p.name.trim(), type: p.type, slug: productSlug(p.name), img: f.thumb || f.link }
        : null;
    })
    .filter(Boolean);
}

// FAQPage data = the questions and answers shown on the page, in the page's language (Google
// wants them to match; the client edits them in the admin panel).
const faqSchema = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [1, 2, 3, 4, 5].map((n) => ({
    '@type': 'Question',
    name: t(lang, `home.faqQ${n}`),
    acceptedAnswer: { '@type': 'Answer', text: t(lang, `home.faqA${n}`) },
  })),
});

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function HomePage(props) {
  const params = await props.params;
  const { lang } = params;
  const featured = await featuredStones();
  return (
    <>
      {HERO_CHANGED ? (
        <HeroPreload src={HOME_PHOTOS.heroDesktop.src} phone={HOME_PHOTOS.heroPhone.src} />
      ) : (
        <HeroPreload page="home" />
      )}
      {/* Plain <script>, not next/script: next/script here made every page load the home page's code */}
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(lang)) }}
      />
      <Home featured={featured} />
    </>
  );
}
