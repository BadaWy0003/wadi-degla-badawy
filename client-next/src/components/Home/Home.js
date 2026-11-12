'use client';
// Home page (redesigned 2026-11-10): dark + gold, the same family as the Contact page.
// All styles are in HomePage.css, scoped under .hp. Every text is an existing translation key
// (or a home.* key added with the redesign, in all 12 languages); the FAQPage JSON-LD stays in
// app/[lang]/page.js and needs every FAQ answer on the page (they are, inside <details>).
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import ContactBubble from '../Contact/ContactBubble.js';
import OurMarkets from '../Exports/OurMarkets.js';
import StatCounter from '../About/StatCounter';
import CertificateLightBox from '../Certificates/CertificateLightBox';
import { certificatesData } from '../Certificates/CertificatesData';
import { partnerLogos, PARTNER_NAMES } from '../Partners/Partners.js';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import '../Certificates/Certificates.css';
import './HomePage.css';

const ICONS = '/Assets/Icons';
// Partner and certificate logos with a transparent background (tools/make-transparent-logos.js),
// shown in one light colour and in colour on hover (HomePage.css).
const clearLogo = (src) =>
  `${ICONS}/logos-transparent/${src.split('/').pop().replace(/\.\w+$/, '')}.webp`;
const HERO = '/Assets/Media/Hero';
// Years since 1980, shown as a plain number (owner, 2026-11-11). Also in home.legacy45Years
// ("46 Years Shaping…") in all 12 translation files: update both each year.
const YEARS = 46;

