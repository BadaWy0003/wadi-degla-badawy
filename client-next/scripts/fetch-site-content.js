// Runs before every website build (npm "prebuild"): fetches the content the client edited in
// the admin panel ("Website" menu, server GET /api/content) and writes it to
// content/.generated/site-content/ (not in git):
//   texts.json  { "contact.hours": { en, ar }, ... }  website texts by translation key
//   data.json   { company: { quarries: 15, ... }, ... } everything else, by block
//   changed.json  when each of them was last changed (ms), for the sitemap's <lastmod>
//                 (src/util/page-dates.js): { texts: { key: { en, ar } }, data: { block: { name } } }
// next.config.js points the "@site-content" import there, or to content/site-content-default/
// (empty) when the folder doesn't exist (local "next dev" without a fetch).
//
// If the API can't be reached, the build STOPS (like news and projects): a build without the
// client's changes would put the old texts back on the live site. A 404 (a server without the
// content API yet) counts as "no changes". Set SITE_CONTENT_OPTIONAL=1 to build anyway.
const fs = require('fs');
const path = require('path');

const API =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'https://server-withered-wildflower-1595.fly.dev';
const OUT = path.join(__dirname, '..', 'content', '.generated', 'site-content');

const write = (blocks) => {
  const texts = {};
  const data = {};
  const changed = { texts: {}, data: {} };
  for (const [id, block] of Object.entries(blocks || {})) {
    Object.assign(texts, block.texts || {});
    if (block.data && Object.keys(block.data).length) data[id] = block.data;
    Object.assign(changed.texts, block.changedAt?.texts || {});
    if (block.changedAt?.data) changed.data[id] = block.changedAt.data;
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'texts.json'), JSON.stringify(texts));
  fs.writeFileSync(path.join(OUT, 'data.json'), JSON.stringify(data));
  fs.writeFileSync(path.join(OUT, 'changed.json'), JSON.stringify(changed));
  console.log(
    `[site-content] ${Object.keys(texts).length} texts and ${Object.keys(data).length} data blocks from the admin panel`,
  );
};

(async () => {
  try {
    const res = await fetch(`${API}/api/content`, { signal: AbortSignal.timeout(20000) });
    if (res.status === 404) return write({});
    if (!res.ok) throw new Error(`answered ${res.status}`);
    const json = await res.json();
    write(json?.data || {});
  } catch (e) {
    const msg = `[site-content] Content API unreachable at ${API}/api/content (${e?.cause?.code || e.message})`;
    if (process.env.SITE_CONTENT_OPTIONAL === '1') {
      console.warn(`${msg}; building with the website's own texts (SITE_CONTENT_OPTIONAL=1).`);
      return write({});
    }
    console.error(`${msg}; stopping the build so the live site keeps the client's changes.`);
    process.exit(1);
  }
})();
