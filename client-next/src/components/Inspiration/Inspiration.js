'use client';
import React, { useRef } from 'react';
import './InspirationPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { INSPIRATION_PHOTOS } from './inspirationPhotos';
// two fixed pictures in "Turn an idea into a project"
import { interiorImageData } from './InspirationImageData';

// Inspiration (redesigned 2026-11-12, design B "Lookbook"): header with numbers, then one
// chapter per style (interior, exterior, classic & monumental: a big photo with the text and
// uses over it, then a row of its photos to swipe or scroll with the arrows; any photo opens that
// style's photos in the zoom viewer), "Turn an idea into a project" (visualizer, all stones),
// why Wadi Degla, and a WhatsApp band. The big photos settle in slowly when scrolled to.
// stoneCount: the stones on the site, counted at build time (app/[lang]/inspiration/page.js).
const CHAPTERS = [
  {
    id: 'interior',
    photos: INSPIRATION_PHOTOS.interiorPhotos,
    cover: 0, // the big photo = the first of the list (inspirationPhotos.js)
    uses: 'inspiration.interiorApplicationsList',
  },
  {
    id: 'exterior',
    photos: INSPIRATION_PHOTOS.exteriorPhotos,
    cover: 0,
    uses: 'inspiration.exteriorApplicationsList',
  },
  { id: 'ancient', photos: INSPIRATION_PHOTOS.ancientPhotos, cover: 0 },
];
const TOTAL = CHAPTERS.reduce((n, c) => n + c.photos.length, 0);

const lines = (text) =>
  String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

function Chapter({ chapter, t }) {
  const [openPhoto, zoom] = usePhotoZoom();
  const rowRef = useRef(null);
  const title = t(`inspiration.${chapter.id}Subtitle`);
  const alt = (i) => `${title} – ${i + 1}`;
  const slides = chapter.photos.map((src, i) => ({ src, alt: alt(i) }));
  // the row shows every photo except the cover, which is already shown big
  const row = chapter.photos.map((src, i) => [src, i]).filter(([, i]) => i !== chapter.cover);

  // arrows move the row by about one screen of photos (direction follows the page in RTL)
  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === 'rtl';
    el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="ins-chapter" id={`ins-${chapter.id}`}>
      <div className="ins-feature ins-reveal">
        <button
          type="button"
          className="ins-feature-photo"
          onClick={() => openPhoto(chapter.cover)}
          aria-label={alt(chapter.cover)}
        >
          <img src={chapter.photos[chapter.cover]} alt={alt(chapter.cover)} loading="lazy" />
        </button>
        <div className="ins-feature-text">
          <p className="ins-eyebrow">
            {t(`inspiration.${chapter.id}Title`)} ·{' '}
            {t('inspiration.ideasCount').replace('{{count}}', chapter.photos.length)}
          </p>
          <h2>{title}</h2>
          <p className="ins-text">{t(`inspiration.${chapter.id}Description`)}</p>
          {chapter.uses && (
            <ul className="ins-uses" aria-label={t(`inspiration.${chapter.id}ApplicationsTitle`)}>
              {lines(t(chapter.uses)).map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="ins-row-wrap">
        <div className="ins-row" ref={rowRef}>
          {row.map(([src, i]) => (
            <button
              type="button"
              key={src}
              className="ins-photo"
              onClick={() => openPhoto(i)}
              aria-label={alt(i)}
            >
              <img src={src} alt={alt(i)} loading="lazy" />
            </button>
          ))}
        </div>
        <div className="ins-arrows">
          <button type="button" onClick={() => scroll(-1)} aria-label={t('inspiration.prev')}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={t('inspiration.next')}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      {zoom(slides)}
    </section>
  );
}

export default function Inspiration({ stoneCount = 0 }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  useReveal(pageRef, [], 'ins');

  return (
    <div className="ins" ref={pageRef}>
      <div className="ins-hero">
        <div className="ins-wrap">
          <div className="ins-crumb">
            <LangLink href="/">{t('inspiration.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="ins-crumb-here">{t('inspiration.breadcrumbCurrent')}</span>
          </div>
          <p className="ins-eyebrow">{t('inspiration.eyebrow')}</p>
          <h1>{t('inspiration.heroTitle')}</h1>
          <p className="ins-lead">{t('inspiration.intro')}</p>
          <dl className="ins-stats">
            <div>
              <dt>{t('inspiration.statIdeas')}</dt>
              <dd>{TOTAL}</dd>
            </div>
            <div>
              <dt>{t('inspiration.statStyles')}</dt>
              <dd>{CHAPTERS.length}</dd>
            </div>
            {stoneCount > 0 && (
              <div>
                <dt>{t('inspiration.statStones')}</dt>
                <dd>{stoneCount}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="ins-wrap">
        {CHAPTERS.map((c) => (
          <Chapter chapter={c} t={t} key={c.id} />
        ))}

        <section className="ins-section">
          <h2>{t('inspiration.ideaTitle')}</h2>
          <div className="ins-next">
            <LangLink href="/visualizer" className="ins-next-card ins-reveal">
              <img src={interiorImageData[13]} alt="" loading="lazy" />
              <span>
                <b>{t('inspiration.visualizerTitle')}</b>
                <small>{t('inspiration.visualizerText')}</small>
                <em>
                  {t('inspiration.visualizerLink')}{' '}
                  <span className="ins-arrow" aria-hidden="true">
                    →
                  </span>
                </em>
              </span>
            </LangLink>
            <LangLink href="/products" className="ins-next-card ins-reveal">
              <img src={interiorImageData[6]} alt="" loading="lazy" />
              <span>
                <b>
                  {stoneCount > 0
                    ? t('inspiration.stonesTitle').replace('{{count}}', stoneCount)
                    : t('inspiration.stonesTitleNoCount')}
                </b>
                <small>{t('inspiration.stonesText')}</small>
                <em>
                  {t('inspiration.stonesLink')}{' '}
                  <span className="ins-arrow" aria-hidden="true">
                    →
                  </span>
                </em>
              </span>
            </LangLink>
          </div>
        </section>

        <section className="ins-section">
          <h2>{t('inspiration.whyChooseTitle')}</h2>
          <ul className="ins-why">
            {lines(t('inspiration.whyChooseList')).map((l) => (
              <li key={l} className="ins-reveal">
                <span aria-hidden="true">✦</span>
                {l}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ins-band">
        <div className="ins-wrap">
          <div>
            <h2>{t('inspiration.bandTitle')}</h2>
            <p>{t('inspiration.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ins-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
