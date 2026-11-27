'use client';
// Fairs & Exhibitions page (redesigned 2026-11-16, owner chose design A "Passport"): header with
// the numbers (fairs, countries, continents, counted from FairsData.js) and one "stamp" per fair
// on a dotted route; then one chapter per fair (photo, flag + city, name, text, date) on
// alternating sides (Marmomac has 4 photos, the team meeting partners among them); why we go; questions & answers (also in the
// page's FAQPage JSON-LD); the Related pages block (children) and a WhatsApp band.
// Animations: the stamps press in one by one as the page opens (CSS) and the chapters fade up
// when scrolled to (the
// hiding class is added only after the page loads, so the HTML has everything; none with
// reduced motion). Scoped under .fa.
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';
import { WHATSAPP_URL } from '../Contact/contactData';
import useReveal from '../News/useReveal';
import usePhotoZoom from '../usePhotoZoom';
import { FAIRS, FAQ_KEYS } from './FairsData';
import './FairsPage.css';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

const WHY = ['Buyers', 'Trends', 'Tech', 'Partners'];

// The photo block's layout: 1 photo; 2 = the second overlaps the first; 3+ = a big first photo
// with the small ones under it (one row up to 4; 5+ in rows of 3, the last row filled; on
// phones 4+ small ones show two per row, an odd last one full width).
function photoClass(n) {
  const small = n - 1;
  const c = ['fa-photos'];
  if (n === 2) c.push('is-pair');
  if (n > 2) c.push('is-group');
  if (small >= 4) c.push('is-many', small % 2 ? 'is-odd' : '');
  if (small >= 5) c.push('is-rows', small % 3 ? `rest-${small % 3}` : '');
  return c.filter(Boolean).join(' ');
}

// "Italy" / "إيطاليا"… and "2026" / "April 2024" in the page's language
function useFormat(lang) {
  let regions = null;
  try {
    regions = new Intl.DisplayNames([lang], { type: 'region' });
  } catch {
    regions = null;
  }
  return {
    country: (code) => regions?.of(code) || code,
    date: (fair) =>
      fair.month
        ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long' }).format(
            new Date(Date.UTC(fair.year, fair.month - 1, 15)),
          )
        : String(fair.year),
  };
}

// texts: each fair's text in the page's language (by id), from the page (build time).
export default function Fairs({ children, texts = {} }) {
  const { t, i18n } = useTranslation();
  const pageRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'fa');
  const fmt = useFormat(i18n.language || 'en');

  const countries = new Set(FAIRS.map((f) => f.country)).size;
  const continents = new Set(FAIRS.map((f) => f.continent)).size;
  const place = (f) => (f.city ? `${f.city}, ${fmt.country(f.country)}` : fmt.country(f.country));
  const flag = (f) => (
    <img
      className="fa-flag"
      src={`/Assets/Icons/flags/${f.country.toLowerCase()}.svg`}
      alt=""
      width="22"
      height="16"
    />
  );

  // every photo, in page order, for the zoom viewer
  const slides = [
    ...FAIRS.flatMap((f) =>
      f.photos.map(([src]) => ({
        src,
        alt: t('fairs.photoAlt', { fair: f.name, place: place(f) }),
      })),
    ),
  ];
  let slide = 0;

  return (
    <div className="fa" ref={pageRef}>
      <div className="fa-hero wd-cover" style={coverStyle('fairs')}>
        <CoverPreload page="fairs" />
        <div className="fa-wrap">
          <div className="fa-crumb">
            <LangLink href="/">{t('fairs.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="fa-crumb-here">{t('fairs.breadcrumbCurrent')}</span>
          </div>
          <p className="fa-eyebrow">{t('fairs.eyebrow')}</p>
          <h1>{t('fairs.heading')}</h1>
          <p className="fa-lead">{t('fairs.intro')}</p>
          <dl className="fa-stats">
            <div>
              <dt>{t('fairs.statFairs')}</dt>
              <dd>{FAIRS.length}</dd>
            </div>
            <div>
              <dt>{t('fairs.statCountries')}</dt>
              <dd>{countries}</dd>
            </div>
            <div>
              <dt>{t('fairs.statContinents')}</dt>
              <dd>{continents}</dd>
            </div>
          </dl>

          <ol className="fa-route">
            {FAIRS.map((f, i) => (
              <li key={f.id} className="fa-stamp" style={{ '--i': i }}>
                <a href={`#fair-${f.id}`}>
                  <b>
                    <bdi>{f.name}</bdi>
                  </b>
                  <small>
                    {flag(f)} <bdi>{place(f)}</bdi>
                  </small>
                  <em>{fmt.date(f)}</em>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="fa-wrap">
        {FAIRS.map((f) => (
          <section className="fa-chapter fa-reveal" id={`fair-${f.id}`} key={f.id}>
            <div
              className={photoClass(f.photos.length)}
              style={f.photos.length > 2 ? { '--fa-n': f.photos.length - 1 } : undefined}
            >
              {f.photos.map(([src, w, h]) => {
                const index = slide++;
                return (
                  <button
                    type="button"
                    key={src}
                    className="fa-photo"
                    onClick={() => openPhoto(index)}
                    aria-label={t('fairs.photoAlt', { fair: f.name, place: place(f) })}
                  >
                    <img
                      loading="lazy"
                      src={src}
                      alt={t('fairs.photoAlt', { fair: f.name, place: place(f) })}
                      width={w}
                      height={h}
                    />
                  </button>
                );
              })}
            </div>
            <div className="fa-text">
              <span className="fa-place">
                {flag(f)} <bdi>{place(f)}</bdi>
              </span>
              <h2>
                <bdi>{f.name}</bdi>
              </h2>
              <p>{texts[f.id] ?? t(`fairs.items.${f.id}`)}</p>
              <p className="fa-when">{t('fairs.visited', { date: fmt.date(f) })}</p>
            </div>
          </section>
        ))}

        <section className="fa-section">
          <h2>{t('fairs.whyTitle')}</h2>
          <ol className="fa-why">
            {WHY.map((k, i) => (
              <li key={k} className="fa-reveal">
                <span className="fa-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{t(`fairs.why${k}Title`)}</h3>
                <p>{t(`fairs.why${k}Text`)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="fa-section fa-faq">
          <h2>{t('fairs.faqTitle')}</h2>
          {FAQ_KEYS.map((k, i) => (
            <details key={k} open={i === 0}>
              <summary>{t(`fairs.faq${k}Q`)}</summary>
              <p>{t(`fairs.faq${k}A`)}</p>
            </details>
          ))}
        </section>

        {children}

        <section className="fa-band">
          <div>
            <h2>{t('fairs.bandTitle')}</h2>
            <p>{t('fairs.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fa-btn">
            {t('fairs.bandCta')}
          </a>
        </section>
      </div>
      {zoom(slides)}
    </div>
  );
}
