// /en/content-defaults.json and /ar/content-defaults.json: the website's OWN texts and values,
// before the client's admin-panel changes. The admin panel (through the server) shows them as
// each field's "original" and uses them for "Reset to original". Rebuilt with every deploy,
// so they always match the code. English and Arabic only (the languages the client edits).
import en from '../../../translations/en.json';
import ar from '../../../translations/ar.json';
import topicsEn from '../../../content/topics/en.json';
import topicsAr from '../../../content/topics/ar.json';
import { COMPANY_DEFAULTS } from '../../../src/util/company';
import { CERTIFICATES_DEFAULTS } from '../../../src/components/Certificates/certificateDocs';
import { fairsForAdmin } from '../../../src/components/Fairs/FairsData';
import { partnersForAdmin } from '../../../src/components/Partners/PartnersData';
import {
  FEATURED_DEFAULT_NAMES,
  HOME_PHOTOS_DEFAULTS,
} from '../../../src/components/Home/homeData';
import { countsForAdmin } from '../../../src/components/Machinery/machineryCounts';
import { TOPIC_PAGES } from '../../../src/util/topic-pages';
import { QUARRY_PHOTOS_DEFAULTS } from '../../../src/components/Quarries/quarriesPhotos';
import { photoWithSize } from '../../../src/util/image-size';
import { MACHINERY_PHOTOS_DEFAULTS } from '../../../src/components/Machinery/machineryPhotos';
import { PACKING_PHOTOS_DEFAULTS } from '../../../src/components/Packing/packingPhotos';
import { EXPORTS_PHOTOS_DEFAULTS } from '../../../src/components/Exports/exportsPhotos';
import { HISTORY_PHOTOS_DEFAULTS } from '../../../src/components/History/historyPhotos';
import { INSPIRATION_PHOTOS_DEFAULTS } from '../../../src/components/Inspiration/inspirationPhotos';
import { COBBLE_PHOTOS_DEFAULTS } from '../../../src/components/Cobble/cobblePhotos';
import { KERB_PHOTOS_DEFAULTS } from '../../../src/components/Kerbstone/kerbPhotos';
import { STONE_CREATION_PHOTOS_DEFAULTS } from '../../../src/components/StoneCreation/stoneCreationPhotos';
import { getProducts } from '../../../src/util/product-slugs';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

const textOf = (key) => ({
  en: key.split('.').reduce((v, k) => v?.[k], en) || '',
  ar: key.split('.').reduce((v, k) => v?.[k], ar) || '',
});

// Partner logos are shown by CSS size; the admin panel needs a size for each photo.
const LOGO_SIZE = { width: 400, height: 200 };

const patterns = Object.fromEntries([
  ...[1, 2, 3, 4].map((n) => [`paver${n}`, '']),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => [`split${n}`, '']),
]);

// The header photos (pages with a "Header photo" field) and their real sizes.
const H = '/Assets/Media/Hero/';
const HERO_SIZES = {
  'about-hero': [1080, 1080],
  'contact-hero': [1080, 810],
  'cobble-hero': [1080, 718],
  'kerb-hero': [1080, 432],
  'egyptian-marble-hero': [2000, 720],
  'egyptian-limestone-hero': [2000, 720],
  'egyptian-granite-hero': [2000, 720],
  'imported-marble-hero': [2000, 720],
  'imported-granite-hero': [2000, 720],
  'quarries-home': [2000, 1000],
  'buy-guide-hero': [1500, 740],
};
const heroOf = (src) => {
  const [width, height] = HERO_SIZES[src.split('/').pop().replace('.webp', '')] || [1600, 900];
  return { heroPhoto: { src, width, height } };
};
// { name: src | [src] } -> { name: {src,width,height} | [{src,width,height}] } (real sizes)
const asPhotos = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.map(photoWithSize) : photoWithSize(v),
    ]),
  );

const topicHeroes = Object.fromEntries(
  Object.entries(TOPIC_PAGES).map(([key, page]) => [
    `topic_${key}`,
    {
      ...heroOf(page.defaultHero),
      ...Object.fromEntries(
        (page.defaultStepPhotos || []).map((src, i) => [`stepPhoto${i + 1}`, photoWithSize(src)]),
      ),
    },
  ]),
);

export async function GET(request, { params }) {
  // the topic pages' texts are edited as "topics.<path>"
  const texts = params.lang === 'ar' ? { ...ar, topics: topicsAr } : { ...en, topics: topicsEn };
  // the home page's featured stones are saved as product ids
  const products = (await getProducts()) || [];
  const featured = FEATURED_DEFAULT_NAMES.map(
    (name) => products.find((p) => String(p.name).trim() === name)?.id,
  ).filter(Boolean);
  return Response.json({
    texts,
    data: {
      company: COMPANY_DEFAULTS,
      quarries: Object.fromEntries(
        Object.entries(QUARRY_PHOTOS_DEFAULTS).map(([k, list]) => [k, list.map(photoWithSize)]),
      ),
      about: heroOf(`${H}about-hero.webp`),
      contactPage: heroOf(`${H}contact-hero.webp`),
      cobbles: {
        ...heroOf('/Assets/Media/Kerb-and-Cobbles/cobble/cobble-hero.webp'),
        ...asPhotos(COBBLE_PHOTOS_DEFAULTS),
      },
      kerbstone: {
        ...heroOf('/Assets/Media/Kerb-and-Cobbles/kerb/kerb-hero.webp'),
        ...asPhotos(KERB_PHOTOS_DEFAULTS),
      },
      packing: asPhotos(PACKING_PHOTOS_DEFAULTS),
      exports: asPhotos(EXPORTS_PHOTOS_DEFAULTS),
      history: asPhotos(HISTORY_PHOTOS_DEFAULTS),
      inspiration: asPhotos(INSPIRATION_PHOTOS_DEFAULTS),
      stoneCreations: asPhotos(STONE_CREATION_PHOTOS_DEFAULTS),
      ...topicHeroes,
      machinery: {
        ...countsForAdmin(),
        ...Object.fromEntries(
          Object.entries(MACHINERY_PHOTOS_DEFAULTS).map(([k, list]) => [
            k,
            list.map(photoWithSize),
          ]),
        ),
      },
      home: { ...HOME_PHOTOS_DEFAULTS, featured: featured.map(String) },
      certificates: CERTIFICATES_DEFAULTS,
      fairs: { fairs: fairsForAdmin((id) => textOf(`fairs.items.${id}`)) },
      patterns,
      partners: {
        partners: partnersForAdmin(
          (id) => textOf(`partners.stories.${id}`),
          () => LOGO_SIZE,
        ),
      },
    },
  });
}
