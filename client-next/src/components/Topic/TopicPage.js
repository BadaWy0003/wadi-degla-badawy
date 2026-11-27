// A topic page ("Egyptian Marble", "Galala Marble", "How to Buy Marble from Egypt"…), rendered
// at build time (server component: its text is in the static HTML and isn't shipped again as
// JavaScript). Redesigned 2026-11-15 (owner chose design A "Reading guide"): photo header with
// the key export terms, then a sticky "On this page" list beside the content (steps as a
// timeline, sections, the stones of this topic live from the admin panel, projects that used
// them, questions & answers), a WhatsApp band and related pages. Scoped under .tp.
import LangLink from '../LangLink';
import { t } from '../../util/meta';
import { topicText, fillText } from '../../util/topic-content';
import { TOPIC_PAGES } from '../../util/topic-pages';
import { relatedLink } from '../../util/related-links';
import { finishLabel } from '../../util/finishes';
import { productSlug } from '../../util/product-slugs';
import { WHATSAPP_URL } from '../Contact/contactData';
import './TopicPage.css';
import HeroPreload from '../HeroPreload';
import { heroPhoneSrc } from '../../util/hero-images';
import { cardImageProps, stoneImgProps } from '../../util/responsive-img';
import TopicEnhance from './TopicEnhance';

const paragraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

function StoneGrid({ items, tr }) {
  return (
    <div className="tp-stones">
      {items.map((item) => {
        const photo = item.finishes?.[0];
        if (!photo) return null;
        return (
          <LangLink
            key={item.id}
            href={`/products/${productSlug(item.name)}`}
            className="tp-stone tp-reveal"
          >
            <span className="tp-stone-img">
              <img
                loading="lazy"
                {...stoneImgProps(photo, '(max-width: 768px) 45vw, 200px')}
                alt={`${item.name} - ${finishLabel(tr, photo.finish)}`}
              />
            </span>
            <span className="tp-stone-name">{item.name}</span>
          </LangLink>
        );
      })}
    </div>
  );
}

