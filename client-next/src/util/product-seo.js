// Search-friendly texts for a product page, built at build time from the product's real
// data (category, finishes) in the page's language:
//   heading  "Galala Marble" / "رخام Galala" (the stone's name + its kind, so the page
//            matches searches like "galala marble"), used in the <h1> and the <title>
//   intro    a short description: origin, category, available finishes and uses
// plus the related stones (same category) and the projects that used this stone, as
// internal links. Nothing is invented: every fact comes from the admin-panel data.

import { t } from './meta';
import { PRODUCT_TYPE_KEYS } from './product-types';
import { FINISH_KEYS } from './finishes';
import { productSlug } from './product-slugs';

const NOT_FINISHES = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];

const fill = (template, values) =>
  Object.entries(values).reduce((s, [k, v]) => s.split(`{{${k}}}`).join(v), template);

export const isGranite = (type) => /granite/i.test(type || '');
export const isImported = (type) => /imported/i.test(type || '');

export function productTypeLabel(lang, type) {
  return PRODUCT_TYPE_KEYS[type] ? t(lang, PRODUCT_TYPE_KEYS[type]) : type || '';
}

// "Galala Marble" (en), "رخام Galala" (ar)… The kind word is left out when the name
// already contains it (e.g. a product called "Royal Red Granite").
export function productHeading(lang, product) {
  const name = String(product?.name || '').trim();
  const kind = t(
    lang,
    isGranite(product?.type) ? 'productDetails.kindGranite' : 'productDetails.kindMarble',
  );
  const english = isGranite(product?.type) ? 'granite' : 'marble';
  const lower = name.toLowerCase();
  if (lower.includes(english) || lower.includes(kind.toLowerCase())) return name;
  return fill(t(lang, 'productDetails.heading', '{{name}} {{kind}}'), { name, kind });
}

export function productFinishList(lang, product) {
  return (product?.finishes || [])
    .map((f) => f.finish)
    .filter((f) => f && !NOT_FINISHES.includes(f))
    .map((f) => (FINISH_KEYS[f] ? t(lang, FINISH_KEYS[f]) : f))
    .join(', ');
}

export function productTitle(lang, product) {
  return fill(t(lang, 'productDetails.pageTitle'), {
    heading: productHeading(lang, product),
    name: product.name,
    type: productTypeLabel(lang, product.type),
  });
}

export function productIntro(lang, product) {
  const values = {
    heading: productHeading(lang, product),
    name: String(product.name).trim(),
    type: productTypeLabel(lang, product.type),
    finishes: productFinishList(lang, product),
  };
  const key = isImported(product.type)
    ? 'productDetails.introImported'
    : 'productDetails.introEgyptian';
  return [fill(t(lang, key), values), fill(t(lang, 'productDetails.introCta'), values)];
}

const cardFinish = (p) =>
  p.finishes?.find((f) => f.finish === 'Honed') || p.finishes?.find((f) => f.finish === 'Polished');

// Up to 8 other stones of the same category (the ones listed right after this one in
// alphabetical order, wrapping around), each with its card photo.
export function relatedProducts(product, allProducts, max = 8) {
  const slug = productSlug(product.name);
  const same = (allProducts || [])
    .filter((p) => p.type === product.type && productSlug(p.name) !== slug && cardFinish(p))
    .sort((a, b) => a.name.localeCompare(b.name));
  const start = same.findIndex((p) => p.name.localeCompare(product.name) > 0);
  const rotated = start > 0 ? [...same.slice(start), ...same.slice(0, start)] : same;
  return rotated.slice(0, max).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    finishes: [cardFinish(p)],
  }));
}

// ----- Stone details written in the admin panel (description, specs, uses) -----

const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

const FORMS = ['slabs', 'tiles', 'blocks'];
const USES = [
  'flooring',
  'wallCladding',
  'exteriorCladding',
  'staircases',
  'windowSills',
  'countertops',
  'landscaping',
];
const TECH = [
  ['density', 'specDensity', 'kg/m³'],
  ['waterAbsorption', 'specWaterAbsorption', '%'],
  ['compressiveStrength', 'specCompressive', 'MPa'],
  ['flexuralStrength', 'specFlexural', 'MPa'],
];
// Application icons on the product page that match a form or a use.
const ICON_FOR = {
  slabs: 'Slabs',
  blocks: 'Block',
  exteriorCladding: 'Exterior Cladding',
  landscaping: 'Landscaping',
  staircases: 'Staircase',
  wallCladding: 'Wall Cladding',
  windowSills: 'Window Sills',
};

// Origin and colour are written in English and Arabic: Arabic pages use Arabic when given.
const enAr = (lang, field) =>
  (lang === 'ar' && field?.ar?.trim() ? field.ar : field?.en || '').trim();

// What the product page shows from the details, in the page's language. null if nothing.
export function productDetailsView(lang, product, details) {
  if (!details) return null;
  const k = (key) => t(lang, `productDetails.${key}`);
  const description = paragraphs(details.description?.[lang]);
  const specs = [];
  const add = (label, value) => value && specs.push({ label, value });
  add(k('specOrigin'), enAr(lang, details.origin));
  add(k('specColour'), enAr(lang, details.colour));
  add(
    k('specForms'),
    FORMS.filter((f) => details.forms?.includes(f))
      .map((f) => k(`form_${f}`))
      .join(', '),
  );
  add(k('specThickness'), details.thicknesses ? `${details.thicknesses} cm` : '');
  add(k('specSizes'), details.sizes);
  for (const [key, label, unit] of TECH) {
    const v = details.tech?.[key];
    if (typeof v === 'number') add(k(label), `${v.toLocaleString('en-US')} ${unit}`);
  }
  const uses = USES.filter((u) => details.uses?.includes(u));
  const hasFormsOrUses = (details.forms || []).length > 0 || uses.length > 0;
  const view = {
    description,
    otherNames: details.otherNames || [],
    specs,
    uses: uses.map((u) => k(`use_${u}`)),
    // Only the icons that really apply, once forms or uses were filled in; else all of them.
    icons: hasFormsOrUses
      ? [...(details.forms || []), ...uses].map((x) => ICON_FOR[x]).filter(Boolean)
      : null,
  };
  const empty = !description.length && !view.otherNames.length && !specs.length && !uses.length;
  return empty ? null : view;
}
