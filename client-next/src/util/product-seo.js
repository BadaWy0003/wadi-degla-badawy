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

// Search results show about 60 characters of a title.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

// "Galala Marble – Egyptian Supplier, Slabs & Tiles | Wadi Degla". When that is longer than
// 60 characters, words are dropped in this order until it fits: "& Tiles", "Slabs",
// "Egyptian Supplier", the brand.
export function productTitle(lang, product) {
  const heading = productHeading(lang, product);
  const k = (key) => t(lang, `productDetails.${key}`);
  const brand = k('titleBrand');
  const options = [
    `${heading} – ${k('titleSupplierSlabsTiles')} | ${brand}`,
    `${heading} – ${k('titleSupplierSlabs')} | ${brand}`,
    `${heading} – ${k('titleSupplier')} | ${brand}`,
    `${heading} | ${brand}`,
  ];
  return options.find((o) => o.length <= TITLE_MAX) || heading;
}

const SENTENCE = /[^.!?。！？]+[.!?。！？]+/g;
const firstSentence = (text) => {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return ((clean.match(SENTENCE) || [clean])[0] || '').trim();
};

// A sentence that fits in `max` characters (full stop included), or '' when it doesn't:
// the whole sentence, else the part before a colon or dash when that part is a clause of
// its own ("Galala is the best-known Egyptian marble: a cream-beige…"). Never a word cut.
function fitSentence(sentence, max, stop = '.') {
  const body = String(sentence || '')
    .replace(/[.!?。！？]+$/, '')
    .trim();
  if (!body || max < 2) return '';
  if (body.length + 1 <= max) return body + stop;
  const breaks = [...body.slice(0, max - 1).matchAll(/\s*[:：–—]\s/g)].map((m) => m.index);
  const at = breaks.filter((b) => b > 12).pop();
  return at ? body.slice(0, at).trim() + stop : '';
}

// Korean and Japanese need a polite ending after the short sentence below.
const SENTENCE_END = { ko: '입니다', ja: 'です' };

// "Halayeb Granite is a natural stone quarried in Egypt": the start of the generated intro
// (productDetails.introEgyptian / introImported, all 12 languages), up to "({{type}})".
function shortIdentity(lang, product) {
  const key = isImported(product.type)
    ? 'productDetails.introImported'
    : 'productDetails.introEgyptian';
  const template = t(lang, key);
  const at = Math.max(template.indexOf('({{type}})'), template.indexOf('（{{type}}）'));
  if (at <= 0) return '';
  return (
    fill(template.slice(0, at), { heading: productHeading(lang, product) }).trim() +
    (SENTENCE_END[lang] || '')
  );
}

// The first other name that adds something (not just the stone's own name, e.g. "Galala
// Marble" for Galala), for "(also called Halaib)".
function alsoCalledName(product, details) {
  const name = String(product?.name || '').trim().toLowerCase();
  return (details?.otherNames || []).find((n) => n && !n.toLowerCase().includes(name)) || '';
}

// Product meta description (max 155 characters): what the stone is, the first useful other
// name, then "Exported worldwide since 1980. Free samples and quotes on request."
// "What the stone is": the first sentence of its own description in this language when it
// fits (or its clause before a colon/dash), else the short generated sentence ("Halayeb
// Granite is a natural stone quarried in Egypt"). Only if even that is too long is the other
// name left out. Sentences are never cut in the middle.
// "Slabs and tiles, 2/3 cm thick.": what the buyer can order, from the stone details (forms
// and thicknesses). Only for the two usual form sets, and only when a thickness is written.
function offerSentence(lang, details) {
  const forms = details?.forms || [];
  const thickness = String(details?.thicknesses || '')
    .split(/[,;/]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .join('/');
  const has = (f) => forms.includes(f);
  const key =
    has('slabs') && has('tiles')
      ? has('blocks')
        ? 'productDetails.metaFormsAll'
        : 'productDetails.metaFormsSlabsTiles'
      : '';
  if (!key || !thickness) return '';
  return fill(t(lang, 'productDetails.metaOffer'), { forms: t(lang, key), thickness });
}

export function productMetaDescription(lang, product, details) {
  // Japanese and Chinese sentences end with 。 and follow each other without a space.
  const cjk = lang === 'ja' || lang === 'zh';
  const stop = cjk ? '。' : '.';
  const gap = cjk ? '' : ' ';
  const tail = t(lang, 'productDetails.metaTail');
  const other = alsoCalledName(product, details);
  const also = other ? fill(t(lang, 'productDetails.metaAlsoCalled'), { name: other }) : '';
  const own = firstSentence(details?.description?.[lang]);
  const identity = shortIdentity(lang, product);
  const offer = offerSentence(lang, details);

  // In longer languages (e.g. French) the stone's sentence and the whole tail may not fit
  // together: then only the tail's first sentence ("Exported worldwide since 1980.") is kept,
  // rather than leaving the stone out.
  const parts = tail.split(stop).map((x) => x.trim());
  const shortTail = parts[0] + stop;
  // "Free samples and quotes on request.": the tail without its first sentence.
  const restTail = parts.slice(1).filter(Boolean).join(stop + gap) + (parts.length > 1 ? stop : '');
  const build = (withAlso, end, sentenceOf) => {
    const extra = withAlso && also ? `${/^[(]/.test(also) ? ' ' : ''}${also}` : '';
    const room = DESCRIPTION_MAX - end.length - gap.length - extra.length;
    const sentence = sentenceOf(room);
    return sentence ? `${sentence.slice(0, -1)}${extra}${stop}${gap}${end}` : '';
  };
  const ownFit = (room) => fitSentence(own, room, stop);
  const identityFit = (room) => fitSentence(identity, room, stop);
  // Endings, best first: the offer ("Slabs and tiles, 2/3 cm thick.") with the whole tail,
  // with its second sentence ("Free samples and quotes on request."), with its first; then
  // the tail alone, then its first sentence (as before 2026-11-21, when there is no offer).
  const ends = [
    ...(offer ? [tail, restTail, shortTail].map((e) => `${offer}${gap}${e}`) : []),
    tail,
    shortTail,
  ].filter((e, i, a) => a.indexOf(e) === i);
  // The stone's own sentence comes first, so it is kept even when the offer must go; the
  // generated sentence ("Halayeb Granite is a natural stone quarried in Egypt") after it.
  for (const sentenceOf of [ownFit, identityFit]) {
    for (const end of ends) {
      const out = build(true, end, sentenceOf) || build(false, end, sentenceOf);
      if (out) return out;
    }
  }
  return tail;
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
