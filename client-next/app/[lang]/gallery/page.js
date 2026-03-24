import dynamic from 'next/dynamic';
import { t, buildAlternates } from '../../../src/util/meta';
const Gallery = dynamic(() => import('../../../src/components/Gallery/Gallery'), { ssr: false });

export function generateMetadata({ params }) {
  const { lang } = params;
  return {
    title: t(lang, 'gallery.pageTitle', 'Gallery | Wadi Degla'),
    description: t(lang, 'gallery.metaDescription', ''),
    alternates: buildAlternates('/gallery'),
  };
}

export default function GalleryPage() {
  return <Gallery />;
}
