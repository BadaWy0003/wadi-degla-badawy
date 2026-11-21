// Stone catalogue PDF (2026-11-21): every stone on the website in one A4 PDF, English or
// Arabic, made from the admin panel's data (materials + product_details), so it is always
// current. GET /api/storage/catalogue?lang=en|ar (the products page links to it).
// Cover page, then one section per category (website order, A-Z, Emperador first like the
// products page), 6 stone cards per page: photo, name, colour, origin, finishes and the
// stone's web address. Kept privately in Storage at catalogue/catalogue-<lang>.pdf with a key
// of the data it was made from, like the spec sheets (spec-sheet.service.js, whose Chromium,
// fonts and labels it shares). Made again after any stone change at the first download, and
// by the warm-up after each server start.

const crypto = require('crypto');
const { db, bucket } = require('../start/firebase');
const { col, storagePath } = require('../start/data-area');
const SpecSheet = require('./spec-sheet.service');

const { L, CONTACT, ROOM_FINISHES, STONE_CATEGORIES, SITE, esc, cleanType, slugOf, embed, assets, render } = SpecSheet.shared;
const LAYOUT_VERSION = 1;
const LANGS = ['en', 'ar'];
const FIRST = ['Emperador'];

const T = {
  en: {
    title: 'Stone catalogue',
    lead: 'Egyptian marble, granite & limestone, and imported stones — exported worldwide since 1980.',
    stones: (n) => `${n} stones`,
    categories: (n) => `${n} categories`,
    finishes: 'Finishes',
    contact: 'Ask for a price or a free sample',
    note: 'Natural stone: colour and veining vary from block to block. Photos show a typical piece. This catalogue is made from our website and always shows the current range.',
    cats: {
      'Egyptian Marble': 'Egyptian Marble',
      'Egyptian Limestone': 'Egyptian Limestone',
      'Egyptian Granite': 'Egyptian Granite',
      'Imported Marble': 'Imported Marble',
      'Imported Granite': 'Imported Granite',
    },
  },
  ar: {
    title: 'كتالوج الأحجار',
    lead: 'رخام وجرانيت وحجر جيري مصري وأحجار مستوردة — نصدّرها إلى العالم منذ 1980.',
    stones: (n) => `عدد الأحجار: ${n}`,
    categories: (n) => `الفئات: ${n}`,
    finishes: 'التشطيبات',
    contact: 'اطلب سعرًا أو عينة مجانية',
    note: 'حجر طبيعي: يختلف اللون والعروق من بلوك لآخر، والصور لقطعة نموذجية. هذا الكتالوج مأخوذ من موقعنا ويعرض دائمًا المجموعة الحالية.',
    cats: L.ar.categories,
  },
};

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

async function loadAll() {
  const [mats, dets, company] = await Promise.all([
    db.collection(col('materials')).get(),
    db.collection(col('product_details')).get(),
    db.collection(col('site_content')).doc('company').get(),
  ]);
  const details = Object.fromEntries(dets.docs.map((d) => [d.id, d.data()]));
  const stones = mats.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((s) => s.hidden !== true && s.name && Array.isArray(s.finishes))
    .map((s) => ({ id: s.id, name: String(s.name).trim(), type: cleanType(s.type), finishes: s.finishes }))
    .filter((s) => STONE_CATEGORIES.includes(s.type));
  const order = (a, b) => {
    const fa = FIRST.indexOf(a.name);
    const fb = FIRST.indexOf(b.name);
    if (fa !== fb) return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb);
    return a.name.localeCompare(b.name);
  };
  stones.sort((a, b) => STONE_CATEGORIES.indexOf(a.type) - STONE_CATEGORIES.indexOf(b.type) || order(a, b));
  return { stones, details, contact: { ...CONTACT, ...(company.exists ? company.data()?.data || {} : {}) } };
}

const cardPhoto = (s) => {
  const f = s.finishes.filter((x) => x?.link && !ROOM_FINISHES.includes(x.finish));
  return f.find((x) => x.finish === 'Honed') || f.find((x) => x.finish === 'Polished') || f[0];
};