// The four stone ranges, each linking to its topic page (same header photos as those pages).
const RANGES = [
  {
    href: '/egyptian-marble',
    label: 'home.rangeEgyptianMarbleLimestone', // the page lists both (owner, 2026-11-12)
    img: `${HERO}/stone-tile-egyptian-marble-2.webp`,
  },
  {
    href: '/egyptian-granite',
    label: 'visualizer.egyptianGranite',
    img: `${HERO}/stone-tile-egyptian-granite.webp`,
  },
  {
    href: '/imported-marble',
    label: 'visualizer.importedMarble',
    img: `${HERO}/stone-tile-imported-marble.webp`,
  },
  {
    href: '/imported-granite',
    label: 'visualizer.importedGranite',
    img: `${HERO}/stone-tile-imported-granite.webp`,
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
    <ul className="hp-showroom" ref={ref}>
      {stones.map((s, i) => (
        <li key={s.slug} className={i === active ? 'is-active' : ''}>
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

  return (
    <div className="hp">
      {/* 1. Hero: who we are, the main action (WhatsApp) and proof at a glance */}
      <section className="hp-hero">
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
            <span className="hp-trust-value">14</span>
            <span>{t('home.trustQuarries')}</span>
          </li>
          <li className="hp-trust-factories">
            <span className="hp-trust-value">3</span>
            <span>{t('home.trustFactories')}</span>
          </li>
          <li className="hp-trust-countries">
            <StatCounter end={31} suffix="+" className="hp-trust-value" />
            <span>{t('home.trustCountries')}</span>
          </li>
          <li className="hp-trust-iso">
            <span className="hp-trust-value">ISO 9001:2015</span>
            <span>{t('home.trustIso')}</span>
          </li>
          <li className="hp-trust-production">
            <StatCounter end={3000} suffix="" className="hp-trust-value" />
            <span>{counters('productionTitle')}</span>
          </li>
        </ul>
      </section>

      {/* 2. The four ranges, straight to their pages */}
      <section className="hp-section">
        <div className="hp-head">
          <h2>{t('home.chooseStone')}</h2>
          <p>{t('home.chooseStoneDesc')}</p>
        </div>
        <ul className="hp-ranges">
          {RANGES.map((r) => (
            <li key={r.href}>
              <LangLink href={r.href} className="hp-range">
                <img loading="lazy" src={r.img} alt={t(r.label)} />
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
        <div className="hp-head">
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
        <div className="hp-about-text">
          <h2>{t('home.legacy45Years')}</h2>
          <p>{t('home.legacyDescription')}</p>
          <LangLink href="/about" className="hp-btn hp-btn-ghost">
            {t('home.aboutWadiDegla')}
          </LangLink>
        </div>
        <div className="hp-about-cards">
          <div className="hp-card">
            <img
              loading="lazy"
              src={`${ICONS}/paper-plane-gold.svg`}
              alt={t('about.visionIconAlt')}
            />
            <h3>{t('about.visionTitle')}</h3>
            <p>{t('about.visionText')}</p>
          </div>
          <div className="hp-card">
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
          <h2 className="hp-band-title">{counters('sectionTitle')}</h2>
          <ul className="hp-stats">
            {[
              [YEARS, 'experienceTitle', ''],
              [500, 'manpowerTitle', '+'],
              [3000, 'productionTitle', '+'],
              [300, 'projectsTitle', '+'],
            ].map(([n, key, plus]) => (
              <li key={key}>
                <StatCounter end={n} suffix={plus} className="hp-stat-value" />
                <span>{counters(key)}</span>
              </li>
            ))}
          </ul>
          <h2 className="hp-band-title">{counters('sectionTitle2')}</h2>
          <ul className="hp-why">
            {[
              ['technology.svg', 'technology'],
              ['craftsmanship.png', 'craftsmanship'],
              ['global-supply-chain.svg', 'supplyChain'],
            ].map(([icon, key]) => (
              <li key={key}>
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
          className="hp-split-img"
          src={`${HERO}/quarries-home-card.webp`}
          alt={t('home.globalQuarriesAlt')}
        />
        <div>
          <p className="hp-eyebrow">{t('home.globalQuarriesTitle')}</p>
          <h2>{t('home.globalQuarries')}</h2>
          <p>{t('home.globalQuarriesDesc')}</p>
          <LangLink href="/quarries" className="hp-btn hp-btn-ghost">
            {t('home.learnMore')}
          </LangLink>
        </div>
      </section>

      {/* 7. Explore: projects, inspiration, visualizer */}
      <section className="hp-section">
        <ul className="hp-explore">
          {[
            [
              '/projects',
              'projects-hero-card',
              'projectsAlt',
              'experienceWork',
              null,
              'experienceWorkDesc',
              'viewProjects',
            ],
            [
              '/inspiration',
              'inspo-home-hero-card',
              'inspirationAlt',
              'inspiration',
              'inspirationTitle',
              'inspirationDesc',
              'browseInspiration',
            ],
            [
              '/visualizer',
              'visualizer-home-card',
              'visualizerAlt',
              'bringVisionToLife',
              null,
              'bringVisionToLifeDesc',
              'tryNow',
            ],
          ].map(([href, img, alt, title, eyebrow, desc, cta]) => (
            <li key={href}>
              <LangLink href={href} className="hp-explore-card">
                <img loading="lazy" src={`${HERO}/${img}.webp`} alt={t(`home.${alt}`)} />
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
            {t('home.learnMore')}
          </LangLink>
        </div>
      </section>

      {/* 9. Trusted by: partners and certificates, logos on light tiles */}
      <section className="hp-section hp-trusted">
        <div className="hp-head">
          <h2>{t('home.partnersClients')}</h2>
          <p>{t('home.partnersDescription')}</p>
        </div>
        <ul className="hp-logos">
          {partnerLogos.map((logo, i) => (
            <li key={logo}>
              <img
                loading="lazy"
                src={clearLogo(logo)}
                alt={
                  PARTNER_NAMES[i]
                    ? `${PARTNER_NAMES[i]} – ${t('home.partnersAlt')}`
                    : t('home.partnersAlt')
                }
              />
            </li>
          ))}
        </ul>
        <div className="hp-head hp-head-tight">
          <h2>{t('home.certificates')}</h2>
          <p>{t('home.certificatesHintPc')}</p>
        </div>
        <ul className="hp-logos hp-certs">
          {certificatesData.map((c) => (
            <li key={c.thumbnail}>
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
        <div>
          <h2>{t('home.faqTitle')}</h2>
          <WhatsAppButton label={t('home.ctaWhatsapp')} className="hp-btn hp-btn-ghost" />
        </div>
        <div className="hp-faq-list">
          {faqs.map((f, i) => (
            <details key={i} open={i === 0}>
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
        <h2>{t('home.ctaBandTitle')}</h2>
        <p>{t('home.ctaBandText')}</p>
        <div className="hp-actions hp-center">
          <WhatsAppButton label={t('home.ctaWhatsapp')} />
          <LangLink href="/contact" className="hp-btn hp-btn-ghost">
            {t('home.ctaQuote')}
          </LangLink>
        </div>
      </section>

      <ContactBubble />
    </div>
  );
}
