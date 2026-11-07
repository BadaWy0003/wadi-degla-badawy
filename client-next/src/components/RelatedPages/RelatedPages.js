// "Related pages" block at the end of a content page (server component; a <section>, not
// <nav>: Navbar.css styles every nav element): real links to the
// stones, topic guides and pages that go with this one, so visitors and Google find them.
// Keys: TOPIC_PAGES or OTHER_LINKS in src/util/topic-pages.js. Heading text from
// content/topics/<lang>.json (common.relatedTitle).
import LangLink from '../LangLink';
import { relatedLink } from '../../util/related-links';
import { topicText } from '../../util/topic-content';
import './RelatedPages.css';

// Which pages each page links to (most relevant first).
export const RELATED = {
  packing: ['exports', 'buyGuide', 'egyptianMarble', 'products', 'quarries', 'contact'],
  machinery: ['quarries', 'history', 'egyptianMarble', 'egyptianGranite', 'packing', 'products'],
  patterns: ['cobbles', 'kerbstone', 'stoneCreations', 'egyptianMarble', 'visualizer', 'products'],
  cobbles: ['kerbstone', 'patterns', 'egyptianGranite', 'projects', 'products', 'contact'],
  kerbstone: ['cobbles', 'patterns', 'egyptianGranite', 'projects', 'products', 'contact'],
  quarries: [
    'galalaMarble',
    'egyptianMarble',
    'egyptianGranite',
    'machinery',
    'history',
    'products',
  ],
  history: ['quarries', 'galalaMarble', 'machinery', 'egyptianMarble', 'projects', 'products'],
};

export default function RelatedPages({ lang, page }) {
  const links = (RELATED[page] || []).map((key) => relatedLink(lang, key)).filter(Boolean);
  if (!links.length) return null;
  return (
    <section className="related-pages">
      <h2>{topicText(lang, 'common.relatedTitle')}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <LangLink href={l.href}>{l.label}</LangLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
