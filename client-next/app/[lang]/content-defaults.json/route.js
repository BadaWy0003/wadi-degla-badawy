// /en/content-defaults.json and /ar/content-defaults.json: the website's OWN texts and values,
// before the client's admin-panel changes. The admin panel (through the server) shows them as
// each field's "original" and uses them for "Reset to original". Rebuilt with every deploy,
// so they always match the code. English and Arabic only (the languages the client edits).
import en from '../../../translations/en.json';
import ar from '../../../translations/ar.json';
import { COMPANY_DEFAULTS } from '../../../src/util/company';
import { CERTIFICATES_DEFAULTS } from '../../../src/components/Certificates/certificateDocs';
import { fairsForAdmin } from '../../../src/components/Fairs/FairsData';
import { partnersForAdmin } from '../../../src/components/Partners/PartnersData';
import {
  FEATURED_DEFAULT_NAMES,
  HOME_PHOTOS_DEFAULTS,
} from '../../../src/components/Home/homeData';
import { countsForAdmin } from '../../../src/components/Machinery/machineryCounts';
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

export async function GET(request, { params }) {
  const texts = params.lang === 'ar' ? ar : en;
  // the home page's featured stones are saved as product ids
  const products = (await getProducts()) || [];
  const featured = FEATURED_DEFAULT_NAMES.map(
    (name) => products.find((p) => String(p.name).trim() === name)?.id,
  ).filter(Boolean);
  return Response.json({
    texts,
    data: {
      company: COMPANY_DEFAULTS,
      machinery: countsForAdmin(),
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
