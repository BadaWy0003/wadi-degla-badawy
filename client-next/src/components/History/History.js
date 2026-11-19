'use client';
import React from 'react';
import './HistoryPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { ARCHIVE, TIMELINE } from './historyPhotos';
import { HISTORY_SIZES } from './historySizes';
import LangLink from '../LangLink';
import StatCounter from '../About/StatCounter';
import usePhotoZoom from '../usePhotoZoom';
import { WHATSAPP_URL } from '../Contact/contactData';
import { YEARS } from '../../util/company';

// History (redesigned 2026-11-12, design A "Timeline"): header with numbers, the family story
// as a dated timeline (1951 → today, with the three generations' photos), "A living legacy"
// (8 of the 29 archive photos; all open in the zoom viewer), "From Galala to the World" with
// the family's values, the Related pages links (children) and a WhatsApp band.
// YEARS: counted from the founding year (src/util/company.js).
// The photos come from historyPhotos.js (editable in the admin panel: Website → History → Photos).
const GALLERY_ALTS = [
  'history.thirdGenGalleryAlt1',
  'history.thirdGenGalleryAlt2',
  'history.thirdGenGalleryAlt3',
  'history.thirdGenGalleryAlt4',
];
const STEPS = [
  { year: '1951', title: 'history.tl1951Title', text: 'history.firstGenIntro' },
  {
    year: '1980',
    title: 'history.firstBreakthroughTitle',
    text: 'history.firstBreakthroughText',
    photo: TIMELINE.photo1980,
    alt: 'history.firstGenAlt',
  },
  {
    year: 'history.tlQuarriesYear',
    title: 'history.familyExpansionTitle',
    text: 'history.familyExpansionText',
  },
  {
    year: '2000',
    title: 'history.tl2000Title',
    text: 'history.secondGenText',
    photo: TIMELINE.photo2000,
    alt: 'history.secondGenAlt',
  },
  { year: '2011', title: 'history.tl2011Title', text: 'history.secondGenPartnershipText' },
  {
    year: 'history.tlToday',
    title: 'history.thirdGenTitle',
    text: 'history.thirdGenText',
    photo: TIMELINE.photoToday,
    alt: 'history.thirdGenAlt',
    // a photo added by the client after the 4th gets the step's title as its description
    gallery: TIMELINE.todayPhotos.map((p, i) => [p, GALLERY_ALTS[i] || 'history.thirdGenTitle']),
  },
];
const ARCHIVE_SHOWN = 8;

// Photos are shown whole (never cropped): their real width/height keep their space before
// they load, and --r (width / height) sizes them in the justified rows (see HistoryPage.css).
function photoProps(photo) {
  if (photo && typeof photo === 'object') {
    if (photo.width)
      return {
        width: photo.width,
        height: photo.height,
        style: { '--r': (photo.width / photo.height).toFixed(3) },
      };
    return photoProps(photo.src);
  }
  const src = photo;
  const size =
    HISTORY_SIZES[
      src
        .split('/')
        .pop()
        .replace(/\.webp$/, '')
    ];
  if (!size) return {};
  return { width: size[0], height: size[1], style: { '--r': (size[0] / size[1]).toFixed(3) } };
}

