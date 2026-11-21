import TopicPage from '../../../src/components/Topic/TopicPage';
import { topicMetadata, topicData, topicBreadcrumb } from '../../../src/util/topic-build';

// Topic page: texts in content/topics/<lang>.json, layout in src/components/Topic/.
const KEY = 'egyptianMarble';

export async function generateMetadata(props) {
  const params = await props.params;
  return topicMetadata(params.lang, KEY);
}

export default async function Page(props) {
  const params = await props.params;
  const { lang } = params;
  const { products, alsoProducts, projects } = await topicData(lang, KEY);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topicBreadcrumb(lang, KEY)) }}
      />
      <TopicPage
        lang={lang}
        topicKey={KEY}
        products={products}
        alsoProducts={alsoProducts}
        projects={projects}
      />
    </>
  );
}
