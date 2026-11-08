import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import { getGalleryItems } from '../../../src/util/product-slugs';
import Gallery from '../../../src/components/Gallery/Gallery';

export function generateMetadata({ params }) {
  const { lang } = params;
  const title = t(lang, 'gallery.pageTitle', 'Gallery | Wadi Degla');
  const description = t(lang, 'gallery.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/gallery', lang),
    ...buildSocial({ title, description, path: '/gallery', lang }),
  };
}

// Gallery photos are fetched at build time so they are in the static HTML (Google Images);
// Gallery refreshes them in the browser.
export default async function GalleryPage() {
  const items = await getGalleryItems();
  return <Gallery initialItems={items} />;
}
