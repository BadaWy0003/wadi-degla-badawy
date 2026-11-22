'use client';
import React from 'react';
import './ExportsPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import OurMarkets from './OurMarkets';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import { WHATSAPP_URL } from '../Contact/contactData';
import { EXPORT_COUNTRIES_LABEL } from '../../util/company';
import { GALLERY, SHOWN, TEAM_PHOTO } from './exportsPhotos';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

// Exports (redesigned 2026-11-12, design A "Terms first"): header with numbers, the export
// terms a buyer asks first (the client's confirmed answers, same as the buying guide), what
// the export department handles, the shared Global Markets globe (OurMarkets, also on the
// home page), a grid of 9 loading photos (all 34 open in the zoom viewer) and a WhatsApp band.

const TERMS = ['MinOrder', 'Production', 'Shipping', 'Ports', 'Payment', 'Samples'];
const BULLETS = [1, 2, 3, 4, 5];
// "31+": the export-country number from the admin panel (src/util/company.js)
const EXPORT_COUNTRIES = EXPORT_COUNTRIES_LABEL;

export default function Exports() {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const altOf = (n, i) =>
    n ? t(`exports.gallery.galleryAlt${n}`) : `${t('exports.galleryTitle')} ${i + 1}`;
  const slides = GALLERY.map(([src, n], i) => ({ src, alt: altOf(n, i) }));
  // the team photo opens in the viewer at its place in the gallery, or on its own
  const teamIndex = slides.findIndex((sl) => sl.src === TEAM_PHOTO);
  const teamSlides =
    teamIndex >= 0 ? slides : [{ src: TEAM_PHOTO, alt: t('exports.departmentImageAlt') }, ...slides];

  return (
    <div className="ex">
      <div className="ex-hero wd-cover" style={coverStyle('exports')}>
        <CoverPreload page="exports" />
        <div className="ex-wrap">
          <div className="ex-crumb">
            <LangLink href="/">{t('exports.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="ex-crumb-here">{t('exports.breadcrumbCurrent')}</span>
          </div>
          <p className="ex-eyebrow">{t('exports.eyebrow')}</p>
          <h1>{t('exports.heroTitle')}</h1>
          <p className="ex-lead">{t('exports.departmentIntro')}</p>
          <dl className="ex-stats">
            <div>
              <dt>{t('exports.statCountries')}</dt>
              <dd>{EXPORT_COUNTRIES}</dd>
            </div>
            <div>
              <dt>{t('exports.statPorts')}</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>{t('exports.statSince')}</dt>
              <dd>1980</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="ex-wrap">
        <section className="ex-section">
          <h2>{t('exports.termsTitle')}</h2>
          <dl className="ex-terms">
            {TERMS.map((key) => (
              <div key={key}>
                <dt>{t(`exports.term${key}Label`)}</dt>
                <dd>
                  <strong>{t(`exports.term${key}Value`)}</strong>
                  <span>{t(`exports.term${key}Note`)}</span>
                </dd>
              </div>
            ))}
          </dl>
          <LangLink href="/buy-marble-from-egypt/" className="ex-link">
            {t('exports.buyGuideLink')}{' '}
            <span className="ex-arrow" aria-hidden="true">
              →
            </span>
          </LangLink>
        </section>

        <section className="ex-section ex-dept">
          <button
            type="button"
            className="ex-dept-img"
            onClick={() => openPhoto(Math.max(0, teamIndex))}
          >
            <img loading="lazy" src={TEAM_PHOTO} alt={t('exports.departmentImageAlt')} />
          </button>
          <div>
            <p className="ex-eyebrow">{t('exports.departmentTitle')}</p>
            <h2>{t('exports.deptHeading')}</h2>
            <p className="ex-text">{t('exports.departmentSupport')}</p>
            <ul className="ex-checks">
              {BULLETS.map((n) => (
                <li key={n}>{t(`exports.bulletPoint${n}`)}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="ex-markets">
        <OurMarkets />
      </div>

      <div className="ex-wrap">
        <section className="ex-section">
          <h2>{t('exports.galleryTitle')}</h2>
          <div className="ex-gallery">
            {GALLERY.slice(0, SHOWN).map(([src, n], i) => (
              <button
                type="button"
                key={src}
                className="ex-tile"
                onClick={() => openPhoto(i + (teamIndex >= 0 ? 0 : 1))}
                aria-label={altOf(n, i)}
              >
                <img loading="lazy" src={src} alt={altOf(n, i)} />
              </button>
            ))}
            <button type="button" className="ex-all" onClick={() => openPhoto(teamIndex >= 0 ? 0 : 1)}>
              {t('projects.allPhotos').replace('{{count}}', GALLERY.length)}
            </button>
          </div>
        </section>
      </div>

      <div className="ex-band">
        <div className="ex-wrap">
          <div>
            <h2>{t('exports.bandTitle')}</h2>
            <p>{t('exports.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ex-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(teamSlides)}
    </div>
  );
}
