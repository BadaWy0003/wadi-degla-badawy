// Links between pages: a topic page (label = its heading, in content/topics/<lang>.json) or
// another page of OTHER_LINKS (label = a translation key). Used by the topic pages' and the
// other pages' "Related pages" blocks (RelatedPages.js). Server side only.
import { t } from './meta';
import { topicText } from './topic-content';
import { TOPIC_PAGES, OTHER_LINKS } from './topic-pages';

export function relatedLink(lang, key) {
  if (TOPIC_PAGES[key]) {
    return { href: `/${TOPIC_PAGES[key].slug}/`, label: topicText(lang, `${key}.heading`) };
  }
  const other = OTHER_LINKS[key];
  return other ? { href: `${other.path}/`, label: t(lang, other.label) } : null;
}
