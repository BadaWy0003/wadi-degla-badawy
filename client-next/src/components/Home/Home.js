'use client';
// Home page (redesigned 2026-11-10): dark + gold, the same family as the Contact page.
// All styles are in HomePage.css, scoped under .hp. Every text is an existing translation key
// (or a home.* key added with the redesign, in all 12 languages); the FAQPage JSON-LD stays in
// app/[lang]/page.js and needs every FAQ answer on the page (they are, inside <details>).
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import OurMarkets from '../Exports/OurMarkets.js';
import StatCounter from '../About/StatCounter';
import CertificateLightBox from '../Certificates/CertificateLightBox';
import { certificatesData } from '../Certificates/CertificatesData';
import { HOME_PARTNERS } from '../Partners/PartnersData';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import '../Certificates/Certificates.css';
import './HomePage.css';
import { COMPANY, YEARS } from '../../util/company';
import { HOME_PHOTOS, HOME_PHOTOS_DEFAULTS } from './homeData';
import useReveal from '../News/useReveal';

const ICONS = '/Assets/Icons';
// Partner and certificate logos with a transparent background (tools/make-transparent-logos.js),
// shown in one light colour and in colour on hover (HomePage.css).
const clearLogo = (src) =>
  `${ICONS}/logos-transparent/${src
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')}.webp`;
// The numbers come from the admin panel (src/util/company.js); the years count themselves.
// Photos and featured stones too (homeData.js); a replaced header photo is set as a CSS
// variable read by HomePage.css.
const heroStyle = Object.fromEntries(
  [
    ['--hp-hero-desktop', 'heroDesktop'],
    ['--hp-hero-phone', 'heroPhone'],
  ]
    .filter(([, k]) => HOME_PHOTOS[k].src !== HOME_PHOTOS_DEFAULTS[k].src)
    .map(([v, k]) => [v, `url("${HOME_PHOTOS[k].src.replace(/["\\]/g, '')}")`]),
);

// The website's own tile photos have a 380 px "-sm" copy for small screens; a photo uploaded in
// the admin panel has none (it is used as is).
const tileSrcSet = (p) =>
  p.src.startsWith('/Assets/Media/Hero/stone-tile-')
    ? `${p.src.replace(/\.webp$/, '-sm.webp')} 380w, ${p.src} ${p.width}w`
    : undefined;

// The four stone ranges, each linking to its topic page (same header photos as those pages).
const RANGES = [
  {
    href: '/egyptian-marble',
    label: 'home.rangeEgyptianMarbleLimestone', // the page lists both (owner, 2026-11-12)
    img: HOME_PHOTOS.tileEgyptianMarble.src,
    srcSet: tileSrcSet(HOME_PHOTOS.tileEgyptianMarble),
  },
  {
    href: '/egyptian-granite',
    label: 'visualizer.egyptianGranite',
    img: HOME_PHOTOS.tileEgyptianGranite.src,
    srcSet: tileSrcSet(HOME_PHOTOS.tileEgyptianGranite),
  },
  {
    href: '/imported-marble',
    label: 'visualizer.importedMarble',
    img: HOME_PHOTOS.tileImportedMarble.src,
    srcSet: tileSrcSet(HOME_PHOTOS.tileImportedMarble),
  },
  {
    href: '/imported-granite',
    label: 'visualizer.importedGranite',
    img: HOME_PHOTOS.tileImportedGranite.src,
    srcSet: tileSrcSet(HOME_PHOTOS.tileImportedGranite),
  },
];

// "→" that points the reading way (left in Arabic, see HomePage.css)
const Arrow = () => (
  <span className="hp-arrow" aria-hidden="true">
    →
  </span>
);

function WhatsAppButton({ label, className = 'hp-btn hp-btn-gold' }) {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={className}>
      <FaWhatsapp aria-hidden="true" />
      {label}
    </a>
  );
}

