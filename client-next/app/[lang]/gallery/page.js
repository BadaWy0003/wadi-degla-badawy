import { t, buildAlternates } from '../../../src/util/meta';
import { getGalleryItems } from '../../../src/util/product-slugs';
import Gallery from '../../../src/components/Gallery/Gallery';

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'gallery.pageTitle', 'Gallery | Wadi Degla'),
    description: t(lang, 'gallery.metaDescription', ''),
    alternates: buildAlternates('/gallery', lang),
  };
}

// Gallery photos are fetched at build time so they are in the static HTML (Google Images);
// Gallery refreshes them in the browser.
export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <Gallery initialItems={items} />;
}
