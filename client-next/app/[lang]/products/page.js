import dynamic from 'next/dynamic';
import Script from 'next/script';
import { t, buildAlternates } from '../../../src/components/../util/meta';
const Products = dynamic(() => import('../../../src/components/Products/Products'), { ssr: false });

const BASE = 'https://www.wadidegla-eg.com';

const PRODUCTS = [
  // Egyptian Marble
  { name: 'Galala Marble', slug: 'galala', category: 'Egyptian Marble' },
  { name: 'Galala Extra Marble', slug: 'galala-extra', category: 'Egyptian Marble' },
  { name: 'Silvia Marble', slug: 'silvia', category: 'Egyptian Marble' },
  { name: 'Fantazia Silvia Marble', slug: 'fantazia-sylvia', category: 'Egyptian Marble' },
  { name: 'Rosa El Nasr Marble', slug: 'rosa-el-nasr', category: 'Egyptian Marble' },
  { name: 'Rosa Hoody Marble', slug: 'rosa-hoody', category: 'Egyptian Marble' },
  { name: 'Cleopatra Marble', slug: 'cleopatra', category: 'Egyptian Marble' },
  { name: 'Halayeb Marble', slug: 'halayeb', category: 'Egyptian Marble' },
  { name: 'New Halayeb Marble', slug: 'new-halayeb', category: 'Egyptian Marble' },
  { name: 'Sunny White Marble', slug: 'sunny-white', category: 'Egyptian Marble' },
  { name: 'Sunny Light Marble', slug: 'sunny-light', category: 'Egyptian Marble' },
  { name: 'Sunny Dark Marble', slug: 'sunny-dark', category: 'Egyptian Marble' },
  { name: 'Fantazia Sunny Marble', slug: 'fantazia-sunny', category: 'Egyptian Marble' },
  { name: 'Imperial Marble', slug: 'imperial', category: 'Egyptian Marble' },
  { name: 'Brown Qusair Marble', slug: 'brown-qusair', category: 'Egyptian Marble' },
  { name: 'Karnak Grey Marble', slug: 'karnak-grey', category: 'Egyptian Marble' },
  { name: 'Lady Grey Marble', slug: 'lady-grey', category: 'Egyptian Marble' },
  { name: 'Universal Grey Marble', slug: 'universal-grey', category: 'Egyptian Marble' },
  { name: 'Triesta Beige Marble', slug: 'triesta-beige', category: 'Egyptian Marble' },
  { name: 'Triesta Grey Marble', slug: 'triesta-grey', category: 'Egyptian Marble' },
  { name: 'Hoody Dark Marble', slug: 'hoody-dark', category: 'Egyptian Marble' },
  { name: 'Creamy White Pearl Marble', slug: 'creamy-white-pearl', category: 'Egyptian Marble' },
  { name: 'Egyptian Alabaster', slug: 'egyptian-alabaster', category: 'Egyptian Marble' },
  {
    name: 'Egyptian Alabaster Lightened',
    slug: 'egyptian-alabaster-lightened',
    category: 'Egyptian Marble',
  },
  { name: 'Katrina Marble', slug: 'katrina', category: 'Egyptian Marble' },
  { name: 'Melly Grey Marble', slug: 'melly-grey', category: 'Egyptian Marble' },
  { name: 'Melly Grey Dark Marble', slug: 'melly-grey-dark', category: 'Egyptian Marble' },
  { name: 'Melly Grey Light Marble', slug: 'melly-grey-light', category: 'Egyptian Marble' },
  { name: 'Silver Grey Marble', slug: 'silver-grey', category: 'Egyptian Marble' },
  { name: 'Silver Wave Marble', slug: 'silver-wave', category: 'Egyptian Marble' },
  { name: 'Oriental White Marble', slug: 'oriental-white-', category: 'Egyptian Marble' },
  { name: 'Gandolla Marble', slug: 'gandolla', category: 'Egyptian Marble' },
  // Egyptian Granite
  { name: 'Black Aswan Granite', slug: 'black-aswan', category: 'Egyptian Granite' },
  { name: 'Red Aswan Granite', slug: 'red-aswan', category: 'Egyptian Granite' },
  { name: 'Red Fersan Granite', slug: 'red-fersan', category: 'Egyptian Granite' },
  {
    name: 'Black Platinum Gold Granite',
    slug: 'black-platinum-gold',
    category: 'Egyptian Granite',
  },
  { name: 'Double Black Granite', slug: 'double-black', category: 'Egyptian Granite' },
  { name: 'Iron Red Granite', slug: 'iron-red', category: 'Egyptian Granite' },
  { name: 'Royal Red Granite', slug: 'royal-red', category: 'Egyptian Granite' },
  // Imported Marble
  { name: 'Calacatta Italy Marble', slug: 'calacatta-italy', category: 'Imported Marble' },
  { name: 'Calacatta Grey Marble', slug: 'calacatta-grey', category: 'Imported Marble' },
  { name: 'Calacatta Viola Marble', slug: 'calacatta-viola', category: 'Imported Marble' },
  { name: 'Arabescato Marble', slug: 'arabescato', category: 'Imported Marble' },
  { name: 'Nero Marquina Marble', slug: 'nero-marquina', category: 'Imported Marble' },
  { name: 'Botticino Classico Marble', slug: 'botccino-classico', category: 'Imported Marble' },
  { name: 'Breccia Daino Marble', slug: 'breccia-daino-', category: 'Imported Marble' },
  { name: 'Diana Royal Marble', slug: 'diana-royal', category: 'Imported Marble' },
  { name: 'Travertine Beige', slug: 'traventine-beige', category: 'Imported Marble' },
  { name: 'Volakas Marble', slug: 'volakas', category: 'Imported Marble' },
  { name: 'Panda White Marble', slug: 'panda-white', category: 'Imported Marble' },
  { name: 'Persian Grey Marble', slug: 'persian-grey', category: 'Imported Marble' },
  { name: 'Pietra Grey Marble', slug: 'pietra-grey', category: 'Imported Marble' },
  { name: 'Tundra Grey Marble', slug: 'tundra-grey', category: 'Imported Marble' },
  { name: 'Turkish Carrara Marble', slug: 'turkish-cararra', category: 'Imported Marble' },
  { name: 'Emperador Marble', slug: 'emperador', category: 'Imported Marble' },
  { name: 'Fantastic White Marble', slug: 'fantastic-white', category: 'Imported Marble' },
  { name: 'Majestic White Marble', slug: 'majestic-white', category: 'Imported Marble' },
  { name: 'Forest Brown Marble', slug: 'forest-brown', category: 'Imported Marble' },
  { name: 'Forest Green Marble', slug: 'forest-green', category: 'Imported Marble' },
  { name: 'Verdi Green Marble', slug: 'verdi-green', category: 'Imported Marble' },
  { name: 'Magic Noir Marble', slug: 'magic-noir', category: 'Imported Marble' },
  { name: 'Embrador Light Marble', slug: 'embrador-light', category: 'Imported Marble' },
  { name: 'Embrador Medium Marble', slug: 'embrador-medium', category: 'Imported Marble' },
  { name: 'White Wood Marble', slug: 'white-wood', category: 'Imported Marble' },
  { name: 'Grey Wood Marble', slug: 'grey-wood', category: 'Imported Marble' },
  { name: 'Coffee Wood Marble', slug: 'coffee-wood', category: 'Imported Marble' },
  {
    name: 'Petrified Wood Retro Marble',
    slug: 'petrified-wood-retro',
    category: 'Imported Marble',
  },
  // Imported Granite
  { name: 'Kashmir Gold Granite', slug: 'kashmir-gold', category: 'Imported Granite' },
  { name: 'Kashmir White Granite', slug: 'kashmir-white', category: 'Imported Granite' },
  { name: 'Star Galaxy Granite', slug: 'star-galaxy', category: 'Imported Granite' },
  { name: 'Baltic Brown Granite', slug: 'baltic-brown', category: 'Imported Granite' },
  { name: 'Paradiso Granite', slug: 'paradiso', category: 'Imported Granite' },
  {
    name: 'Labrador Blue Pearl Granite',
    slug: 'labrador-blue-pearl',
    category: 'Imported Granite',
  },
  {
    name: 'Labrador Emerald Pearl Granite',
    slug: 'labrador-emerald-pearl',
    category: 'Imported Granite',
  },
  { name: 'Shiva Gold Granite', slug: 'shiva-gold', category: 'Imported Granite' },
  { name: 'Tiger Skin Granite', slug: 'tiger-skin', category: 'Imported Granite' },
  { name: 'Tiger Eye Granite', slug: 'tiger-eye', category: 'Imported Granite' },
  { name: 'Luise Blue Granite', slug: 'luise-blue', category: 'Imported Granite' },
  { name: 'Azul Macauba Granite', slug: 'azul-macauba', category: 'Imported Granite' },
  // Onyx & Semi-Precious
  { name: 'Beige Onyx', slug: 'beige-onyx', category: 'Imported Marble' },
  { name: 'Green Onyx', slug: 'green-onyx', category: 'Imported Marble' },
  { name: 'Indian Onyx', slug: 'indian-onyx', category: 'Imported Marble' },
  { name: 'Brown Agate', slug: 'brown-agate', category: 'Imported Marble' },
  { name: 'Grey Agate', slug: 'grey-agate', category: 'Imported Marble' },
  { name: 'Blue Agate', slug: 'blue-agate', category: 'Imported Marble' },
  { name: 'Amethyst Stone', slug: 'amethyst', category: 'Imported Marble' },
  { name: 'Yellow Quartz', slug: 'yellow-quartz', category: 'Imported Marble' },
  { name: 'Jasper Stone', slug: 'jasper', category: 'Imported Marble' },
  { name: 'Ocean Jasper', slug: 'ocean-jasper', category: 'Imported Marble' },
];

function buildItemListSchema(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Wadi Degla Natural Stone Products — Egyptian Marble, Granite & Limestone',
    description:
      'Complete catalog of Egyptian marble, Egyptian granite, Egyptian limestone, imported marble, and imported granite available as slabs, tiles, and blocks from Wadi Degla.',
    url: `${BASE}/${lang}/products`,
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      description: `${p.name} — premium ${p.category.toLowerCase()} available as slabs, tiles, and blocks. Exported worldwide by Wadi Degla, Egyptian natural stone supplier.`,
      url: `${BASE}/${lang}/products/${p.slug}`,
    })),
  };
}

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'products.pageTitle', 'Egyptian Marble & Granite | Wadi Degla'),
    description: t(lang, 'products.metaDescription', ''),
    alternates: buildAlternates('/products', lang),
  };
}

export default function ProductsPage({ params }) {
  const lang = params?.lang || 'en';
  return (
    <>
      <Script
        id="products-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema(lang)) }}
      />
      <Products />
    </>
  );
}