async function buildHtml({ stones, details, contact }, lang) {
  const t = T[lang];
  const w = L[lang];
  const pick = (v) => (typeof v === 'object' && v ? (lang === 'ar' && v.ar) || v.en || '' : '');
  const finishName = (n) => (lang === 'ar' && w.finishNames[String(n).toLowerCase()]) || n;
  const photos = [];
  // a few at a time: the server is small
  for (let i = 0; i < stones.length; i += 6) {
    // eslint-disable-next-line no-await-in-loop
    photos.push(
      ...(await Promise.all(stones.slice(i, i + 6).map((s) => embed(cardPhoto(s)?.thumb || cardPhoto(s)?.link, 640, 420)))),
    );
  }
  const a = assets();
  const groups = STONE_CATEGORIES.map((c) => ({
    c,
    items: stones.map((s, i) => ({ s, photo: photos[i] })).filter((x) => x.s.type === c),
  })).filter((g) => g.items.length);
  const cover = photos.filter(Boolean).slice(0, 6);
  const card = ({ s, photo }) => {
    const d = details[s.id] || {};
    const fins = s.finishes.filter((x) => x?.link && !ROOM_FINISHES.includes(x.finish)).map((x) => finishName(x.finish));
    const rows = [
      [w.colour, pick(d.colour)],
      [w.origin, pick(d.origin)],
      [t.finishes, fins.slice(0, 5).join(' · ') + (fins.length > 5 ? ' …' : '')],
    ].filter(([, v]) => v);
    return `<div class="card">${photo ? `<img src="${photo}" alt="">` : '<div class="nophoto"></div>'}
<h3 dir="auto">${esc(s.name)}</h3>
<table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td dir="auto">${esc(v)}</td></tr>`).join('')}</table>
<p class="url">wadidegla-eg.com/${lang}/products/${slugOf(s.name)}/</p></div>`;
  };
  return `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
