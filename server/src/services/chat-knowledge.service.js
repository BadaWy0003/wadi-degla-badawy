const { db } = require('../start/firebase');
const { col } = require('../start/data-area');
const SiteContentService = require('./site-content.service');
const ProjectsService = require('./projects.service');
const SpecSheet = require('./spec-sheet.service');

// What the chat assistant knows (chat.service.js), built from the live website data, so an
// admin-panel change (a stone, its details, the company facts, a text) reaches the assistant
// within 10 minutes with no file to keep in sync:
// - facts(): company facts, contact, export terms, the buying guide's FAQ, projects, page links
// - index: one short line per visible stone (name, category, colour, uses)
// - details(names): the full details of a few stones (finishes, sizes, origin, description…)
// Everything is in English (the model answers in the visitor's language). No prices exist anywhere
// in the data, so the assistant has none to give.

const { STONE_CATEGORIES, ROOM_FINISHES, cleanType, slugOf, SITE } = SpecSheet.shared;
const CACHE_MS = 10 * 60 * 1000;
const USE_WORDS = {
  flooring: 'floors',
  wallCladding: 'walls',
  exteriorCladding: 'facades',
  staircases: 'stairs',
  windowSills: 'sills',
  countertops: 'countertops',
  landscaping: 'paving',
};
const USE_NAMES = {
  flooring: 'flooring',
  wallCladding: 'wall cladding',
  exteriorCladding: 'exterior cladding / facades',
  staircases: 'stairs',
  windowSills: 'window sills',
  countertops: 'countertops',
  landscaping: 'landscaping / paving',
};
// Partners with projects on the website (owner-confirmed 2026-11-12, PartnersData.js) and the
// core markets (owner, 2026-11-27, OurMarkets.js): website code the server can't read.
const PARTNERS = 'Wyndham, Emaar, Mountain View, Consulate General of Egypt in Kuwait, WD Developments';
const CORE_MARKETS = 'USA, United Kingdom, Romania, Turkey, Albania, Mexico';
// Pages the assistant may point to (path after /<lang>).
const PAGES = {
  'all stones': '/products/',
  'quote list': '/quote/',
  'buying guide': '/buy-marble-from-egypt/',
  'export terms': '/exports/',
  packing: '/packing/',
  'quarries & factories': '/quarries/',
  certificates: '/certificates/',
  projects: '/projects/',
  'visualizer (stone in a room)': '/visualizer/',
  'Egyptian marble': '/egyptian-marble/',
  'Egyptian limestone': '/egyptian-limestone/',
  'Egyptian granite': '/egyptian-granite/',
  'imported marble': '/imported-marble/',
  'imported granite': '/imported-granite/',
  cobbles: '/cobbles/',
  kerbstones: '/kerbstone/',
  'custom pieces & mosaics': '/stone-creations/',
  contact: '/contact/',
};

