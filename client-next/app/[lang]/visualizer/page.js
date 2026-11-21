import { t, buildAlternates, buildSocial } from '../../../src/util/meta';
import { getProducts } from '../../../src/util/product-slugs';
import Visualizer from '../../../src/components/Visualizer/Visualizer';
import { visualizerStones } from '../../../src/components/Visualizer/visualizer-data';

export async function generateMetadata(props) {
  const params = await props.params;
  const { lang } = params;
  const title = t(lang, 'visualizer.pageTitle', 'Visualizer | Wadi Degla');
  const description = t(lang, 'visualizer.metaDescription', '');
  return {
    title,
    description,
    alternates: buildAlternates('/visualizer', lang),
    ...buildSocial({ title, description, path: '/visualizer', lang }),
  };
}

// The stones and their room photos are read at build time, so the page (heading, text, every
// stone's name) is in the static HTML and opens without waiting for the API; the Visualizer
// refreshes the list in the browser. Only what the page shows is passed (about 30 KB, not the
// full product list).
export default async function VisualizerPage() {
  const stones = visualizerStones((await getProducts()) || []);
  return <Visualizer initialStones={stones} />;
}
