import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../../src/util/meta';
import { SUPPORTED_LANGS } from '../../../../src/util/supported-langs';
const ProductDetails = dynamic(() => import('../../../../src/components/Products/ProductDetails'), { ssr: false });

const FALLBACK_PRODUCT_SLUGS = [
  'amethyst','amethyst-backlit','arabescato','azul-macauba','baltic-brown',
  'beige-onyx','black-aswan','black-platinum-gold','black-river','blue-agate',
  'border-beige-','botccino-classico','breccia-daino-','brown-agate','brown-qusair',
  'calacatta-grey','calacatta-italy','calacatta-viola','cleopatra','coffee-wood',
  'creamy-white-pearl','diana-royal','double-black','egyptian-alabaster',
  'egyptian-alabaster-lightened','embrador-light','embrador-medium','emperador',
  'fantastic-white','fantazia-sunny','fantazia-sylvia','forest-brown','forest-green',
  'galala','galala-extra','gandolla','green-onyx','grey-agate','grey-wood','halayeb',
  'hoody-dark','imperial','indian-onyx','iron-red','jasper','karnak-grey',
  'kashmir-gold','kashmir-white','katrina','labrador-blue-pearl','labrador-emerald-pearl',
  'lady-grey','luise-blue','magic-noir','majestic-white','melly-grey','melly-grey-dark',
  'melly-grey-light','nero-marquina','nero-marquinaa','new-halayeb','ocean-jasper',
  'oriental-white-','panda-white','paradiso','persian-grey','petrified-wood-retro',
  'pietra-grey','red-aswan','red-fersan','rosa-el-nasr','rosa-hoody','royal-red',
  'shiva-gold','silver-grey','silver-wave','star-galaxy','sunny-dark','sunny-light',
  'sunny-white','tiger-eye','tiger-skin','traventine-beige','triesta-beige',
  'triesta-grey','tundra-grey','turkish-cararra','universal-grey','verdi-green',
  'volakas','white-wood','yellow-quartz',
];

export async function generateStaticParams() {
  try {
    const res = await fetch('https://server-withered-wildflower-1595.fly.dev/api/storage/all');
    const json = await res.json();
    const products = (json?.data || []).filter((p) => p.type !== 'Gallery');
    const slugs = products.map((p) =>
      p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    );
    return SUPPORTED_LANGS.flatMap((lang) =>
      slugs.map((productName) => ({ lang, productName }))
    );
  } catch {
    return SUPPORTED_LANGS.flatMap((lang) =>
      FALLBACK_PRODUCT_SLUGS.map((productName) => ({ lang, productName }))
    );
  }
}

export function generateMetadata({ params }) {
  const { lang, productName } = params;
  const displayName = productName
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const titleTemplate = t(lang, 'productDetails.pageTitle', '{{name}} | Wadi Degla');
  const descTemplate = t(lang, 'productDetails.metaDescription', '');
  return {
    title: titleTemplate.replace('{{name}}', displayName),
    description: descTemplate.replace(/\{\{name\}\}/g, displayName).replace(/\{\{type\}\}/g, 'natural stone'),
    alternates: buildAlternates(`/products/${productName}`),
  };
}

export default function ProductDetailsPage({ params }) {
  return <ProductDetails />;
}
