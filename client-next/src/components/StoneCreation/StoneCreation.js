'use client';
import React, { useRef, useState } from 'react';
import './StoneCreationPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import useReveal from '../News/useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { ARCHITECTURE as architectureData, MOSAICS as mosaicsData } from './stoneCreationPhotos';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

// Stone Creations (redesigned 2026-11-12, design B "Showroom viewer"): header with numbers, then
// one viewer per range (architectural & landscaping elements, mosaics): a big stage with the
// chosen piece (photo, name, description, quote button), and a row of small pictures to pick
// another (the stage fades to it). Every piece's name and text is in the HTML (the others are
// only hidden), so Google reads all of them. Then "How custom orders work" and a WhatsApp band.

// "mosaics-hexagon-5x5-cm.webp" -> "5 × 5 cm"
const sizeOf = (src) => {
  const m = /(\d+)x(\d+)-cm/.exec(src);
  return m ? `${m[1]} × ${m[2]} cm` : '';
};
const STEPS = [1, 2, 3];

function Viewer({ id, items, t, showSize = false }) {
  const [active, setActive] = useState(0);
  const [openPhoto, zoom] = usePhotoZoom();
  const name = (item) => t(item.titleKey);
  const slides = items.map((item) => ({ src: item.image, alt: name(item) }));

  return (
    <div className="sc-viewer sc-reveal">
      <div className="sc-stage">
        <button
          type="button"
          className="sc-stage-photo"
          onClick={() => openPhoto(active)}
          aria-label={name(items[active])}
        >
          {items.map((item, i) => (
            <img
              key={item.image}
              src={item.image}
              alt={name(item)}
              className={i === active ? 'is-on' : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
              width={1080}
              height={608}
            />
          ))}
        </button>
        <div className="sc-stage-text">
          {items.map((item, i) => (
            <div
              key={item.image}
              className={`sc-info${i === active ? ' is-on' : ''}`}
              id={`${id}-${i}`}
              hidden={i !== active}
            >
              <p className="sc-eyebrow">
                {showSize && sizeOf(item.ownImage || item.image) ? (
                  <bdi>{sizeOf(item.ownImage || item.image)}</bdi>
                ) : (
                  <bdi>
                    {i + 1} / {items.length}
                  </bdi>
                )}
              </p>
              <h3>{name(item)}</h3>
              <p className="sc-text">{t(item.textKey)}</p>
              <div className="sc-actions">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="sc-btn">
                  <FaWhatsapp aria-hidden="true" /> {t('stoneCreation.quote')}
                </a>
                {item.link && (
                  <LangLink href={item.link.href} className="sc-more">
                    {t(item.link.labelKey)}
                  </LangLink>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className={`sc-picker${showSize ? ' sc-picker-sizes' : ''}`}>
        {items.map((item, i) => (
          <li key={item.image}>
            <button
              type="button"
              className={i === active ? 'is-on' : ''}
              aria-pressed={i === active}
              aria-controls={`${id}-${i}`}
              onClick={() => setActive(i)}
              title={name(item)}
            >
              <img src={item.image} alt="" loading="lazy" width={1080} height={608} />
              {showSize && (
                <span>
                  <bdi>{sizeOf(item.ownImage || item.image)}</bdi>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {zoom(slides)}
    </div>
  );
}

export default function StoneCreation() {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  useReveal(pageRef, [], 'sc');

  return (
    <div className="sc" ref={pageRef}>
      <div className="sc-hero wd-cover" style={coverStyle('stoneCreations')}>
        <CoverPreload page="stoneCreations" />
        <div className="sc-wrap">
          <div className="sc-crumb">
            <LangLink href="/">{t('stoneCreation.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="sc-crumb-here">{t('stoneCreation.breadcrumbCurrent')}</span>
          </div>
          <p className="sc-eyebrow">{t('stoneCreation.eyebrow')}</p>
          <h1>{t('stoneCreation.heroTitle')}</h1>
          <p className="sc-lead">{t('stoneCreation.intro')}</p>
          <dl className="sc-stats">
            <div>
              <dt>{t('stoneCreation.statElements')}</dt>
              <dd>{architectureData.length}</dd>
            </div>
            <div>
              <dt>{t('stoneCreation.statMosaics')}</dt>
              <dd>{mosaicsData.length}</dd>
            </div>
            <div>
              <dt>{t('stoneCreation.statCustomLabel')}</dt>
              <dd>{t('stoneCreation.statCustom')}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="sc-wrap">
        <section className="sc-section">
          <h2>{t('stoneCreation.landscapingTitle')}</h2>
          {String(t('stoneCreation.landscapingDescription'))
            .split('\n')
            .filter(Boolean)
            .map((p) => (
              <p className="sc-intro" key={p}>
                {p}
              </p>
            ))}
          <Viewer id="sc-arch" items={architectureData} t={t} />
        </section>

        <section className="sc-section">
          <h2>{t('stoneCreation.mosaicsTitle')}</h2>
          <p className="sc-intro">{t('stoneCreation.mosaicsDescription')}</p>
          <Viewer id="sc-mosaic" items={mosaicsData} t={t} showSize />
        </section>

        <section className="sc-section">
          <h2>{t('stoneCreation.howTitle')}</h2>
          <ol className="sc-how">
            {STEPS.map((n) => (
              <li key={n} className="sc-reveal">
                <span aria-hidden="true">0{n}</span>
                <h3>{t(`stoneCreation.how${n}Title`)}</h3>
                <p>{t(`stoneCreation.how${n}Text`)}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="sc-band">
        <div className="sc-wrap">
          <div>
            <h2>{t('stoneCreation.bandTitle')}</h2>
            <p>{t('stoneCreation.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="sc-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
