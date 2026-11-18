// /image-sitemap.xml: tells Google Images which photos belong to which page (stone photos of
// every finish, quarries and factories, project photos, the gallery and the topic pages' covers).
// Built at build time like /sitemap.xml; listed in public/robots.txt. English page addresses
// only: the photos are the same in every language.
import { getProducts, getGalleryItems, productSlug } from '../../src/util/product-slugs';
import { getProjects } from '../../src/util/projects-data';
import { TOPIC_PAGES } from '../../src/util/topic-pages';
import { QUARRY_PHOTOS } from '../../src/components/Quarries/quarriesPhotos';

export const dynamic = 'force-static';

const BASE_URL = 'https://www.wadidegla-eg.com';

// Absolute and properly encoded (some uploaded file names contain spaces).
const absolute = (src) => {
  const full = src.startsWith('/') ? `${BASE_URL}${src}` : src;
  try {
    return encodeURI(decodeURI(full));
  } catch {
    return full.replace(/ /g, '%20');
  }
};
const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const [products, projects, gallery] = await Promise.all([
    getProducts(),
    getProjects('en'),
    getGalleryItems(),
  ]);

  const entries = [];
  const add = (path, images) => {
    const list = [...new Set(images.filter(Boolean).map(absolute))];
    if (list.length) entries.push({ loc: `${BASE_URL}/en${path}/`, images: list });
  };

  for (const p of products || []) {
    add(
      `/products/${productSlug(p.name)}`,
      (p.finishes || []).map((f) => f.link),
    );
  }
  add('/quarries', Object.values(QUARRY_PHOTOS).flat());
  for (const p of projects) {
    add(`/projects/${p.id}`, [p.thumbnail, ...p.images.map((img) => img.src)]);
  }
  add(
    '/gallery',
    gallery.flatMap((g) => (g.finishes || []).map((f) => f.link)),
  );
  for (const page of Object.values(TOPIC_PAGES)) {
    add(`/${page.slug}`, [page.hero]);
  }

  const body = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n${e.images
          .map((src) => `    <image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`)
          .join('\n')}\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