// "Showroom": the featured stones stand side by side like slabs in a showroom; the active one
// opens wide with its name and link. It moves on by itself every few seconds (like the old
// cube) until the visitor points at, taps or tabs to a slab. Phones: a swipeable row.
function Showroom({ stones, t }) {
  const [active, setActive] = useState(0);
  const touched = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (stones.length < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
      return undefined;
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)));
    if (ref.current) io.observe(ref.current);
    const timer = setInterval(() => {
      if (visible && !touched.current) setActive((i) => (i + 1) % stones.length);
    }, 3800);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [stones.length]);

  const pick = (i) => {
    touched.current = true;
    setActive(i);
  };

  return (
    <ul className="hp-showroom hp-reveal" ref={ref}>
      {stones.map((s, i) => (
        <li key={s.slug} className={i === active ? 'is-active' : ''} style={{ '--hp-i': i }}>
          <LangLink
            href={`/products/${s.slug}`}
            className="hp-slab"
            onMouseEnter={() => pick(i)}
            onFocus={() => pick(i)}
            onTouchStart={() => pick(i)}
          >
            <img
              loading="lazy"
              src={s.img}
              alt={`${s.name} – ${PRODUCT_TYPE_KEYS[s.type] ? t(PRODUCT_TYPE_KEYS[s.type]) : s.type}`}
            />
            <span className="hp-slab-label" aria-hidden="true">
              {s.name}
            </span>
            <span className="hp-slab-info">
              <span className="hp-slab-type">
                {PRODUCT_TYPE_KEYS[s.type] ? t(PRODUCT_TYPE_KEYS[s.type]) : s.type}
              </span>
              <h3>{s.name}</h3>
              <span className="hp-link">
                {t('home.moreDetails')}
                <Arrow />
              </span>
            </span>
          </LangLink>
        </li>
      ))}
    </ul>
  );
}

