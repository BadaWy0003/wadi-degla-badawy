// A topic page ("Egyptian Marble", "Egyptian Granite", "Galala Marble"…), rendered at build
// time (server component: its text is in the static HTML and isn't shipped again as
// JavaScript). Layout: hero, intro, sections, the stones of this topic (live from the admin
// panel), projects that used them, questions & answers, related pages, request-a-quote.
import LangLink from '../LangLink';
import Product from '../Products/Product';
import ContactBubble from '../Contact/ContactBubble';
import { t } from '../../util/meta';
import { topicText, fillText } from '../../util/topic-content';
import { TOPIC_PAGES, OTHER_LINKS } from '../../util/topic-pages';
import '../Products/Products.css';
import './TopicPage.css';

const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

function relatedLink(lang, key) {
  if (TOPIC_PAGES[key]) {
    return { href: `/${TOPIC_PAGES[key].slug}/`, label: topicText(lang, `${key}.heading`) };
  }
  const other = OTHER_LINKS[key];
  return other ? { href: `${other.path}/`, label: t(lang, other.label) } : null;
}

export default function TopicPage({ lang, topicKey, products = [], projects = [] }) {
  const page = TOPIC_PAGES[topicKey];
  const k = (path) => topicText(lang, `${topicKey}.${path}`);
  const common = (path) => topicText(lang, `common.${path}`);
  const heading = k('heading');
  const sections = k('sections') || [];
  const faq = k('faq') || [];
  const steps = k('steps') || [];
  const related = (page.related || []).map((key) => relatedLink(lang, key)).filter(Boolean);

  return (
    <div className="topic-page">
      <div
        className="quarries-hero topic-hero"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url("${page.hero}") center / cover no-repeat`,
        }}
      >
        <h1>{heading}</h1>
        <div className="breadcrumb">
          <LangLink href="/">{common('breadcrumbHome')}</LangLink>
          {page.products && (
            <>
              <p>{'>'}</p>
              <LangLink href="/products/">{common('breadcrumbProducts')}</LangLink>
            </>
          )}
          <p>
            {'>'} {heading}
          </p>
        </div>
      </div>

      <div className="topic-content">
        <section className="topic-intro">
          {paragraphs(k('intro')).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {steps.length > 0 && (
          <section className="topic-block">
            <h2>{k('stepsTitle')}</h2>
            <ol className="topic-steps">
              {steps.map((s, i) => (
                <li key={i}>
                  <h3>{s.title}</h3>
                  {paragraphs(s.text).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </li>
              ))}
            </ol>
          </section>
        )}

        {sections.map((s, i) => (
          <section className="topic-block" key={i}>
            <h2>{s.title}</h2>
            {paragraphs(s.text).map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}

        {products.length > 0 && (
          <section className="topic-block">
            <h2>{fillText(common('productsTitle'), { topic: heading, count: products.length })}</h2>
            <div className="product-cards-2 topic-products">
              {products.map((item) => (
                <Product key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="topic-block">
            <h2>{fillText(common('projectsTitle'), { topic: heading })}</h2>
            <ul className="topic-projects">
              {projects.map((p) => (
                <li key={p.id}>
                  <LangLink href={`/projects/${p.id}/`}>
                    <img loading="lazy" src={p.thumbnail} alt={p.name} />
                    <span>
                      <strong>{p.name}</strong>
                      {[p.city, p.country].filter(Boolean).join(' - ')}
                    </span>
                  </LangLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {faq.length > 0 && (
          <section className="topic-block topic-faq">
            <h2>{common('faqTitle')}</h2>
            {faq.map((item, i) => (
              <details key={i} open={i === 0}>
                <summary>{item.q}</summary>
                {paragraphs(item.a).map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </details>
            ))}
          </section>
        )}

        <section className="topic-block topic-cta">
          <h2>{common('ctaTitle')}</h2>
          <p>{common('ctaText')}</p>
          <LangLink href="/contact/" className="btn1">
            {common('ctaButton')}
          </LangLink>
        </section>

        {related.length > 0 && (
          <section className="topic-block">
            <h2>{common('relatedTitle')}</h2>
            <ul className="topic-related">
              {related.map((r) => (
                <li key={r.href}>
                  <LangLink href={r.href}>{r.label} →</LangLink>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <ContactBubble />
    </div>
  );
}