@font-face{font-family:Cairo;src:url(${a.regular}) format('woff2');font-weight:400}
@font-face{font-family:Cairo;src:url(${a.bold}) format('woff2');font-weight:700}
@page{size:A4;margin:12mm 12mm 14mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Cairo,sans-serif;color:#1d1a16;font-size:9.5pt;line-height:1.4}
.cover{height:271mm;background:#14110d;color:#f3eee6;border-radius:4mm;padding:16mm 14mm;display:flex;flex-direction:column;break-after:page}
.cover img.logo{height:16mm;filter:brightness(0) invert(1);align-self:flex-start}
.cover h1{font-size:34pt;line-height:1.1;margin-top:22mm}
.cover .lead{color:#d6d0c6;font-size:13pt;margin-top:5mm;max-width:150mm}
.cover .facts{color:#cdb48b;font-size:11pt;margin-top:6mm;letter-spacing:.04em}
.mosaic{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin-top:auto}
.mosaic img{width:100%;height:42mm;object-fit:cover;border-radius:2mm}
.cover .contact{margin-top:8mm;color:#d6d0c6;font-size:10pt}
.cover .contact b{color:#f3eee6}
.cat{break-before:page}
.cat:first-of-type{break-before:auto}
h2{font-size:17pt;border-bottom:.6mm solid #cdb48b;padding-bottom:2mm;margin-bottom:5mm;display:flex;justify-content:space-between;align-items:baseline}
h2 span{font-size:10pt;color:#8c7553;font-weight:400}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm 7mm}
.card{break-inside:avoid;border:.3mm solid #e6dfd3;border-radius:3mm;padding:3mm;height:79mm;overflow:hidden}
.card img,.nophoto{width:100%;height:42mm;object-fit:cover;border-radius:2mm;background:#eee;display:block}
.card h3{font-size:12pt;margin:2mm 0 1mm}
.card table{width:100%;border-collapse:collapse;font-size:8.5pt}
.card td{padding:.5mm 0;vertical-align:top}
.card td:first-child{color:#8c7553;width:32%;padding-inline-end:2mm}
.url{color:#8c7553;font-size:7.5pt;margin-top:1mm;direction:ltr;text-align:start}
.end{break-before:page;padding-top:20mm}
.end h2{border:0}
.end p{font-size:11pt;margin-bottom:3mm}
.small{color:#6b645a;font-size:9pt;margin-top:8mm}
</style></head><body>
<section class="cover"><img class="logo" src="${a.logo}" alt="Wadi Degla">
<h1>${esc(t.title)}</h1><p class="lead">${esc(t.lead)}</p>
<p class="facts">${esc(t.stones(stones.length))} · ${esc(t.categories(groups.length))} · ${new Date().getFullYear()}</p>
<div class="mosaic">${cover.map((p) => `<img src="${p}" alt="">`).join('')}</div>
<p class="contact"><b>${esc(t.contact)}</b><br><span dir="ltr">${esc(contact.mainPhone)} · ${esc(contact.emailExport)} · wadidegla-eg.com</span></p></section>
${groups.map((g) => `<section class="cat"><h2>${esc((lang === 'ar' && t.cats[g.c]) || g.c)}<span>${esc(t.stones(g.items.length))}</span></h2><div class="grid">${g.items.map(card).join('')}</div></section>`).join('\n')}
<section class="end"><h2>${esc(t.contact)}</h2>
<p dir="ltr">${esc(contact.mainPhone)} · ${esc(contact.emailExport)}</p><p dir="ltr">${SITE}/${lang}/products/</p>
<p>${esc(w.address)}</p><p class="small">${esc(w.company)}<br>${esc(t.note)}</p></section>
</body></html>`;
}

const making = new Map();
const Catalogue = { LANGS };

Catalogue.get = async (langAsked) => {
  const lang = LANGS.includes(langAsked) ? langAsked : 'en';
  const data = await loadAll();
  if (!data.stones.length) throw httpError(404, 'No stones yet.');
  const key = crypto
    .createHash('sha1')
    .update(
      JSON.stringify([
        LAYOUT_VERSION,
        data.stones.map((s) => [s.id, s.name, s.type, s.finishes.map((f) => [f.finish, f.link, f.thumb])]),
        data.stones.map((s) => [data.details[s.id]?.colour, data.details[s.id]?.origin]),
        data.contact.mainPhone,
        data.contact.emailExport,
        new Date().getFullYear(),
      ]),
    )
    .digest('hex');
  const fileName = `wadi-degla-stone-catalogue${lang === 'ar' ? '-ar' : ''}.pdf`;
  const file = bucket.file(storagePath(`catalogue/catalogue-${lang}.pdf`));
  try {
    const [meta] = await file.getMetadata();
    if (meta?.metadata?.key === key) {
      const [buffer] = await file.download();
      return { buffer, fileName, made: false };
    }
  } catch {
    // not made yet
  }
  const jobKey = `${lang}-${key}`;
  if (!making.has(jobKey)) {
    making.set(
      jobKey,
      (async () => {
        const buffer = Buffer.from(await render(await buildHtml(data, lang), { footer: true }));
        await file
          .save(buffer, { contentType: 'application/pdf', resumable: false, metadata: { metadata: { key } } })
          .catch((e) => console.warn('Catalogue not kept:', e.message));
        return buffer;
      })().finally(() => making.delete(jobKey)),
    );
  }
  return { buffer: await making.get(jobKey), fileName, made: true };
};

Catalogue.warmUp = async () => {
  for (const lang of LANGS) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const r = await Catalogue.get(lang);
      if (r.made) console.log(`[catalogue] ${lang} made (${Math.round(r.buffer.length / 1024)} KB)`);
    } catch (e) {
      console.error(`[catalogue] ${lang} failed:`, e.message);
    }
  }
};

Catalogue.buildHtml = buildHtml; // for local previews
Catalogue.loadAll = loadAll;
module.exports = Catalogue;