export default function TopicPage({
  lang,
  topicKey,
  products = [],
  alsoProducts = [],
  projects = [],
}) {
  const page = TOPIC_PAGES[topicKey];
  const tr = (key) => t(lang, key);
  const k = (path) => topicText(lang, `${topicKey}.${path}`);
  const common = (path) => topicText(lang, `common.${path}`);
  const heading = k('heading');
  const intro = paragraphs(k('intro'));
  const sections = k('sections') || [];
  const faq = k('faq') || [];
  const steps = k('steps') || [];
  const related = (page.related || []).map((key) => relatedLink(lang, key)).filter(Boolean);
  const productsTitle = fillText(common('productsTitle'), {
    topic: heading,
    count: products.length,
  });
  const alsoTitle = alsoProducts.length
    ? fillText(k('alsoTitle'), { count: alsoProducts.length })
    : '';
  const projectsTitle = fillText(common('projectsTitle'), { topic: heading });

  // "On this page": one link per block, in page order
  const toc = [
    steps.length > 0 && { id: 'tp-steps', label: k('stepsTitle') },
    ...sections.map((s, i) => ({ id: `tp-s${i}`, label: s.title })),
    products.length > 0 && { id: 'tp-stones', label: productsTitle },
    alsoProducts.length > 0 && { id: 'tp-also', label: alsoTitle },
    projects.length > 0 && { id: 'tp-projects', label: projectsTitle },
    faq.length > 0 && { id: 'tp-faq', label: common('faqTitle') },
    { id: 'tp-quote', label: common('ctaTitle') },
  ].filter(Boolean);

  return (
    <div className="tp">
      <HeroPreload src={page.hero} />
      <div
        className="tp-hero"
        style={{
          '--tp-hero': `url("${page.hero}")`,
          '--tp-hero-phone': `url("${heroPhoneSrc(page.hero)}")`,
        }}
      >
        <div className="tp-wrap">
          <div className="tp-crumb">
            <LangLink href="/">{common('breadcrumbHome')}</LangLink>
            {page.products && (
              <>
                <span aria-hidden="true">›</span>
                <LangLink href="/products/">{common('breadcrumbProducts')}</LangLink>
              </>
            )}
            <span aria-hidden="true">›</span>
            <span className="tp-crumb-here">{heading}</span>
          </div>
          <p className="tp-eyebrow">
            {page.products ? common('eyebrowStones') : common('eyebrowGuide')}
          </p>
          <h1>{heading}</h1>
          {intro[0] && <p className="tp-lead">{intro[0]}</p>}
        </div>
      </div>

      <div className="tp-wrap tp-body">
        <aside className="tp-toc" aria-label={common('onThisPage')}>
          <p className="tp-eyebrow">{common('onThisPage')}</p>
          <div className="tp-toc-links">
            {toc.map((item, i) => (
              <a key={item.id} href={`#${item.id}`} className={i === 0 ? 'is-on' : undefined}>
                {item.label}
              </a>
            ))}
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="tp-btn">
            {tr('productDetails.ctaPrice')}
          </a>
        </aside>

        <div className="tp-main">
          {intro.length > 1 && (
            <div className="tp-intro">
              {intro.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {steps.length > 0 && (
            <section className="tp-block" id="tp-steps">
              <h2>{k('stepsTitle')}</h2>
              <ol className="tp-steps">
                {steps.map((s, i) => (
                  <li key={i} className="tp-step tp-reveal">
                    <span className="tp-step-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3>{s.title}</h3>
                      {paragraphs(s.text).map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                    {page.stepPhotos?.[i] && (
                      <img
                        className="tp-step-img"
                        loading="lazy"
                        src={page.stepPhotos[i]}
                        alt={s.title}
                        width="440"
                        height="300"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {sections.map((s, i) => (
            <section className="tp-block tp-reveal" id={`tp-s${i}`} key={i}>
              <h2>{s.title}</h2>
              {paragraphs(s.text).map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}

          {products.length > 0 && (
            <section className="tp-block" id="tp-stones">
              <h2>{productsTitle}</h2>
              <StoneGrid items={products} tr={tr} />
            </section>
          )}

          {alsoProducts.length > 0 && (
            <section className="tp-block" id="tp-also">
              <h2>{alsoTitle}</h2>
              <StoneGrid items={alsoProducts} tr={tr} />
              {page.alsoLink && (
                <LangLink className="tp-more" href={`/${TOPIC_PAGES[page.alsoLink].slug}/`}>
                  {topicText(lang, `${page.alsoLink}.heading`)} <span aria-hidden="true">→</span>
                </LangLink>
              )}
            </section>
          )}

          {projects.length > 0 && (
            <section className="tp-block" id="tp-projects">
              <h2>{projectsTitle}</h2>
              <ul className="tp-projects">
                {projects.map((p) => (
                  <li key={p.id} className="tp-reveal">
                    <LangLink href={`/projects/${p.id}/`}>
                      <span className="tp-project-img">
                        <img loading="lazy" {...cardImageProps(p.thumbnail)} alt={p.name} />
                      </span>
                      <strong>{p.name}</strong>
                      <span>{[p.city, p.country].filter(Boolean).join(' · ')}</span>
                    </LangLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faq.length > 0 && (
            <section className="tp-block tp-faq" id="tp-faq">
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
        </div>
      </div>

      <section className="tp-wrap" id="tp-quote">
        <div className="tp-band">
          <div>
            <h2>{common('ctaTitle')}</h2>
            <p>{common('ctaText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="tp-btn">
            {tr('productDetails.ctaPrice')}
          </a>
          <LangLink href="/contact/" className="tp-btn tp-btn-line">
            {common('ctaButton')}
          </LangLink>
        </div>
      </section>

      {related.length > 0 && (
        <section className="tp-wrap tp-related">
          <h2 className="tp-eyebrow">{common('relatedTitle')}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.href}>
                <LangLink href={r.href}>
                  {r.label} <span aria-hidden="true">→</span>
                </LangLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      <TopicEnhance />
    </div>
  );
}
