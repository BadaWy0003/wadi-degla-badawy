// Spec sheet PDF (Phase 2, 2026-11-20): "Download spec sheet" on every stone page of the
// website opens GET /api/storage/spec-sheet/:id?lang=en|ar (public). One A4 page with the
// stone's photo, finishes, description, specifications, uses, a room photo and the contact
// details, from the admin panel's data (materials + product_details). English or Arabic
// (the languages written in the admin panel); every other website language gets English.
//
// Made with Puppeteer (as the documents) and kept in Storage at spec-sheets/<id>-<lang>.pdf
// (private, sent through the server) with a key of the data it was made from: a stone's
// sheet is made again only after its photos or details change. One sheet is made at a time.
// Like the document templates, the page loads nothing from outside: photos and fonts are
// embedded.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const { db, bucket } = require('../start/firebase');
const { col, storagePath } = require('../start/data-area');

// Change when the layout changes, so every saved sheet is made again.
const LAYOUT_VERSION = 1;
const LANGS = ['en', 'ar'];
const ROOM_FINISHES = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];
const SITE = 'https://www.wadidegla-eg.com';

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// The website's own words (translations/<lang>.json: productDetails.*, visualizer.*, finishes.*).
const L = {
  en: {
    sheet: 'Product specification sheet',
    alsoKnownAs: 'Also known as',
    finishes: 'Available finishes',
    about: 'About the stone',
    specs: 'Specifications',
    origin: 'Origin',
    colour: 'Colour & pattern',
    forms: 'Available as',
    thickness: 'Thicknesses',
    sizes: 'Typical sizes',
    density: 'Density',
    waterAbsorption: 'Water absorption',
    compressiveStrength: 'Compressive strength',
    flexuralStrength: 'Flexural strength',
    uses: 'Uses',
    inSpace: 'In a space',
    contact: 'Get a price or a free sample',
    phone: 'Phone / WhatsApp',
    email: 'Email',
    web: 'Website',
    address: '36, 241D Shaq Al-Thoaban Industrial Area for Marble & Granite, Tourrah, Cairo, Egypt',
    company: 'Wadi Degla Co. · Egyptian marble, granite & limestone since 1980 · ISO 9001:2015',
    note: 'Natural stone: colour and veining vary from block to block. Figures are typical values. Ask for a sample before ordering.',
    forms_: { slabs: 'Slabs', tiles: 'Tiles (cut to size)', blocks: 'Blocks' },
    uses_: {
      flooring: 'Flooring',
      wallCladding: 'Wall cladding',
      exteriorCladding: 'Exterior cladding & facades',
      staircases: 'Staircases',
      windowSills: 'Window sills',
      countertops: 'Countertops',
      landscaping: 'Landscaping & outdoor paving',
    },
  },
  ar: {
    sheet: 'ورقة مواصفات المنتج',
    alsoKnownAs: 'يُعرف أيضًا باسم',
    finishes: 'التشطيبات المتاحة',
    about: 'عن الحجر',
    specs: 'المواصفات',
    origin: 'المنشأ',
    colour: 'اللون والنقشة',
    forms: 'متوفر على شكل',
    thickness: 'السُمك',
    sizes: 'المقاسات المعتادة',
    density: 'الكثافة',
    waterAbsorption: 'امتصاص الماء',
    compressiveStrength: 'مقاومة الضغط',
    flexuralStrength: 'مقاومة الانحناء',
    uses: 'الاستخدامات',
    inSpace: 'في مساحة حقيقية',
    contact: 'اطلب سعرًا أو عينة مجانية',
    phone: 'الهاتف / واتساب',
    email: 'البريد الإلكتروني',
    web: 'الموقع',
    address: '36، 241د منطقة شق الثعبان الصناعية للرخام والجرانيت، طرة، القاهرة، مصر',
    company: 'شركة وادي دجلة · رخام وجرانيت وحجر جيري مصري منذ 1980 · ISO 9001:2015',
    note: 'حجر طبيعي: يختلف اللون والعروق من بلوك لآخر. الأرقام قيم معتادة. اطلب عينة قبل الطلب.',
    forms_: { slabs: 'ألواح', tiles: 'بلاطات (مقصوصة على المقاس)', blocks: 'بلوكات' },
    uses_: {
      flooring: 'الأرضيات',
      wallCladding: 'تكسيات الحوائط',
      exteriorCladding: 'تكسيات الواجهات الخارجية',
      staircases: 'السلالم',
      windowSills: 'أعتاب الشبابيك',
      countertops: 'أسطح المطابخ',
      landscaping: 'تنسيق الحدائق والأرضيات الخارجية',
    },
    categories: {
      'Egyptian Marble': 'رخام مصري',
      'Egyptian Limestone': 'الحجر الجيري المصري',
      'Egyptian Granite': 'جرانيت مصري',
      'Imported Marble': 'رخام مستورد',
      'Imported Granite': 'جرانيت مستورد',
    },
    finishNames: {
      polished: 'مصقول',
      honed: 'مطفي',
      antique: 'أنتيك',
      brushed: 'مفرّش',
      flamed: 'محروق',
      'bush hammered': 'مطرّق',
      leather: 'جلدي',
      rough: 'خشن',
      sandblasted: 'ساند بلاست',
      'split face': 'مشقوق',
    },
  },
};
const TECH = [
  ['density', 'kg/m³'],
  ['waterAbsorption', '%'],
  ['compressiveStrength', 'MPa'],
  ['flexuralStrength', 'MPa'],
];
// Company contact details: the website's, with the client's admin-panel changes (block `company`).
const CONTACT = { mainPhone: '+20 10 6726 0314', emailExport: 'export@wadidegla-eg.com' };

