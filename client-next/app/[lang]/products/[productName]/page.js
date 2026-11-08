import { t, buildAlternates, buildSocial } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
import {
  getProducts,
  getProductSlugs,
  getProductBySlug,
  getProductDetailsMap,
} from '../../../../src/util/product-slugs';
import ProductDetails from '../../../../src/components/Products/ProductDetails';
import {
  productDetailsView,
  productHeading,
  productIntro,
  productMetaDescription,
  productTitle,
  productTypeLabel,
  relatedProducts,
} from '../../../../src/util/product-seo';
import { getProjects } from '../../../../src/util/projects-data';

const BASE = 'https://www.wadidegla-eg.com';

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return SUPPORTED_LANGS.flatMap((lang) => slugs.map((productName) => ({ lang, productName })));
}

const slugToName = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export async function generateMetadata({ params }) {
  const { lang, productName } = params;
  const product = await getProductBySlug(productName);
  const displayName = product ? productHeading(lang, product) : slugToName(productName);
  const details = product ? (await getProductDetailsMap())[product.id] : null;
  // "Galala Marble – Egyptian Supplier, Slabs & Tiles | Wadi Degla" (max 60 characters) and
  // "<what the stone is> (also called …). Exported worldwide since 1980. Free samples…"
  // (max 155), both from src/util/product-seo.js.
  const title = product ? productTitle(lang, product) : `${displayName} | Wadi Degla`;
  const description = product
    ? productMetaDescription(lang, product, details)
    : t(lang, 'productDetails.metaDescription', '')
        .replace(/\{\{name\}\}/g, displayName)
        .replace(/\{\{type\}\}/g, 'natural stone');
  // The page's main photo: the Polished finish when there is one, else the first (same rule
  // as ProductDetails); the full-size photo, not the small copy.
  const mainFinish =
    product?.finishes?.find((f) => f.finish === 'Polished') || product?.finishes?.[0];
  return {
    title,
    description,
    alternates: buildAlternates(`/products/${productName}`, lang),
    // Shared links show the stone's main photo.
    ...buildSocial({
      title,
      description,
      path: `/products/${productName}`,
      lang,
      image: mainFinish?.link,
    }),
  };
}

// Home > Products > Galala Marble, for Google's breadcrumb display in results.
const breadcrumbSchema = (lang, slug, heading) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: t(lang, 'productDetails.breadcrumbHome'),
      item: `${BASE}/${lang}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t(lang, 'productDetails.breadcrumbProducts'),
      item: `${BASE}/${lang}/products/`,
    },
    { '@type': 'ListItem', position: 3, name: heading, item: `${BASE}/${lang}/products/${slug}/` },
  ],
});

// The product is fetched at build time so its name, category, photo, finishes, description
// and links are in the static HTML (for Google). ProductDetails still refreshes the product
// from the API in the browser, so photo/finish changes in the admin panel show up without
// a redeploy.
export default async function ProductDetailsPage({ params }) {
  const { lang, productName } = params;
  const product = await getProductBySlug(productName);
  let seo = null;
  if (product) {
    const [all, projects, detailsMap] = await Promise.all([
      getProducts(),
      getProjects(lang),
      getProductDetailsMap(),
    ]);
    const details = productDetailsView(lang, product, detailsMap[product.id]);
    const generated = productIntro(lang, product);
    seo = {
      heading: productHeading(lang, product),
      details,
      // the stone's own description (admin panel) replaces the generated one; the
      // "request a sample" sentence stays
      intro: details?.description?.length ? [...details.description, generated[1]] : generated,
      typeLabel: productTypeLabel(lang, product.type),
      related: relatedProducts(product, all),
      projects: projects
        .filter((p) => p.materials.some((m) => m.id === product.id))
        .map(({ id, name, city, country, thumbnail }) => ({ id, name, city, country, thumbnail })),
    };
  }
  return (
    <>
      {seo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema(lang, productName, seo.heading)),
          }}
        />
      )}
      <ProductDetails initialProduct={product} seo={seo} />
    </>
  );
}
