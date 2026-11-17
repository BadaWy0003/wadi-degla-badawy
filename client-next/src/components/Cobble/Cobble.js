'use client';
import React, { useRef } from 'react';
import './CobblePage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { EXPORT_COUNTRIES_LABEL } from '../../util/company';

// Cobbles (redesigned 2026-11-12, design A "Photo header + two surfaces"): photo header with the
// intro and numbers, the 4 benefits, "two surfaces, one stone" (natural split cobbles and flamed
// paving side by side), where flamed paving works best, technical & custom options, a gallery of
// all photos, the Related pages block (children, from the page) and a WhatsApp band.
const DIR = '/Assets/Media/Kerb-and-Cobbles/cobble';
const HERO = `${DIR}/cobble-hero.webp`;
const PHOTOS = ['cobble6', 'cobble7', 'cobble8', 'cobble1', 'cobble-hero'].map(
  (n) => `${DIR}/${n}.webp`,
);
// "31+": the export-country number from the admin panel (src/util/company.js)
const EXPORT_COUNTRIES = EXPORT_COUNTRIES_LABEL;
const BENEFIT_ICONS = ['◆', '≈', '✓', '▦'];

const lines = (text) =>
  String(text)
    .split('\n')
    .map((l) => l.trim().replace(/^-\s*/, ''))
    .filter(Boolean);

function Checks({ text }) {
  return (
    <ul className="co-checks">
      {lines(text).map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
  );
}

export default function Cobble({ children }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'co');
  const slides = PHOTOS.map((src, i) => ({ src, alt: `${t('cobbles.heroTitle')} ${i + 1}` }));

  return (
    <div className="co" ref={pageRef}>
      <div className="co-hero">
        <img className="co-hero-photo" src={HERO} alt="" fetchPriority="high" />
        <div className="co-wrap">
          <div className="co-crumb">
            <LangLink href="/">{t('cobbles.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="co-crumb-here">{t('cobbles.breadcrumbCurrent')}</span>
          </div>
          <p className="co-eyebrow">{t('cobbles.eyebrow')}</p>
          <h1>{t('cobbles.heroTitle')}</h1>
          <p className="co-lead">{t('cobbles.graniteText1')}</p>
          <dl className="co-stats">
            <div>
              <dt>{t('cobbles.statSurfaces')}</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>{t('cobbles.statSizesLabel')}</dt>
              <dd>{t('cobbles.statSizes')}</dd>
            </div>
            <div>
              <dt>{t('cobbles.statCountries')}</dt>
              <dd>
                <bdi>{EXPORT_COUNTRIES}</bdi>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="co-wrap">
        <section className="co-section">
          <h2>{t('cobbles.benefitsMainTitle')}</h2>
          <ul className="co-benefits">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="co-reveal">
                <span className="co-icon" aria-hidden="true">
                  {BENEFIT_ICONS[n - 1]}
                </span>
                <h3>{t(`cobbles.benefitsTitle${n}`)}</h3>
                <p>{t(`cobbles.benefitsText${n}`)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="co-section">
          <h2>{t('cobbles.surfacesTitle')}</h2>
          <div className="co-surfaces">
            <article className="co-surface co-reveal">
              <button type="button" className="co-surface-photo" onClick={() => openPhoto(1)}>
                <img src={PHOTOS[1]} alt={slides[1].alt} loading="lazy" />
              </button>
              <div className="co-surface-text">
                <p className="co-eyebrow">{t('cobbles.splitEyebrow')}</p>
                <h3 className="co-surface-title">{t('cobbles.sectionTitle')}</h3>
                <p className="co-text">{t('cobbles.graniteText2')}</p>
                <h4>{t('cobbles.applicationsTitle')}</h4>
                <p className="co-small">{t('cobbles.applicationsIntro')}</p>
                <Checks text={t('cobbles.applicationsList')} />
              </div>
            </article>
            <article className="co-surface co-reveal">
              <button type="button" className="co-surface-photo" onClick={() => openPhoto(2)}>
                <img src={PHOTOS[2]} alt={slides[2].alt} loading="lazy" />
              </button>
              <div className="co-surface-text">
                <p className="co-eyebrow">{t('cobbles.flamedEyebrow')}</p>
                <h3 className="co-surface-title">{t('cobbles.flamedTitle')}</h3>
                <p className="co-text">{t('cobbles.flamedIntro')}</p>
                <h4>{t('cobbles.flamedProcessTitle')}</h4>
                <p className="co-small">{t('cobbles.flamedProcessIntro')}</p>
                <Checks text={t('cobbles.flamedProcessList')} />
                <h4>{t('cobbles.flamedBenefitsTitle')}</h4>
                <Checks text={t('cobbles.flamedBenefitsList')} />
              </div>
            </article>
          </div>
        </section>

        <section className="co-section">
          <h2>{t('cobbles.bestApplicationsTitle')}</h2>
          <ul className="co-chips">
            {lines(t('cobbles.bestApplicationsList')).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>

        <section className="co-section">
          <div className="co-tech co-reveal">
            <div>
              <h2>{t('cobbles.technicalTitle')}</h2>
              <p className="co-text">{t('cobbles.technicalIntro')}</p>
              <p className="co-small co-compliance">{t('cobbles.technicalCompliance')}</p>
            </div>
            <ul className="co-options">
              {lines(t('cobbles.technicalOptions')).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="co-section">
          <h2>{t('cobbles.galleryTitle')}</h2>
          <div className="co-gallery">
            {PHOTOS.map((src, i) => (
              <button
                type="button"
                key={src}
                className="co-tile co-reveal"
                onClick={() => openPhoto(i)}
                aria-label={slides[i].alt}
              >
                <img src={src} alt={slides[i].alt} loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="co-band">
        <div className="co-wrap">
          <div>
            <h2>{t('cobbles.ctaTitle')}</h2>
            <p>{t('cobbles.ctaText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="co-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
      {zoom(slides)}
    </div>
  );
}