export default function Home({ featured = [] }) {
  const { t } = useTranslation();
  const counters = (key) => t(`about.counters.${key}`);
  const faqs = [1, 2, 3, 4, 5].map((n) => ({ q: t(`home.faqQ${n}`), a: t(`home.faqA${n}`) }));
  // Sections fade up once when scrolled to (classes hp-reveal / hp-hidden, HomePage.css);
  // --hp-i staggers the items of a row. Nothing is hidden in the HTML.
  const page = useRef(null);
  useReveal(page, [], 'hp');
  const step = (i) => ({ '--hp-i': i });

  return (
    <div className="hp" ref={page}>
      {/* 1. Hero: who we are, the main action (WhatsApp) and proof at a glance */}
      <section className="hp-hero" style={heroStyle}>
        <div className="hp-hero-inner">
          <h1 className="hero-heading hp-hero-title">
            <span className="hp-eyebrow">{t('home.companyName')}</span>
            <span className="hp-hero-headline">{t('home.heroHeadline')}</span>
          </h1>
          <p className="hp-hero-text">{t('home.heroWelcome')}</p>
          <div className="hp-actions">
            <WhatsAppButton label={t('home.ctaWhatsapp')} />
            <LangLink href="/products" className="hp-btn hp-btn-ghost">
              {t('home.ourProducts')}
            </LangLink>
            <LangLink href="/history" className="hp-text-link">
              {t('home.ourHistory')}
              <Arrow />
            </LangLink>
          </div>
        </div>
        <ul className="hp-trust">
          <li>
            <StatCounter end={YEARS} suffix="" className="hp-trust-value" />
            <span>{counters('experienceTitle')}</span>
          </li>
          <li className="hp-trust-quarries">
            <span className="hp-trust-value">{COMPANY.quarries}</span>
            <span>{t('home.trustQuarries')}</span>
          </li>
          <li className="hp-trust-factories">
            <span className="hp-trust-value">{COMPANY.factories}</span>
            <span>{t('home.trustFactories')}</span>
          </li>
          <li className="hp-trust-countries">
            <StatCounter end={COMPANY.exportCountries} suffix="+" className="hp-trust-value" />
            <span>{t('home.trustCountries')}</span>
          </li>
          <li className="hp-trust-iso">
            <span className="hp-trust-value">ISO 9001:2015</span>
            <span>{t('home.trustIso')}</span>
          </li>
          <li className="hp-trust-production">
            <StatCounter end={COMPANY.dailyCapacity} suffix="" className="hp-trust-value" />
            <span>{counters('productionTitle')}</span>
          </li>
        </ul>
      </section>

      {/* 2. The four ranges, straight to their pages */}
      <section className="hp-section">
        <div className="hp-head hp-reveal">
          <h2>{t('home.chooseStone')}</h2>
          <p>{t('home.chooseStoneDesc')}</p>
        </div>
        <ul className="hp-ranges">
          {RANGES.map((r, i) => (
            <li key={r.href} className="hp-reveal" style={step(i)}>
              <LangLink href={r.href} className="hp-range">
                <img
                  loading="lazy"
                  src={r.img}
                  srcSet={r.srcSet}
                  sizes="(max-width: 1024px) calc(50vw - 22px), 300px"
                  alt={t(r.label)}
                />
                <span className="hp-range-body">
                  <h3>{t(r.label)}</h3>
                  <span className="hp-link">
                    {t('home.explore')}
                    <Arrow />
                  </span>
                </span>
              </LangLink>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Featured stones: the showroom */}
      <section className="hp-section hp-featured">
        <div className="hp-head hp-reveal">
          <h2>{t('home.featuredProducts')}</h2>
          <p>{t('home.featuredProductsDesc')}</p>
          <p className="hp-hint">{t('home.featuredHint')}</p>
        </div>
        {featured.length > 0 && <Showroom stones={featured} t={t} />}
        <div className="hp-center">
          <LangLink href="/products" className="hp-btn hp-btn-ghost">
            {t('home.exploreAllProducts')}
          </LangLink>
        </div>
      </section>

      {/* 4. Who we are: legacy, vision, mission */}
      <section className="hp-section hp-about">
        <div className="hp-about-text hp-reveal">
          <h2>{t('home.legacy45Years')}</h2>
          <p>{t('home.legacyDescription')}</p>
          <LangLink href="/about" className="hp-btn hp-btn-ghost">
            {t('home.aboutWadiDegla')}
          </LangLink>
        </div>
        <div className="hp-about-cards">
          <div className="hp-card hp-reveal" style={step(1)}>
            <img
              loading="lazy"
              src={`${ICONS}/paper-plane-gold.svg`}
              alt={t('about.visionIconAlt')}
            />
            <h3>{t('about.visionTitle')}</h3>
            <p>{t('about.visionText')}</p>
          </div>
          <div className="hp-card hp-reveal" style={step(2)}>
            <img
              loading="lazy"
              src={`${ICONS}/bullseye-gold.svg`}
              alt={t('about.missionIconAlt')}
            />
            <h3>{t('about.missionTitle')}</h3>
            <p>{t('about.missionText')}</p>
          </div>
        </div>
      </section>

      {/* 5. Numbers and why us, in one band */}
      <section className="hp-band">
        <div className="hp-section">
          <h2 className="hp-band-title hp-reveal">{counters('sectionTitle')}</h2>
          <ul className="hp-stats">
            {[
              [YEARS, 'experienceTitle', ''],
              [COMPANY.workers, 'manpowerTitle', '+'],
              [COMPANY.dailyCapacity, 'productionTitle', '+'],
              [COMPANY.projects, 'projectsTitle', '+'],
            ].map(([n, key, plus], i) => (
              <li key={key} className="hp-reveal" style={step(i)}>
                <StatCounter end={n} suffix={plus} className="hp-stat-value" />
                <span>{counters(key)}</span>
              </li>
            ))}
          </ul>
          <h2 className="hp-band-title hp-reveal">{counters('sectionTitle2')}</h2>
          <ul className="hp-why">
            {[
              ['technology.svg', 'technology'],
              ['craftsmanship.png', 'craftsmanship'],
              ['global-supply-chain.svg', 'supplyChain'],
            ].map(([icon, key], i) => (
              <li key={key} className="hp-reveal" style={step(i)}>
                <img loading="lazy" src={`${ICONS}/${icon}`} alt={counters(`${key}IconAlt`)} />
                <h3>{counters(`${key}Title`)}</h3>
                <p>{counters(`${key}Text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Quarries & factories */}
      <section className="hp-section hp-split">
        <img
          loading="lazy"
          className="hp-split-img hp-reveal"
          src={HOME_PHOTOS.quarriesPhoto.src}
          alt={t('home.globalQuarriesAlt')}
        />
        <div className="hp-reveal" style={step(1)}>
          <p className="hp-eyebrow">{t('home.globalQuarriesTitle')}</p>
          <h2>{t('home.globalQuarries')}</h2>
          <p>{t('home.globalQuarriesDesc')}</p>
          <LangLink href="/quarries" className="hp-btn hp-btn-ghost">
            {t('home.quarriesLink')}
          </LangLink>
        </div>
      </section>

      {/* 7. Explore: projects, inspiration, visualizer */}
      <section className="hp-section">
        <ul className="hp-explore">
          {[
            [
              '/projects',
              HOME_PHOTOS.projectsPhoto.src,
              'projectsAlt',
              'experienceWork',
              null,
              'experienceWorkDesc',
              'viewProjects',
            ],
            [
              '/inspiration',
              HOME_PHOTOS.inspirationPhoto.src,
              'inspirationAlt',
              'inspiration',
              'inspirationTitle',
              'inspirationDesc',
              'browseInspiration',
            ],
            [
              '/visualizer',
              HOME_PHOTOS.visualizerPhoto.src,
              'visualizerAlt',
              'bringVisionToLife',
              null,
              'bringVisionToLifeDesc',
              'tryNow',
            ],
          ].map(([href, img, alt, title, eyebrow, desc, cta], i) => (
            <li key={href} className="hp-reveal" style={step(i)}>
              <LangLink href={href} className="hp-explore-card">
                <img loading="lazy" src={img} alt={t(`home.${alt}`)} />
                <span className="hp-explore-body">
                  {eyebrow && <span className="hp-eyebrow">{t(`home.${eyebrow}`)}</span>}
                  <h2>{t(`home.${title}`)}</h2>
                  <span className="hp-explore-desc">{t(`home.${desc}`)}</span>
                  <span className="hp-link">
                    {t(`home.${cta}`)}
                    <Arrow />
                  </span>
                </span>
              </LangLink>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Global markets (shared with the Exports page) */}
      <section className="hp-markets">
        <OurMarkets />
        <div className="hp-center">
          <LangLink href="/exports" className="hp-btn hp-btn-ghost">
            {t('home.exportsLink')}
          </LangLink>
        </div>
      </section>

      {/* 9. Trusted by: partners and certificates, logos on light tiles */}
      <section className="hp-section hp-trusted">
        <div className="hp-head hp-reveal">
          <h2>{t('home.partnersClients')}</h2>
          <p>{t('home.partnersDescription')}</p>
        </div>
        <ul className="hp-logos">
          {HOME_PARTNERS.map(({ logo, name }, i) => (
            <li key={logo} className="hp-reveal" style={step(i)}>
              <img loading="lazy" src={logo} alt={`${name} – ${t('home.partnersAlt')}`} />
            </li>
          ))}
        </ul>
        <div className="hp-head hp-head-tight hp-reveal">
          <h2>{t('home.certificates')}</h2>
          <p>{t('home.certificatesHintPc')}</p>
        </div>
        <ul className="hp-logos hp-certs">
          {certificatesData.map((c, i) => (
            <li key={c.thumbnail} className="hp-reveal" style={step(i)}>
              <CertificateLightBox
                thumbnail={clearLogo(c.thumbnail)}
                fullImage={c.image}
                width={c.thumbWidth}
                height={c.thumbHeight}
                altText={t('home.certificatesAlt')}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* 10. FAQ: every answer is in the HTML (FAQPage JSON-LD) */}
      <section className="hp-section hp-faq">
        <div className="hp-reveal">
          <h2>{t('home.faqTitle')}</h2>
          <WhatsAppButton label={t('home.ctaWhatsapp')} className="hp-btn hp-btn-ghost" />
        </div>
        <div className="hp-faq-list">
          {faqs.map((f, i) => (
            <details key={i} open={i === 0} className="hp-reveal" style={step(i)}>
              <summary>
                <h3>{f.q}</h3>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 11. Last call to action */}
      <section className="hp-section hp-cta">
        <h2 className="hp-reveal">{t('home.ctaBandTitle')}</h2>
        <p className="hp-reveal" style={step(1)}>
          {t('home.ctaBandText')}
        </p>
        <div className="hp-actions hp-center hp-reveal" style={step(2)}>
          <WhatsAppButton label={t('home.ctaWhatsapp')} />
          <LangLink href="/contact" className="hp-btn hp-btn-ghost">
            {t('home.ctaQuote')}
          </LangLink>
        </div>
      </section>

    </div>
  );
}
