// The photo headers ("covers") of the content pages (2026-11-21, owner): the same look as the
// buying guide's header (photo darkened on the text side, fading into the page at the bottom),
// shared CSS in src/components/PhotoCover/PhotoCover.css. Each photo can be replaced in the
// admin panel (Website → <page> → "Header photo", field `heroPhoto` of the page's block).
// The website's own photos are in /Assets/Media/Hero/<file>.webp with a square phone copy
// <file>-m.webp; a photo uploaded in the admin panel serves phones too.
// Plain module (no 'use client'): the content-defaults route reads it as well.
import { siteData, cssUrl } from './site-content';

const DIR = '/Assets/Media/Hero/';

// page -> the admin-panel block that holds its header photo, and the website's own photo
export const PAGE_COVERS = {
  history: { block: 'history', file: 'history-cover', size: [1080, 799] },
  quarries: { block: 'quarries', file: 'quarries-cover', size: [1280, 853] },
  machinery: { block: 'machinery', file: 'machinery-cover', size: [1280, 853] },
  packing: { block: 'packing', file: 'packing-cover', size: [1080, 810] },
  exports: { block: 'exports', file: 'exports-cover', size: [1280, 853] },
  certificates: { block: 'certificates', file: 'certificates-cover', size: [1536, 1024] },
  fairs: { block: 'fairs', file: 'fairs-cover', size: [1200, 900] },
  projects: { block: 'projectsPage', file: 'projects-cover', size: [1080, 720] },
  products: { block: 'productsList', file: 'products-cover', size: [1080, 720] },
  stoneCreations: { block: 'stoneCreations', file: 'stone-creations-cover', size: [1080, 1067] },
  patterns: { block: 'patterns', file: 'patterns-cover', size: [1080, 720] },
  gallery: { block: 'gallery', file: 'gallery-cover', size: [1280, 853] },
  inspiration: { block: 'inspiration', file: 'inspiration-cover', size: [1080, 730] },
  news: { block: 'newsPage', file: 'news-cover', size: [1440, 1080] },
  partners: { block: 'partners', file: 'partners-cover', size: [1080, 719] },
};

// { src, phone, ratio }: the client's photo when replaced in the admin panel, else the website's
// own (its phone copy is square). ratio = the phone photo's height / width, kept between 0.56
// and 1.25: on phones the photo is shown full width at the top at that shape (PhotoCover.css).
export function pageCover(page) {
  const cover = PAGE_COVERS[page];
  const photo = siteData(cover.block).heroPhoto;
  if (photo?.src) {
    const r = photo.width && photo.height ? photo.height / photo.width : 0.75;
    return { src: photo.src, phone: photo.src, ratio: Math.min(1.25, Math.max(0.56, r)) };
  }
  return { src: `${DIR}${cover.file}.webp`, phone: `${DIR}${cover.file}-m.webp`, ratio: 1 };
}

// The style for the header element: <div className="xx-hero wd-cover" style={coverStyle('…')}>
export function coverStyle(page) {
  const { src, phone, ratio } = pageCover(page);
  return {
    '--wd-cover': cssUrl(src),
    '--wd-cover-phone': cssUrl(phone),
    '--wd-cover-r': ratio.toFixed(3),
  };
}

// The website's own photo with its size, for the admin panel's "original" (content-defaults)
export function coverDefault(page) {
  const { file, size } = PAGE_COVERS[page];
  return { src: `${DIR}${file}.webp`, width: size[0], height: size[1] };
}
