// Stone details shown on each product page of the website: description (English, Arabic and
// translations), other trade names, origin, colour, forms, thicknesses, sizes, uses and
// technical data. Edited in the admin panel; the website reads them at build time
// (GET /api/storage/details) and shows changes after "Publish to website".
//
// Stored in their own collection, product_details (doc id = the product's id in
// materials), so the product list the website loads in the browser (GET /api/storage/all)
// doesn't grow with long texts in 12 languages.

const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const SiteMeta = require('./site-meta.service');

const detailsCol = () => db.collection(col('product_details'));
const materialsCol = () => db.collection(col('materials'));

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const LANGS = ['en', 'ar', 'fr', 'es', 'de', 'it', 'ro', 'ko', 'sq', 'ru', 'ja', 'zh'];
// Written in the admin panel; the other 10 languages are translations of the English text.
const EDITED_LANGS = ['en', 'ar'];
const FORMS = ['slabs', 'tiles', 'blocks'];
const USES = ['flooring', 'wallCladding', 'exteriorCladding', 'staircases', 'windowSills', 'countertops', 'landscaping'];
const TECH = ['density', 'waterAbsorption', 'compressiveStrength', 'flexuralStrength'];

const ProductDetailsService = { LANGS, FORMS, USES, TECH };

const text = (v) => String(v ?? '').trim();
const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, text(obj?.[k])]));

const clean = (body, before = {}) => {
  // Description: English and Arabic come from the form. The translations stay only while
  // the English text they were made from is unchanged; if English changes, they are
  // dropped (those languages then show the generated text until re-translated).
  const description = pick(body.description, EDITED_LANGS);
  const translationsGiven = LANGS.some((l) => !EDITED_LANGS.includes(l) && text(body.description?.[l]));
  const sameEnglish = text(before.description?.en) === description.en;
  for (const l of LANGS) {
    if (EDITED_LANGS.includes(l)) continue;
    description[l] = translationsGiven ? text(body.description?.[l]) : sameEnglish ? text(before.description?.[l]) : '';
  }
  const tech = {};
  for (const k of TECH) {
    const v = body.tech?.[k];
    tech[k] = v === '' || v === null || v === undefined ? null : Number(v);
  }
  return {
    description,
    // duplicates ignored whatever the capital letters ("Galala Beige" = "galala beige")
    otherNames: (body.otherNames || [])
      .map(text)
      .filter(Boolean)
      .filter((n, i, all) => all.findIndex((m) => m.toLowerCase() === n.toLowerCase()) === i),
    origin: pick(body.origin, EDITED_LANGS),
    colour: pick(body.colour, EDITED_LANGS),
    forms: FORMS.filter((f) => (body.forms || []).includes(f)),
    thicknesses: text(body.thicknesses),
    sizes: text(body.sizes),
    uses: USES.filter((u) => (body.uses || []).includes(u)),
    tech,
  };
};

const getProduct = async (id) => {
  const doc = await materialsCol().doc(String(id)).get();
  if (!doc.exists || doc.data().type === 'Gallery') throw httpError(404, 'Product not found');
  return { id: doc.id, ...doc.data() };
};

// Public, for the website build: { <productId>: details } for visible products only.
ProductDetailsService.listPublic = async () => {
  const [details, materials] = await Promise.all([detailsCol().get(), materialsCol().get()]);
  const visible = new Set(materials.docs.filter((d) => d.data().hidden !== true && d.data().type !== 'Gallery').map((d) => d.id));
  const out = {};
  for (const d of details.docs) {
    if (!visible.has(d.id)) continue;
    const { updatedAt, updatedBy, ...rest } = d.data();
    out[d.id] = rest;
  }
  return out;
};

ProductDetailsService.get = async (id) => {
  await getProduct(id);
  const doc = await detailsCol().doc(String(id)).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : { id: String(id) };
};

ProductDetailsService.save = async (id, body, by) => {
  const product = await getProduct(id);
  const beforeDoc = await detailsCol().doc(product.id).get();
  const data = { ...clean(body, beforeDoc.exists ? beforeDoc.data() : {}), updatedAt: Date.now(), updatedBy: by || null };
  await detailsCol().doc(product.id).set(data);
  await SiteMeta.markChanged(by);
  return { id: product.id, ...data };
};

// One-time import of the details the client filled in a spreadsheet
// (server/src/data/stone-details-import.json: English description + translations, other
// names, origin, colour, uses). Fills only products that have no details yet, so it never
// overwrites edits made in the admin panel; products that no longer exist are skipped.
ProductDetailsService.importExisting = async (by) => {
  const entries = require('../data/stone-details-import.json');
  const [details, materials] = await Promise.all([detailsCol().get(), materialsCol().get()]);
  const existing = new Set(details.docs.map((d) => d.id));
  const products = new Set(materials.docs.filter((d) => d.data().type !== 'Gallery').map((d) => d.id));
  const now = Date.now();
  const result = { imported: 0, skippedExisting: 0, skippedMissing: 0 };
  const batch = db.batch();
  for (const entry of entries) {
    if (!products.has(entry.id)) {
      result.skippedMissing += 1;
      continue;
    }
    if (existing.has(entry.id)) {
      result.skippedExisting += 1;
      continue;
    }
    batch.set(detailsCol().doc(entry.id), {
      ...clean(entry),
      updatedAt: now,
      updatedBy: by || null,
      importedFrom: 'spreadsheet',
    });
    result.imported += 1;
  }
  if (result.imported) {
    await batch.commit();
    await SiteMeta.markChanged(by);
  }
  return result;
};

// Called when a product is deleted for good.
ProductDetailsService.remove = async (id) => {
  await detailsCol().doc(String(id)).delete();
};

module.exports = ProductDetailsService;
