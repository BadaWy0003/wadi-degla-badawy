import TopicPage from '../../../src/components/Topic/TopicPage';
import { topicMetadata, topicData, topicBreadcrumb } from '../../../src/util/topic-build';

// Topic page: texts in content/topics/<lang>.json, layout in src/components/Topic/.
const KEY = 'importedGranite';

export function generateMetadata({ params }) {
  return topicMetadata(params.lang, KEY);
}

export default async function Page({ params }) {
  const { lang } = params;
  const { products, projects } = await topicData(lang, KEY);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topicBreadcrumb(lang, KEY)) }}
      />
      <TopicPage lang={lang} topicKey={KEY} products={products} projects={projects} />
    </>
  );
}