const ASSETS = path.join(__dirname, '../templates/assets');
let staticAssets;
const assets = () => {
  if (!staticAssets) {
    const uri = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(ASSETS, file)).toString('base64')}`;
    staticAssets = {
      logo: uri('logo.svg', 'image/svg+xml'),
      regular: uri('Cairo-Regular.woff2', 'font/woff2'),
      bold: uri('Cairo-Bold.woff2', 'font/woff2'),
    };
  }
  return staticAssets;
};

// The website's address of the stone page (same as productSlug() in client-next).
const slugOf = (name) =>
  String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// A photo from our bucket, made small and embedded (null if it can't be read).
const publicPrefix = () => `https://storage.googleapis.com/${bucket.name}/`;
async function embed(url, width, height) {
  if (!url || !url.startsWith(publicPrefix())) return null;
  try {
    const filePath = decodeURIComponent(url.slice(publicPrefix().length).split('?')[0]);
    const [buf] = await bucket.file(filePath).download();
    const out = await sharp(buf)
      .resize({ width, height, fit: height ? 'cover' : 'inside', withoutEnlargement: true })
      .jpeg({ quality: 78 })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString('base64')}`;
  } catch (e) {
    console.warn('Spec sheet photo not read:', e.message);
    return null;
  }
}

async function loadStone(id) {
  if (!/^[A-Za-z0-9_-]{1,60}$/.test(String(id))) throw httpError(400, 'Unknown stone.');
  const [doc, details, company] = await Promise.all([
    db.collection(col('materials')).doc(id).get(),
    db.collection(col('product_details')).doc(id).get(),
    db.collection(col('site_content')).doc('company').get(),
  ]);
  const stone = doc.exists ? doc.data() : null;
  if (!stone || stone.hidden === true || !stone.name || !Array.isArray(stone.finishes)) throw httpError(404, 'Unknown stone.');
  return {
    stone,
    details: details.exists ? details.data() : {},
    contact: { ...CONTACT, ...(company.exists ? company.data()?.data || {} : {}) },
  };
}

async function buildHtml({ stone, details, contact }, lang) {
  const w = L[lang];
  const pickLang = (v) => (typeof v === 'object' && v ? (lang === 'ar' && v.ar) || v.en || '' : '');
  const finishes = stone.finishes.filter((f) => f?.link && !ROOM_FINISHES.includes(f.finish));
  const main = finishes.find((f) => f.finish === 'Polished') || finishes.find((f) => f.finish === 'Honed') || finishes[0];
  const room = stone.finishes.find((f) => f?.link && ['indoorMockup', 'mockup'].includes(f.finish));
  const finishName = (n) => (lang === 'ar' && w.finishNames[String(n).toLowerCase()]) || n;
  const category = (lang === 'ar' && w.categories[stone.type]) || stone.type || '';

  const [mainPhoto, roomPhoto, ...finishPhotos] = await Promise.all([
    embed(main?.link, 1000, 700),
    embed(room?.link, 1400),
    ...finishes.slice(0, 6).map((f) => embed(f.thumb || f.link, 260, 260)),
  ]);

  const specs = [
    [w.origin, pickLang(details.origin)],
    [w.colour, pickLang(details.colour)],
    [
      w.forms,
      (details.forms || [])
        .map((f) => w.forms_[f])
        .filter(Boolean)
        .join(' · '),
    ],
    [w.thickness, details.thicknesses ? `${details.thicknesses} cm` : ''],
    [w.sizes, details.sizes],
    ...TECH.map(([k, unit]) => [
      w[k],
      typeof details.tech?.[k] === 'number' ? `${details.tech[k].toLocaleString('en-US')} ${unit}` : '',
    ]),
  ].filter(([, v]) => v);
  const uses = (details.uses || []).map((u) => w.uses_[u]).filter(Boolean);
  const description = (lang === 'ar' && details.description?.ar) || details.description?.en || '';
  const otherNames = (details.otherNames || []).filter((n) => n.toLowerCase() !== stone.name.toLowerCase());
  const pageUrl = `${SITE}/${lang}/products/${slugOf(stone.name)}/`;
  const a = assets();

  return `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8">
<style>
@font-face{font-family:Cairo;src:url(${a.regular}) format('woff2');font-weight:400}
@font-face{font-family:Cairo;src:url(${a.bold}) format('woff2');font-weight:700}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Cairo,sans-serif;color:#1d1a16;font-size:10.5pt;line-height:1.45;width:210mm;height:297mm;display:flex;flex-direction:column}
.top{background:#14110d;color:#f3eee6;padding:9mm 12mm 7mm;display:flex;justify-content:space-between;align-items:center}
.top img{height:13mm;filter:brightness(0) invert(1)}
.top span{color:#cdb48b;font-size:9pt;letter-spacing:.12em;text-transform:uppercase}
.head{padding:7mm 12mm 0}
.cat{color:#8c7553;font-size:9pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
h1{font-size:25pt;line-height:1.1;margin-top:1mm}
.aka{color:#6b645a;font-size:9.5pt;margin-top:1mm}
.main{display:grid;grid-template-columns:1.15fr 1fr;gap:7mm;padding:5mm 12mm 0}
.photo{width:100%;height:70mm;object-fit:cover;border-radius:3mm;background:#eee}
h2{font-size:11pt;color:#8c7553;margin:4mm 0 1.5mm;text-transform:uppercase;letter-spacing:.06em}
.main>div>h2:first-child{margin-top:0}
.fin{display:flex;flex-wrap:wrap;gap:2.5mm}
.fin div{width:19mm;font-size:8pt;text-align:center;line-height:1.2}
.fin img{width:19mm;height:19mm;object-fit:cover;border-radius:1.5mm;display:block;margin-bottom:1mm}
table{width:100%;border-collapse:collapse}
td{padding:1.6mm 0;border-bottom:.3mm solid #e6dfd3;vertical-align:top}
td:first-child{color:#6b645a;width:40%;padding-inline-end:3mm}
.desc{font-size:9.5pt;color:#3a352e;display:-webkit-box;-webkit-line-clamp:9;-webkit-box-orient:vertical;overflow:hidden}
.uses{display:flex;flex-wrap:wrap;gap:1.8mm}
.uses span{border:.3mm solid #cdb48b;border-radius:5mm;padding:.6mm 3mm;font-size:8.5pt}
.room{padding:5mm 12mm 0;flex:1;min-height:0;display:flex;flex-direction:column}
.room img{width:100%;flex:1;min-height:0;object-fit:cover;border-radius:3mm}
.foot{margin-top:5mm;background:#14110d;color:#d6d0c6;padding:6mm 12mm;font-size:9pt}
.foot b{color:#f3eee6;font-size:11pt;display:block;margin-bottom:2mm}
.cols{display:grid;grid-template-columns:repeat(3,auto);gap:2mm 8mm;justify-content:start}
.cols i{font-style:normal;color:#cdb48b;display:block;font-size:8pt}
.cols span,.ltr{direction:ltr;unicode-bidi:embed}
.small{margin-top:3mm;color:#a8a196;font-size:8pt}
</style></head><body>
<div class="top"><img src="${a.logo}" alt="Wadi Degla"><span>${esc(w.sheet)}</span></div>
<div class="head"><p class="cat">${esc(category)}</p><h1 dir="auto">${esc(stone.name)}</h1>
${otherNames.length ? `<p class="aka">${esc(w.alsoKnownAs)}: <span dir="auto">${esc(otherNames.join(', '))}</span></p>` : ''}</div>
<div class="main"><div>
${mainPhoto ? `<img class="photo" src="${mainPhoto}" alt="">` : ''}
${
  finishes.length
    ? `<h2>${esc(w.finishes)}</h2><div class="fin">${finishes
        .slice(0, 6)
        .map((f, i) => `<div>${finishPhotos[i] ? `<img src="${finishPhotos[i]}" alt="">` : ''}${esc(finishName(f.finish))}</div>`)
        .join('')}</div>`
    : ''
}
</div><div>
${specs.length ? `<h2>${esc(w.specs)}</h2><table>${specs.map(([k, v]) => `<tr><td>${esc(k)}</td><td dir="auto">${esc(v)}</td></tr>`).join('')}</table>` : ''}
${uses.length ? `<h2>${esc(w.uses)}</h2><div class="uses">${uses.map((u) => `<span>${esc(u)}</span>`).join('')}</div>` : ''}
${description ? `<h2>${esc(w.about)}</h2><p class="desc" dir="auto">${esc(description)}</p>` : ''}
</div></div>
${roomPhoto ? `<div class="room"><h2>${esc(w.inSpace)}</h2><img src="${roomPhoto}" alt=""></div>` : '<div style="flex:1"></div>'}
<div class="foot"><b>${esc(w.contact)}</b><div class="cols">
<div><i>${esc(w.phone)}</i><span>${esc(contact.mainPhone)}</span></div>
<div><i>${esc(w.email)}</i><span>${esc(contact.emailExport)}</span></div>
<div><i>${esc(w.web)}</i><span>${esc(pageUrl.replace('https://', ''))}</span></div>
</div><p class="small">${esc(w.address)}<br>${esc(w.company)}<br>${esc(w.note)}</p></div>
</body></html>`;
}

// one Chromium at a time; the same sheet asked twice at once is made once
let queue = Promise.resolve();
const making = new Map();
async function render(html) {
  const run = queue.then(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
      return await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    } finally {
      await browser.close();
    }
  });
  queue = run.catch(() => {});
  return run;
}

const SpecSheetService = { LANGS };

// { buffer, fileName } of the stone's sheet in that language (en for anything but ar).
SpecSheetService.get = async (id, langAsked) => {
  const lang = LANGS.includes(langAsked) ? langAsked : 'en';
  const data = await loadStone(id);
  const key = crypto
    .createHash('sha1')
    .update(JSON.stringify([LAYOUT_VERSION, data.stone.name, data.stone.type, data.stone.finishes, data.details, data.contact]))
    .digest('hex');
  const fileName = `${slugOf(data.stone.name)}-spec-sheet-wadi-degla${lang === 'ar' ? '-ar' : ''}.pdf`;
  const file = bucket.file(storagePath(`spec-sheets/${id}-${lang}.pdf`));
  try {
    const [meta] = await file.getMetadata();
    if (meta?.metadata?.key === key) {
      const [buffer] = await file.download();
      return { buffer, fileName };
    }
  } catch {
    // not made yet
  }
  const jobKey = `${id}-${lang}-${key}`;
  if (!making.has(jobKey)) {
    making.set(
      jobKey,
      (async () => {
        const buffer = Buffer.from(await render(await buildHtml(data, lang)));
        await file
          .save(buffer, { contentType: 'application/pdf', resumable: false, metadata: { metadata: { key } } })
          .catch((e) => console.warn('Spec sheet not kept:', e.message));
        return buffer;
      })().finally(() => making.delete(jobKey)),
    );
  }
  return { buffer: await making.get(jobKey), fileName };
};

SpecSheetService.buildHtml = buildHtml; // for local previews
module.exports = SpecSheetService;
