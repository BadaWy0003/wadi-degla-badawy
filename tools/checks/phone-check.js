#!/usr/bin/env node
/**
 * Phone layout check of the BUILT website (client-next/out/, after `npm run build`).
 *
 * Opens every main page in English and Arabic on a simulated iPhone 13 and a small
 * 360 px phone (Chromium through Playwright, served from the build folder: free) and looks for:
 *   - the page scrolling sideways / things wider than the screen
 *   - text overlapping other text (only what is really visible: closed FAQ answers,
 *     clipped text and hidden menus are skipped)
 *   - text smaller than 12 px
 *   - the H1 hidden under the header bar
 * Screenshots of the iPhone views go to the output folder.
 *
 * Usage (from the repository root; Playwright must be installed where node can find it,
 * as in Claude cloud sessions):
 *   node tools/checks/phone-check.js [path/to/out] [screenshot-folder]
 * Exit code 1 when something is found. KNOWN lists the findings checked by hand and accepted.
 * It is a layout check, not a real iPhone (Safari can still differ).
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium, devices } = require('playwright');

const OUT = path.resolve(process.argv[2] || 'client-next/out');
const SHOTS = path.resolve(process.argv[3] || path.join(require('os').tmpdir(), 'wd-phone-check'));
const PORT = 5199;

// Checked by hand and accepted (2026-11-19): two lines of one label close together, and the
// stone page's fixed bottom buttons covering content while scrolling (by design).
const KNOWN = [
  /visualizer: overlapping text: ".*" x "Emperador"/,
  /products\/[^ ]+: overlapping text: ".*" x "Get a price"/,
  /products\/[^ ]+: overlapping text: ".*" x "Free sample"/,
];

const STATIC = ['', 'products', 'egyptian-marble', 'egyptian-limestone', 'egyptian-granite', 'imported-marble',
  'imported-granite', 'galala-marble', 'buy-marble-from-egypt', 'quarries', 'projects', 'gallery', 'about',
  'contact', 'exports', 'news', 'machinery', 'packing', 'certificates', 'history', 'partners', 'fairs',
  'inspiration', 'patterns', 'stone-creations', 'kerbstone', 'cobbles', 'visualizer'];

// one stone, project and news page from the build
const firstSub = (dir) => {
  try {
    const d = fs.readdirSync(path.join(OUT, 'en', dir), { withFileTypes: true }).find((e) => e.isDirectory() && e.name !== 'no-projects');
    return d ? `${dir}/${d.name}` : null;
  } catch {
    return null;
  }
};
const PAGES = [...STATIC, firstSub('products'), firstSub('projects'), firstSub('news')].filter((p) => p !== null);

const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let p = path.join(OUT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(OUT)) { res.statusCode = 403; return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream');
  return res.end(fs.readFileSync(p));
});

// Runs inside the page.
function inspect() {
  const W = document.documentElement.clientWidth;
  const out = { pageWidth: document.documentElement.scrollWidth, W, wide: [], small: [], overlaps: [], hidden: null };
  const visible = (el) => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  const name = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const clipped = (el) => { for (let a = el.parentElement; a; a = a.parentElement) if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(a).overflowX)) return true; return false; };
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !visible(el)) continue;
    if ((r.right > W + 2 || r.left < -2) && !clipped(el) && getComputedStyle(el).position !== 'fixed') out.wide.push(`${name(el)} ${Math.round(r.left)}..${Math.round(r.right)}`);
  }
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const text = n.textContent.trim();
    const el = n.parentElement;
    if (text.length < 2 || !el || !visible(el)) continue;
    if (el.closest('[aria-hidden="true"],[hidden],script,style,noscript,dialog')) continue;
    if (el.closest('details:not([open])') && !el.closest('summary')) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const r0 = range.getBoundingClientRect();
    if (r0.width < 1 || r0.height < 1) continue;
    // keep only what clipping parents really show (line clamps, closed menus)
    let r = { left: r0.left, top: r0.top, right: r0.right, bottom: r0.bottom };
    let gone = false;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (+s.opacity < 0.05 || s.visibility === 'hidden' || s.transform.startsWith('matrix(0,')) { gone = true; break; }
      if (/(hidden|clip|auto|scroll)/.test(s.overflow + s.overflowX + s.overflowY)) {
        const c = a.getBoundingClientRect();
        r = { left: Math.max(r.left, c.left), top: Math.max(r.top, c.top), right: Math.min(r.right, c.right), bottom: Math.min(r.bottom, c.bottom) };
      }
    }
    if (gone || r.right - r.left < 2 || r.bottom - r.top < 2) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 12) out.small.push(`${size}px "${text.slice(0, 30)}" (${name(el)})`);
    rects.push({ r: { l: r.left, t: r.top + scrollY, rt: r.right, b: r.bottom + scrollY }, text: text.slice(0, 25), el });
  }
  for (let i = 0; i < rects.length && out.overlaps.length < 6; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i].r, c = rects[j].r;
      const ox = Math.min(a.rt, c.rt) - Math.max(a.l, c.l), oy = Math.min(a.b, c.b) - Math.max(a.t, c.t);
      if (ox > 4 && oy > 4 && !rects[i].el.contains(rects[j].el) && !rects[j].el.contains(rects[i].el)) out.overlaps.push(`"${rects[i].text}" x "${rects[j].text}"`);
    }
  }
  const bar = document.querySelector('.wn');
  const h1 = document.querySelector('h1');
  if (bar && h1) {
    const bb = bar.getBoundingClientRect(), hb = h1.getBoundingClientRect();
    if (hb.top < bb.bottom - 2 && hb.bottom > 0) out.hidden = `h1 top ${Math.round(hb.top)} < header bottom ${Math.round(bb.bottom)}`;
  }
  out.small = [...new Set(out.small)].slice(0, 6);
  out.wide = out.wide.slice(0, 6);
  return out;
}

(async () => {
  if (!fs.existsSync(path.join(OUT, 'en', 'index.html'))) {
    console.error(`No build found at ${OUT}: run \`npm run build\` in client-next first.`);
    process.exit(2);
  }
  fs.mkdirSync(SHOTS, { recursive: true });
  await new Promise((ok) => server.listen(PORT, ok));
  const browser = await chromium.launch();
  const phones = [['iphone13', devices['iPhone 13']], ['phone360', { viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent }]];
  const findings = [];
  let views = 0;
  for (const [phone, device] of phones) {
    const context = await browser.newContext(device);
    // no outside requests: analytics, maps, the API (the build already holds the data)
    await context.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());
    for (const lang of ['en', 'ar']) {
      for (const pg of PAGES) {
        const page = await context.newPage();
        const label = `${phone} ${lang}/${pg || 'home'}`;
        try {
          await page.goto(`http://localhost:${PORT}/${lang}/${pg}${pg ? '/' : ''}`, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(700);
          // scroll through so lazy parts and fade-ins run, then back to the top
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)); }
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(1000);
          const r = await page.evaluate(inspect);
          const add = (what) => findings.push(`${label}: ${what}`);
          if (r.pageWidth > r.W + 1) add(`page scrolls sideways (${r.pageWidth} > ${r.W})`);
          r.wide.forEach((w) => add(`wider than the screen: ${w}`));
          r.overlaps.forEach((o) => add(`overlapping text: ${o}`));
          r.small.forEach((s) => add(`text under 12px: ${s}`));
          if (r.hidden) add(`heading under the header: ${r.hidden}`);
          if (phone === 'iphone13') await page.screenshot({ path: path.join(SHOTS, `${lang}-${(pg || 'home').replace(/\//g, '_')}.png`) });
          views += 1;
        } catch (e) {
          findings.push(`${label}: could not load (${e.message.split('\n')[0].slice(0, 80)})`);
        }
        await page.close();
      }
    }
    await context.close();
  }
  await browser.close();
  server.close();

  const accepted = findings.filter((f) => KNOWN.some((k) => k.test(f)));
  const real = findings.filter((f) => !accepted.includes(f));
  console.log(`${views} page views checked (${PAGES.length} pages × EN/AR × 2 phones). Screenshots: ${SHOTS}`);
  if (accepted.length) console.log(`${accepted.length} known, accepted findings (see KNOWN in the script).`);
  real.forEach((f) => console.log(' -', f));
  console.log('RESULT:', real.length ? `${real.length} problems found` : 'all good');
  process.exit(real.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
