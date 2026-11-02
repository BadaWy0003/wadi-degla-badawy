// Product URL slugs, shared by the product pages (generateStaticParams) and the sitemap.
// Products live in Firestore and are read from the live API at build time.

// The build reads products from the same server the site uses (staging builds use the
// staging server). Production default if the variable isn't set.
const API_BASE =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'https://server-withered-wildflower-1595.fly.dev';

export const PRODUCTS_API_URL = `${API_BASE}/api/storage/all`;

// Used only if the API can't be reached during the build.
export const FALLBACK_PRODUCT_SLUGS = [
  'amethyst',
  'amethyst-backlit',
  'arabescato',
  'azul-macauba',
  'baltic-brown',
  'beige-onyx',
  'black-aswan',
  'black-platinum-gold',
  'black-river',
  'blue-agate',
  'border-beige-',
  'botccino-classico',
  'breccia-daino-',
  'brown-agate',
  'brown-qusair',
  'calacatta-grey',
  'calacatta-italy',
  'calacatta-viola',
  'cleopatra',
  'coffee-wood',
  'creamy-white-pearl',
  'diana-royal',
  'double-black',
  'egyptian-alabaster',
  'egyptian-alabaster-lightened',
  'embrador-light',
  'embrador-medium',
  'emperador',
  'fantastic-white',
  'fantazia-sunny',
  'fantazia-sylvia',
  'forest-brown',
  'forest-green',
  'galala',
  'galala-extra',
  'gandolla',
  'green-onyx',
  'grey-agate',
  'grey-wood',
  'halayeb',
  'hoody-dark',
  'imperial',
  'indian-onyx',
  'iron-red',
  'jasper',
  'karnak-grey',
  'kashmir-gold',
  'kashmir-white',
  'katrina',
  'labrador-blue-pearl',
  'labrador-emerald-pearl',
  'lady-grey',
  'luise-blue',
  'magic-noir',
  'majestic-white',
  'melly-grey',
  'melly-grey-dark',
  'melly-grey-light',
  'nero-marquina',
  'nero-marquinaa',
  'new-halayeb',
  'ocean-jasper',
  'oriental-white-',
  'panda-white',
  'paradiso',
  'persian-grey',
  'petrified-wood-retro',
  'pietra-grey',
  'red-aswan',
  'red-fersan',
  'rosa-el-nasr',
  'rosa-hoody',
  'royal-red',
  'shiva-gold',
  'silver-grey',
  'silver-wave',
  'star-galaxy',
  'sunny-dark',
  'sunny-light',
  'sunny-white',
  'tiger-eye',
  'tiger-skin',
  'traventine-beige',
  'triesta-beige',
  'triesta-grey',
  'tundra-grey',
  'turkish-cararra',
  'universal-grey',
  'verdi-green',
  'volakas',
  'white-wood',
  'yellow-quartz',
];

export const productSlug = (name) =>
  String(name)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

let warnedApiDown = false;

// All products (no gallery items) from the live API, or null if it can't be reached.
// Next.js caches this fetch during the build, so ~1,100 pages share one request.
export async function getProducts() {
  try {
    const res = await fetch(PRODUCTS_API_URL);
    const json = await res.json();
    return (json?.data || []).filter((p) => p.type !== 'Gallery');
  } catch (e) {
    // Never fail silently: without the API, product pages fall back to the slug list
    // below and are built WITHOUT their content. Printed once per build process.
    if (!warnedApiDown) {
      warnedApiDown = true;
      console.warn(
        `[product-slugs] Products API unreachable at build time (${e?.cause?.code || e?.message}); ` +
          'using FALLBACK_PRODUCT_SLUGS, product pages will have no content in their HTML.',
      );
    }
    return null;
  }
}

export async function getProductSlugs() {
  const products = await getProducts();
  return products ? products.map((p) => productSlug(p.name)) : FALLBACK_PRODUCT_SLUGS;
}

// The product for a URL slug (first match, like the product page), or null.
export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products?.find((p) => productSlug(p.name) === slug) || null;
}

export const GALLERY_API_URL = `${API_BASE}/api/storage/type/Gallery`;

// Gallery photos from the live API (same endpoint and order as the gallery page uses in the
// browser), or [] if it can't be reached at build time (the page then loads them in the browser).
export async function getGalleryItems() {
  try {
    const res = await fetch(GALLERY_API_URL);
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (e) {
    console.warn(
      `[product-slugs] Gallery API unreachable at build time (${e?.cause?.code || e?.message}).`,
    );
    return [];
  }
}
