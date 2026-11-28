'use client';
import React, { useRef, useState } from 'react';
import './KerbstonePage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { sitePhoto } from '../../util/site-content';
import { PROFILES } from './kerbPhotos';

// Kerbstone (redesigned 2026-11-12, design A "Profile cards that flip"): photo header with the
// intro and numbers, the 6 kerb profiles as cards (photo, name, text, quote link; pointing at a
// card, or tapping its button, turns the photo over to show the profile's drawing), "sizes,
// finishes & materials", the Related pages block (children, from the page) and a WhatsApp band.
const DIR = '/Assets/Media/Kerb-and-Cobbles/kerb';
// the header photo can be replaced in the admin panel (Website → Kerbstones)
const HERO = sitePhoto('kerbstone', 'heroPhoto', `${DIR}/kerb-hero.webp`);
// each profile's photo and drawing (kerbPhotos.js, editable in the admin panel)

function ProfileCard({ profile, index, t, onZoom }) {
  const [flipped, setFlipped] = useState(false);
  const title = t(`kerbstone.${profile.key}.title`);
  return (
    <article
      className={`kb-card kb-reveal${flipped ? ' is-flipped' : ''}${profile.drawing ? ' has-drawing' : ''}`}
    >
      <div className="kb-flip">
        <button type="button" className="kb-face kb-front" onClick={() => onZoom(profile)}>
          <img src={profile.photo} alt={title} loading="lazy" />
        </button>
        {profile.drawing && (
          <button type="button" className="kb-face kb-back" onClick={() => onZoom(profile, true)}>
            <img
              src={profile.drawing}
              alt={`${title} – ${t('kerbstone.drawing')}`}
              loading="lazy"
            />
          </button>
        )}
        {profile.drawing && (
          <button
            type="button"
            className="kb-toggle"
            aria-pressed={flipped}
            onClick={() => setFlipped(!flipped)}
          >
            {flipped ? t('kerbstone.showPhoto') : t('kerbstone.showDrawing')}{' '}
            <span aria-hidden="true">⟲</span>
          </button>
        )}
      </div>
      <div className="kb-text">
        <p className="kb-num">
          <bdi>0{index + 1}</bdi>
        </p>
        <h3>{title}</h3>
        <p className="kb-desc">{t(`kerbstone.${profile.key}.text`)}</p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="kb-quote"
          data-wa={title}
        >
          {t('kerbstone.quote')}{' '}
          <span className="kb-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </article>
  );
}

export default function Kerbstone({ children }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'kb');

  // every photo and drawing in one viewer, in card order
  const slides = PROFILES.flatMap((p) => {
    const title = t(`kerbstone.${p.key}.title`);
    return [
      { src: p.photo, alt: title },
      ...(p.drawing ? [{ src: p.drawing, alt: `${title} – ${t('kerbstone.drawing')}` }] : []),
    ];
  });
  const zoomTo = (profile, drawing = false) =>
    openPhoto(
      Math.max(
        0,
        slides.findIndex((s) => s.src === (drawing ? profile.drawing : profile.photo)),
      ),
    );

  return (
    <div className="kb" ref={pageRef}>
      <div className="kb-hero">
        <img className="kb-hero-photo" src={HERO} alt={t('kerbstone.introTitle')} fetchPriority="high" />
        <div className="kb-wrap">
          <div className="kb-crumb">
            <LangLink href="/">{t('kerbstone.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="kb-crumb-here">{t('kerbstone.breadcrumbCurrent')}</span>
          </div>
          <p className="kb-eyebrow">{t('kerbstone.eyebrow')}</p>
          <h1>{t('kerbstone.introTitle')}</h1>
          <p className="kb-lead">{t('kerbstone.introText1')}</p>
          <dl className="kb-stats">
            <div>
              <dt>{t('kerbstone.statProfiles')}</dt>
              <dd>{PROFILES.length}</dd>
            </div>
            <div>
              <dt>{t('kerbstone.statStones')}</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>{t('kerbstone.statSizesLabel')}</dt>
              <dd>{t('kerbstone.statSizes')}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="kb-wrap">
        <section className="kb-section">
          <p className="kb-eyebrow">{t('kerbstone.profilesHint')}</p>
          <h2>{t('kerbstone.profilesTitle')}</h2>
          <p className="kb-intro">{t('kerbstone.introText2')}</p>
          <div className="kb-cards">
            {PROFILES.map((p, i) => (
              <ProfileCard key={p.key} profile={p} index={i} t={t} onZoom={zoomTo} />
            ))}
          </div>
        </section>

        <section className="kb-section">
          <div className="kb-sizes kb-reveal">
            <img src={`${DIR}/kerb-bg.webp`} alt={t('kerbstone.introImageAlt')} loading="lazy" />
            <div>
              <h2>{t('kerbstone.finalTitle')}</h2>
              <p className="kb-text-p">{t('kerbstone.finalText1')}</p>
              <p className="kb-text-p">{t('kerbstone.finalText2')}</p>
              <p className="kb-text-p">{t('kerbstone.finalText3')}</p>
            </div>
          </div>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="kb-band">
        <div className="kb-wrap">
          <div>
            <h2>{t('kerbstone.bandTitle')}</h2>
            <p>{t('kerbstone.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="kb-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
      {zoom(slides)}
    </div>
  );
}
