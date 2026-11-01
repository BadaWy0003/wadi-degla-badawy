// Product URL slugs, shared by the product pages (generateStaticParams) and the sitemap.
// Products live in Firestore and are read from the live API at build time.

export const PRODUCTS_API_URL = 'https://server-withered-wildflower-1595.fly.dev/api/storage/all';

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

export async function getProductSlugs() {
  try {
    const res = await fetch(PRODUCTS_API_URL);
    const json = await res.json();
    const products = (json?.data || []).filter((p) => p.type !== 'Gallery');
    return products.map((p) => productSlug(p.name));
  } catch {
    return FALLBACK_PRODUCT_SLUGS;
  }
}