const clean = (v, max = 400) =>
  String(v ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
// Plain spaces and hyphens instead of the non-breaking / special ones models like to write.
const plain = (v) =>
  String(v || '')
    .replace(/[\u00a0\u2000-\u200b\u202f\u205f\u3000]/g, ' ')
    .replace(/[\u2010-\u2015]/g, '-');
const en = (v) => (v && typeof v === 'object' ? v.en || '' : v || '');

let cache = { at: 0, value: null };

async function load() {
  const [mats, dets, site, projects] = await Promise.all([
    db.collection(col('materials')).get(),
    db.collection(col('product_details')).get(),
    SiteContentService.liveSite(),
    ProjectsService.listPublic().catch(() => ({ projects: [] })),
  ]);
  const detailsById = Object.fromEntries(dets.docs.map((d) => [d.id, d.data()]));
  const stones = mats.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((s) => s.hidden !== true && s.name && Array.isArray(s.finishes))
    .map((s) => {
      const d = detailsById[s.id] || {};
      const finishes = s.finishes.filter((f) => f?.finish && !ROOM_FINISHES.includes(f.finish)).map((f) => clean(f.finish, 40));
      const photo =
        s.finishes.find((f) => /polish/i.test(f?.finish)) ||
        s.finishes.find((f) => f?.link && !ROOM_FINISHES.includes(f.finish)) ||
        {};
      return {
        id: s.id,
        name: clean(s.name, 80),
        type: cleanType(s.type),
        slug: slugOf(s.name),
        photo: photo.mini || photo.thumb || photo.link || '',
        finishes: [...new Set(finishes)],
        details: d,
      };
    })
    .filter((s) => STONE_CATEGORIES.includes(s.type))
    .sort((a, b) => STONE_CATEGORIES.indexOf(a.type) - STONE_CATEGORIES.indexOf(b.type) || a.name.localeCompare(b.name));
  return { stones, site, projects: projects.projects || [] };
}

async function get() {
  if (cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;
  try {
    const raw = await load();
    cache = { at: Date.now(), value: build(raw) };
  } catch (e) {
    console.error('[chat] knowledge not loaded:', e.message);
    if (!cache.value) throw e;
  }
  return cache.value;
}

// Words a visitor may use for a stone: its name and its other names, lower case.
const namesOf = (s) =>
  [s.name, ...(Array.isArray(s.details.otherNames) ? s.details.otherNames : [])]
    .map((n) => clean(n, 80).toLowerCase())
    .filter((n) => n.length >= 3);

function build({ stones, site, projects }) {
  const t = site.text;
  const c = site.data('company');
  const days = Array.isArray(c.openDays) ? c.openDays.join(', ') : 'Sat–Thu';
  const faq = []
    .concat(Array.isArray(t('topics.buyGuide.faq')) ? t('topics.buyGuide.faq') : [])
    .map((_, i) => ({ q: t(`topics.buyGuide.faq.${i}.q`), a: t(`topics.buyGuide.faq.${i}.a`) }))
    .filter((x) => x.q && x.a);
  const projectLines = projects.slice(0, 20).map((p) => {
    const stonesUsed = (p.materials || [])
      .map((m) => m.name)
      .slice(0, 3)
      .join(', ');
    const place = [clean(en(p.city), 40), clean(en(p.country?.name), 40)].filter(Boolean).join(', ');
    return `- ${clean(en(p.name), 60)}, ${place}${stonesUsed ? `: ${stonesUsed}` : ''}`;
  });

  const facts = [
    `COMPANY: Wadi Degla Co. (Wadi Degla for Marble & Granite), Egyptian exporter of marble, limestone and granite since ${c.foundedYear || 1980}. ${c.quarries} quarries, ${c.factories} factories (${Number(c.factoryArea || 0).toLocaleString('en')} m² of factories), about ${Number(c.dailyCapacity || 0).toLocaleString('en')} m² produced per day, ${c.workers}+ workers, ${c.projects}+ projects, exports to ${c.exportCountries}+ countries (core markets: ${CORE_MARKETS}). ISO 9001:2015 certified. Also supplies imported marble and granite from partner quarries.`,
    `PARTNERS WITH PROJECTS ON THE WEBSITE: ${PARTNERS}.`,
    `CONTACT: WhatsApp and phone ${c.mainPhone}; email ${c.emailInfo}, export ${c.emailExport}, sales ${c.emailSales}. Address: ${t('contactInfo.addressLine')}. Office hours ${days}, ${c.openHour}:00–${c.closeHour}:00 Cairo time.`,
    // the export terms are in the buying guide's FAQ below (same answers as the Exports page)
    `FORMS: slabs, cut-to-size tiles, blocks. Thickness 1 to 8 cm. Custom sizes cut to drawings. Finishes on the website: polished, honed, brushed, flamed, tumbled, bush-hammered, sandblasted and custom.`,
    `PACKING: ${clean(t('packing.woodenBundleText'), 220)} ${clean(t('packing.woodenCratesText'), 160)}`,
    `FAQ:\n${faq.map((x) => `Q: ${clean(x.q, 120)} A: ${clean(x.a, 260)}`).join('\n')}`,
    projectLines.length ? `PROJECTS (name, place, stones):\n${projectLines.join('\n')}` : '',
    `PAGES: ${Object.entries(PAGES)
      .map(([k, v]) => `${k} ${v}`)
      .join('; ')}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  // Per category, the stones grouped by their uses: "uses: floors walls …" then
  // "Name (colour); Name (colour)". Most stones of a category share the same uses, so this is short.
  const index = STONE_CATEGORIES.map((cat) => {
    const groups = new Map(); // uses -> ["Name (colour)"]
    stones
      .filter((s) => s.type === cat)
      .forEach((s) => {
        const uses = (s.details.uses || []).map((u) => USE_WORDS[u]).filter(Boolean).join(' ') || 'not listed';
        const colour = clean(en(s.details.colour).split(/,|;| with /i)[0], 28);
        if (!groups.has(uses)) groups.set(uses, []);
        groups.get(uses).push(colour ? `${s.name} (${colour})` : s.name);
      });
    if (!groups.size) return '';
    const lines = [...groups.entries()].map(([uses, names]) => `uses: ${uses} -> ${names.join('; ')}`);
    return `[${cat}]\n${lines.join('\n')}`;
  })
    .filter(Boolean)
    .join('\n');
  const indexLegend = 'Each line gives the ONLY uses the stones after the arrow are recommended for.';

  const detailsText = (s, lang) => {
    const d = s.details;
    const desc = clean((d.description && (d.description[lang] || d.description.en)) || '', 450);
    const tech = d.tech || {};
    const techLine = [
      tech.density != null && `density ${tech.density} kg/m³`,
      tech.waterAbsorption != null && `water absorption ${tech.waterAbsorption}%`,
      tech.compressiveStrength != null && `compressive strength ${tech.compressiveStrength} MPa`,
      tech.flexuralStrength != null && `flexural strength ${tech.flexuralStrength} MPa`,
    ]
      .filter(Boolean)
      .join(', ');
    return [
      `### ${s.name} (${s.type})`,
      (d.otherNames || []).length ? `Also known as: ${d.otherNames.slice(0, 6).join(', ')}` : '',
      en(d.origin) ? `Origin: ${clean(en(d.origin), 120)}` : '',
      en(d.colour) ? `Colour: ${clean(en(d.colour), 120)}` : '',
      s.finishes.length ? `Finishes: ${s.finishes.join(', ')}` : '',
      (d.forms || []).length ? `Forms: ${d.forms.join(', ')}` : '',
      d.thicknesses ? `Thickness (cm): ${clean(d.thicknesses, 60)}` : '',
      d.sizes ? `Sizes (cm): ${clean(d.sizes, 160)}` : '',
      (d.uses || []).length ? `Uses: ${d.uses.map((u) => USE_NAMES[u] || u).join(', ')}` : '',
      d.traffic ? `Floor traffic: ${d.traffic}` : '',
      techLine ? `Technical data: ${techLine}` : '',
      desc ? `About: ${desc}` : '',
      `Page: /products/${s.slug}/`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const byName = stones.map((s) => ({ s, names: namesOf(s) }));
  // The stones a text mentions (by name or other name), longest names first so "Sunny Light"
  // wins over "Sunny".
  const mentioned = (text) => {
    // models write non-breaking spaces and hyphens ("Red\u00a0Aswan"): make them plain first
    const hay = ` ${plain(text).toLowerCase()} `;
    const hits = new Map(); // stone -> first position
    byName
      .flatMap(({ s, names }) => names.map((n) => ({ s, n })))
      .sort((a, b) => b.n.length - a.n.length)
      .forEach(({ s, n }) => {
        const re = new RegExp(`(^|[^\\p{L}])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u');
        const m = re.exec(hay);
        if (m && !hits.has(s)) hits.set(s, m.index);
      });
    return [...hits.entries()].sort((a, b) => a[1] - b[1]).map(([s]) => s);
  };

  return { facts, index, indexLegend, stones, detailsText, mentioned, site: SITE };
}

module.exports = { get, USE_NAMES, plain };
