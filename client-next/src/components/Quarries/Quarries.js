'use client';
import React from 'react';
import './QuarriesPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import {
  galalaQuarryImages,
  creamyQuarryImages,
  beigeSinaiPearlQuarryImages,
  firstFactoryImages,
  secondFactoryImages,
  thirdFactoryImages,
} from './QuarriesImageData';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import { cardImageProps } from '../../util/responsive-img';
import { productSlug } from '../../util/product-slugs';
import { WHATSAPP_URL } from '../Contact/contactData';

// Quarries & Factories (redesigned 2026-11-12, design A "Quarries + factory cards"): header
// with numbers, the 3 quarries (photo mosaic + text + checklist, alternating sides), the 3
// factories as cards, "From quarry to port" and a WhatsApp band. Any photo opens every photo
// of that quarry/factory in the zoom viewer. Texts: quarries.* (the long texts are an intro,
// then "- " lines shown as a checklist).

const QUARRIES = [
  { key: 'galala', images: galalaQuarryImages, stone: 'Galala' },
  { key: 'creamy', images: creamyQuarryImages, stone: 'Creamy White Pearl' },
  { key: 'beigeSinaiPearl', images: beigeSinaiPearlQuarryImages },
];
const FACTORIES = [
  { year: '2000', images: firstFactoryImages },
  { year: '2011', images: secondFactoryImages },
  { year: '2015', images: thirdFactoryImages },
];
// Same numbers as the home page's trust strip (Home.js).
const STATS = [
  ['14', 'statQuarries'],
  ['3', 'statFactories'],
  ['27,000 m²', 'statFactoryArea'],
  ['3,000 m²', 'statPerDay'],
];
const STEPS = [1, 2, 3, 4];

// "intro\n\nKey advantages:\n- one\n- two" -> { intro, points }
const splitText = (text) => {
  const intro = String(text).split(/\n\s*\n/)[0].trim();
  const points = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
  return { intro: intro.startsWith('- ') ? '' : intro, points };
};

function Checklist({ points }) {
  if (!points.length) return null;
  return (
    <ul className="qr-checks">
      {points.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

export default function Quarries({ children }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const [slides, setSlides] = React.useState([]);
  const photos = (images, label) => images.map((src, i) => ({ src, alt: `${label} ${i + 1}` }));
  const open = (images, label, i) => {
    setSlides(photos(images, label));
    openPhoto(i);
  };
  const photoCount = (n) =>
    n === 1 ? t('projects.photosOne') : t('projects.photosMany').replace('{{count}}', n);

  return (
    <div className="qr">
      <div className="qr-hero">
        <div className="qr-wrap">
          <div className="qr-crumb">
            <LangLink href="/">{t('quarries.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="qr-crumb-here">{t('quarries.breadcrumbCurrent')}</span>
          </div>
          <p className="qr-eyebrow">{t('quarries.eyebrow')}</p>
          <h1>{t('quarries.heroTitle')}</h1>
          <p className="qr-lead">{t('quarries.intro')}</p>
          <dl className="qr-stats">
            {STATS.map(([value, key]) => (
              <div key={key}>
                <dt>{t(`quarries.${key}`)}</dt>
                <dd>
                  <bdi>{value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="qr-wrap">
        <section className="qr-section">
          <p className="qr-eyebrow">{t('quarries.quarriesEyebrow')}</p>
          <h2>{t('quarries.quarriesHeading')}</h2>
          <div className="qr-quarries">
            {QUARRIES.map(({ key, images, stone }) => {
              const title = t(`quarries.${key}Title`);
              const { intro, points } = splitText(t(`quarries.${key}Text`));
              return (
                <article className="qr-quarry" key={key}>
                  <div className="qr-mosaic">
                    {images.slice(0, 3).map((src, i) => (
                      <button
                        type="button"
                        key={src}
                        className="qr-tile"
                        onClick={() => open(images, title, i)}
                        aria-label={`${title} ${i + 1}`}
                      >
                        <img
                          loading="lazy"
                          {...cardImageProps(src, i === 0 ? '(max-width: 768px) 100vw, 480px' : '240px')}
                          alt={`${title} ${i + 1}`}
                        />
                      </button>
                    ))}
                    {images.length > 1 && (
                      <button type="button" className="qr-all" onClick={() => open(images, title, 0)}>
                        {photoCount(images.length)}
                      </button>
                    )}
                  </div>
                  <div className="qr-text">
                    <h3>{title}</h3>
                    {intro && <p>{intro}</p>}
                    <Checklist points={points} />
                    {stone && (
                      <LangLink href={`/products/${productSlug(stone)}`} className="qr-link">
                        {t('quarries.seeStone').replace('{{name}}', stone)}{' '}
                        <span className="qr-arrow" aria-hidden="true">
                          →
                        </span>
                      </LangLink>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="qr-section">
          <p className="qr-eyebrow">{t('quarries.factoriesEyebrow')}</p>
          <h2>{t('quarries.factoriesHeading')}</h2>
          <div className="qr-factories">
            {FACTORIES.map(({ year, images }) => {
              const title = t(`quarries.factory${year}Title`);
              const { intro, points } = splitText(t(`quarries.factory${year}Text`));
              return (
                <article className="qr-factory" key={year}>
                  <button
                    type="button"
                    className="qr-factory-img"
                    onClick={() => open(images, title, 0)}
                    aria-label={title}
                  >
                    <img loading="lazy" {...cardImageProps(images[0])} alt={title} />
                    <span className="qr-year">{year}</span>
                    {images.length > 1 && <span className="qr-all">{photoCount(images.length)}</span>}
                  </button>
                  <h3>{title}</h3>
                  {intro && <p>{intro}</p>}
                  <Checklist points={points} />
                </article>
              );
            })}
          </div>
        </section>

        <section className="qr-section">
          <h2>{t('quarries.processTitle')}</h2>
          <ol className="qr-steps">
            {STEPS.map((n) => (
              <li key={n}>
                <span className="qr-step-n">{n}</span>
                <strong>{t(`quarries.step${n}Title`)}</strong>
                <span>{t(`quarries.step${n}Text`)}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="qr-band">
        <div className="qr-wrap">
          <div>
            <h2>{t('quarries.bandTitle')}</h2>
            <p>{t('quarries.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="qr-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
