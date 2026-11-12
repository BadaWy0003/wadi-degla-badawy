// Projects come from the admin panel (server: GET /api/projects) and are read at BUILD
// time, so the Projects page and every project page are static and readable by Google.
// A change in the admin panel reaches the site with "Publish to website" (a rebuild).
//
// If the API can't be reached, the build FAILS on purpose: the live site then keeps its
// last good version instead of being deployed without projects.

import { getProducts } from './product-slugs';

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'https://server-withered-wildflower-1595.fly.dev';

let cache = null;

async function fetchProjects() {
  if (cache) return cache;
  let res;
  try {
    res = await fetch(`${API_BASE}/api/projects`, { cache: 'force-cache' });
  } catch (e) {
    throw new Error(
      `[projects] Projects API unreachable at build time (${e?.cause?.code || e?.message}); stopping the build so the live site keeps its current projects.`,
    );
  }
  if (!res.ok)
    throw new Error(
      `[projects] Projects API answered ${res.status}; stopping the build so the live site keeps its current projects.`,
    );
  const json = await res.json();
  cache = Array.isArray(json?.data?.projects) ? json.data.projects : [];
  return cache;
}

// Arabic site: Arabic text when it was written, otherwise English. Other languages: English.
const pick = (field, lang) => (lang === 'ar' && field?.ar?.trim() ? field.ar : field?.en || '');

// A name typed all in lower case in the admin panel ("viva tangerine by wyndham") is shown
// with capitals; any other name is shown as written.
const capitalize = (text) =>
  text && text === text.toLowerCase() ? text.replace(/(^|[\s(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()) : text;

const shorten = (text, max = 160) => {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

// Product cards on a project page only need the name, category and the Honed (or Polished)
// photo, like the products list.
const cardFinishes = (finishes = []) => {
  const f =
    finishes.find((x) => x.finish === 'Honed') || finishes.find((x) => x.finish === 'Polished');
  return f ? [f] : [];
};

// Projects in the shape the Projects components use, in page order (country groups in the
// order set in the admin panel, then the projects' order inside each group).
export async function getProjects(lang = 'en') {
  const [list, products] = await Promise.all([fetchProjects(), getProducts()]);
  const productById = new Map((products || []).map((p) => [p.id, p]));
  return list.map((p) => {
    const description = pick(p.description, lang);
    return {
      id: String(p.id),
      name: capitalize(pick(p.name, lang)),
      city: pick(p.city, lang),
      country: pick(p.country?.name, lang),
      countryId: p.country?.id,
      description,
      metaDescription: shorten(description),
      thumbnail: p.thumbnail,
      images: (p.images || []).map((img) => ({ src: img.src, alt: img.alt })),
      materials: (p.materials || [])
        .map((m) => productById.get(m.id))
        .filter(Boolean)
        .map((m) => ({ id: m.id, name: m.name, type: m.type, finishes: cardFinishes(m.finishes) })),
    };
  });
}

// The languages a project page is really written in: English, plus Arabic when its Arabic
// description exists. Other language pages only translate the labels around English names,
// so they are noindex and not in the sitemap; they stay visible to visitors.
// What a project card shows (projects list, "more projects" on a project page): photo,
// name, place, number of photos and up to 4 stone swatches.
export function projectCard(p) {
  return {
    id: p.id,
    name: p.name,
    city: p.city,
    country: p.country,
    countryId: p.countryId,
    thumbnail: p.thumbnail || p.images[0]?.src || '',
    photoCount: p.images.length,
    stoneCount: p.materials.length,
    stones: p.materials.slice(0, 4).map((m) => ({
      id: m.id,
      name: m.name,
      thumb: m.finishes[0]?.thumb || m.finishes[0]?.link || '',
    })),
  };
}

export async function getProjectIndexedLangs(id) {
  const p = (await fetchProjects()).find((x) => String(x.id) === String(id));
  if (!p) return [];
  return p.description?.ar?.trim() ? ['en', 'ar'] : ['en'];
}

export async function getProjectIds() {
  return (await fetchProjects()).map((p) => String(p.id));
}

export async function getProject(id, lang) {
  return (await getProjects(lang)).find((p) => p.id === String(id)) || null;
}
