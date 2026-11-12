'use client';
import React, { useRef, useState } from 'react';
import './PatternsPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';

// Patterns / pavers (redesigned 2026-11-12, design A "Pick a stone"): header with numbers, two
// "try the stone" scenes (pool deck with 4 paving stones, house front with 10 split-face stones:
// pick a sample and the scene fades to that stone), the 4 pattern photos, the Related pages
// block (children, from the page) and a WhatsApp band.
// The stones have no names yet ("Stone 1"...): add a `name` to a sample below when the client
// gives them.
const DIR = '/Assets/Media/Patterns';
const SCENES = [
  {
    id: 'pavers',
    title: 'patterns.paversTitle',
    eyebrow: 'patterns.paversEyebrow',
    samples: [1, 2, 3, 4].map((n) => ({
      swatch: `${DIR}/p${n}.webp`,
      scene: `${DIR}/pavers${n}.webp`,
    })),
    width: 918,
    height: 697,
  },
  {
    id: 'splitFace',
    title: 'patterns.splitFaceTitle',
    eyebrow: 'patterns.splitFaceEyebrow',
    samples: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
      swatch: `${DIR}/${n}.webp`,
      scene: `${DIR}/split-face-${n}.webp`,
    })),
    width: 946,
    height: 718,
  },
];
const PATTERNS = [1, 2, 3, 4].map((n) => `${DIR}/pattern${n}.webp`);

function Scene({ scene, t }) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [openPhoto, zoom] = usePhotoZoom();
  const label = (i) => scene.samples[i].name || t('patterns.stoneN', { number: i + 1 });
  const slides = scene.samples.map((s, i) => ({
    src: s.scene,
    alt: `${t(scene.title)} – ${label(i)}`,
  }));

  const pick = (i) => {
    if (i === current) return;
    setPrevious(current);
    setCurrent(i);
  };

  return (
    <div className="pt-scene pt-reveal">
      <button
        type="button"
        className="pt-scene-photo"
        onClick={() => openPhoto(current)}
        aria-label={slides[current].alt}
      >
        {/* the previous stone stays underneath while the new one fades in */}
        {previous !== null && (
          <img
            key={`prev-${previous}`}
            src={scene.samples[previous].scene}
            alt=""
            width={scene.width}
            height={scene.height}
            className="pt-under"
          />
        )}
        <img
          key={`cur-${current}`}
          src={scene.samples[current].scene}
          alt={slides[current].alt}
          width={scene.width}
          height={scene.height}
          className={previous !== null ? 'pt-fade' : ''}
          onAnimationEnd={() => setPrevious(null)}
          loading="lazy"
        />
        <span className="pt-badge">
          {t('patterns.stoneOf', { number: current + 1, count: scene.samples.length })}
        </span>
      </button>

      <div className="pt-side">
        <h3>{t('patterns.pickTitle')}</h3>
        <p>{t('patterns.selectMaterial')}</p>
        <ul className={`pt-swatches${scene.samples.length > 4 ? ' pt-swatches-many' : ''}`}>
          {scene.samples.map((s, i) => (
            <li key={s.swatch}>
              <button
                type="button"
                className={i === current ? 'is-on' : ''}
                aria-pressed={i === current}
                onClick={() => pick(i)}
                // load the scene photo before the click, so the change is instant
                onPointerEnter={() => {
                  const img = new Image();
                  img.src = s.scene;
                }}
              >
                <img src={s.swatch} alt="" loading="lazy" />
                <span>{label(i)}</span>
              </button>
            </li>
          ))}
        </ul>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pt-btn">
          <FaWhatsapp aria-hidden="true" /> {t('patterns.ask')}
        </a>
      </div>
      {zoom(slides)}
    </div>
  );
}

export default function Patterns({ children }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  useReveal(pageRef, [], 'pt');
  const patternSlides = PATTERNS.map((src, i) => ({
    src,
    alt: `${t('patterns.patternsTitle')} ${i + 1}`,
  }));

  return (
    <div className="pt" ref={pageRef}>
      <div className="pt-hero">
        <div className="pt-wrap">
          <div className="pt-crumb">
            <LangLink href="/">{t('patterns.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="pt-crumb-here">{t('patterns.breadcrumbCurrent')}</span>
          </div>
          <p className="pt-eyebrow">{t('patterns.eyebrow')}</p>
          <h1>{t('patterns.heroTitle')}</h1>
          <p className="pt-lead">{t('patterns.introText')}</p>
          <dl className="pt-stats">
            <div>
              <dt>{t('patterns.statPavers')}</dt>
              <dd>{SCENES[0].samples.length}</dd>
            </div>
            <div>
              <dt>{t('patterns.statSplitFace')}</dt>
              <dd>{SCENES[1].samples.length}</dd>
            </div>
            <div>
              <dt>{t('patterns.statPatterns')}</dt>
              <dd>{PATTERNS.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pt-wrap">
        {SCENES.map((scene) => (
          <section className="pt-section" key={scene.id}>
            <p className="pt-eyebrow">{t(scene.eyebrow)}</p>
            <h2>{t(scene.title)}</h2>
            <Scene scene={scene} t={t} />
          </section>
        ))}

        <section className="pt-section">
          <h2>{t('patterns.patternsTitle')}</h2>
          <p className="pt-intro">{t('patterns.patternsText')}</p>
          <div className="pt-patterns">
            {PATTERNS.map((src, i) => (
              <button
                type="button"
                key={src}
                className="pt-pattern pt-reveal"
                onClick={() => openPhoto(i)}
                aria-label={patternSlides[i].alt}
              >
                <img src={src} alt={patternSlides[i].alt} loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="pt-band">
        <div className="pt-wrap">
          <div>
            <h2>{t('patterns.bandTitle')}</h2>
            <p>{t('patterns.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pt-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
      {zoom(patternSlides)}
    </div>
  );
}
