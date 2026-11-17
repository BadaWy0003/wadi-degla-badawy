// /en/content-defaults.json and /ar/content-defaults.json: the website's OWN texts and values,
// before the client's admin-panel changes. The admin panel (through the server) shows them as
// each field's "original" and uses them for "Reset to original". Rebuilt with every deploy,
// so they always match the code. English and Arabic only (the languages the client edits).
import en from '../../../translations/en.json';
import ar from '../../../translations/ar.json';
import { COMPANY_DEFAULTS } from '../../../src/util/company';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export function GET(request, { params }) {
  const texts = params.lang === 'ar' ? ar : en;
  return Response.json({ texts, data: { company: COMPANY_DEFAULTS } });
}