// A text with paragraphs (empty lines) and "•"/"-" lines -> paragraphs + a checklist
function RichText({ text }) {
  const blocks = String(text)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.map((block, i) => {
    const lines = block.split('\n').map((l) => l.trim());
    const points = lines.filter((l) => /^[•-]\s*/.test(l));
    if (!points.length) return <p key={i}>{block.replace(/\s*\n\s*/g, ' ')}</p>;
    const lead = lines.filter((l) => !/^[•-]\s*/.test(l)).join(' ');
    return (
      <React.Fragment key={i}>
        {lead && <p className="hi-lead-in">{lead}</p>}
        <ul className="hi-checks">
          {points.map((p) => (
            <li key={p}>{p.replace(/^[•-]\s*/, '')}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  });
}

export default function History({ children }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const slides = ARCHIVE.map(({ src }, i) => ({
    src,
    alt: `${t('history.legacyTitle')} ${i + 1}`,
  }));
  const tr = (key) => (key.startsWith('history.') ? t(key) : key);
  const values = String(t('history.finalText2'))
    .split('\n')
    .map((l) => l.replace(/^[•-]\s*/, '').trim())
    .filter(Boolean);

  return (
    <div className="hi">
      <div className="hi-hero">
        <div className="hi-wrap">
          <div className="hi-crumb">
            <LangLink href="/">{t('history.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="hi-crumb-here">{t('history.breadcrumbCurrent')}</span>
          </div>
          <p className="hi-eyebrow">{t('history.eyebrow')}</p>
          <h1>{t('history.pageHeading')}</h1>
          <p className="hi-lead">{t('history.intro')}</p>
          <dl className="hi-stats">
            <div>
              <dt>{t('history.statFounded')}</dt>
              <dd>
                {/* in the HTML as 1980; counts down from 2025 in the browser */}
                <StatCounter
                  from={2025}
                  end={1980}
                  separator={false}
                  suffix=""
                  className="hi-num"
                />
              </dd>
            </div>
            <div>
              <dt>{t('history.statGenerations')}</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>{t('history.statYears')}</dt>
              <dd>{YEARS}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="hi-wrap">
        <section className="hi-section">
          <h2>{t('history.visionTitle')}</h2>
          <ol className="hi-timeline">
            {STEPS.map((step) => (
              <li key={step.title}>
                <span className="hi-year">{tr(step.year)}</span>
                <div className={`hi-card${step.photo ? ' has-photo' : ''}`}>
                  <div className="hi-card-text">
                    <h3>{t(step.title)}</h3>
                    <RichText text={t(step.text)} />
                    {step.gallery && (
                      <div className="hi-mini">
                        {step.gallery.map(([p, alt], i) => (
                          <img
                            key={`${p.src}-${i}`}
                            loading="lazy"
                            src={p.src}
                            alt={t(alt)}
                            {...photoProps(p)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {step.photo && (
                    <img
                      className="hi-portrait"
                      loading="lazy"
                      src={step.photo.src}
                      alt={t(step.alt)}
                      {...photoProps(step.photo)}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="hi-section">
          <h2>{t('history.legacyTitle')}</h2>
          <p className="hi-text">{t('history.legacyIntroText')}</p>
          <p className="hi-text">{t('history.legacyText2')}</p>
          <div className="hi-archive">
            {ARCHIVE.slice(0, ARCHIVE_SHOWN).map(({ src, width, height }, i) => {
              // the size comes with the photo (uploads) or from historySizes.js
              const props = width
                ? { width, height, style: { '--r': (width / height).toFixed(3) } }
                : photoProps(src);
              return (
                <button
                  type="button"
                  key={src}
                  className="hi-tile"
                  style={props.style}
                  onClick={() => openPhoto(i)}
                  aria-label={`${t('history.legacyTitle')} ${i + 1}`}
                >
                  <img
                    loading="lazy"
                    src={src}
                    alt={`${t('history.legacyTitle')} ${i + 1}`}
                    width={props.width}
                    height={props.height}
                  />
                </button>
              );
            })}
          </div>
          <button type="button" className="hi-all" onClick={() => openPhoto(0)}>
            {t('projects.allPhotos').replace('{{count}}', ARCHIVE.length)}
          </button>
        </section>

        <section className="hi-section">
          <h2>{t('history.finalSectionTitle')}</h2>
          <p className="hi-text">{t('history.finalText1')}</p>
          <ul className="hi-chips">
            {values.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="hi-band">
        <div className="hi-wrap">
          <div>
            <h2>{t('history.bandTitle').replace('{{years}}', YEARS)}</h2>
            <p>{t('history.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hi-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
