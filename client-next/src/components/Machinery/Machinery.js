'use client';
import React, { useEffect, useRef, useState } from 'react';
import './MachineryPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import {
  GENERAL_USE as generalUseData,
  BLOCKS_STAGE as mngBlocksData,
  SLABS_STAGE as mngSlabsData,
  TILES_STAGE as mngTilesData,
} from './machineryPhotos';
import LangLink from '../LangLink';
import StatCounter from '../About/StatCounter';
import usePhotoZoom from '../usePhotoZoom';
import { WHATSAPP_URL } from '../Contact/contactData';
import { COUNTS } from './machineryCounts';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

// Machinery (redesigned 2026-11-12, design A "Production line"): header with counting numbers,
// "From block to tile" (4 stages joined by a line with a moving dot), then one section per
// stage with a card per machine (photo, ×count badge, name, description). Cards fade in when
// scrolled to; any photo opens all photos of that machine. No animation for visitors who ask
// their device for reduced motion. All texts and photos are in the static HTML: the fade-in
// only starts once the page's script runs (class "mc-anim" on the page).

// How many of each machine: machineryCounts.js (editable in the admin panel).
const TOTAL = Object.values(COUNTS).reduce((a, b) => a + b, 0);
const STAGES = [
  { id: 'blocks', data: mngBlocksData, caption: 'machinery.blocks.caption2' },
  { id: 'slabs', data: mngSlabsData, caption: 'machinery.slabs.caption' },
  { id: 'tiles', data: mngTilesData, caption: 'machinery.tiles.caption' },
  { id: 'moving', data: generalUseData, caption: 'machinery.generalUse.caption' },
];

// "9 Gangsaws", "ギャングソー 9台", "خط ... — عدد 1" -> the name without the number
const machineName = (text) =>
  String(text)
    .replace(/^\s*\d+\s*(台|条|대|개|本|본)?\s*/, '')
    .replace(/\s*[—–-]?\s*(عدد\s*)?\d+\s*(台|条|대|개|本|본)?\s*$/, '')
    .trim();

export default function Machinery({ children }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const [slides, setSlides] = useState([]);
  const pageRef = useRef(null);

  // cards fade in as they come on screen (only once the script runs)
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const items = [...page.querySelectorAll('.mc-reveal')].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    items.forEach((el) => el.classList.add('mc-hidden'));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('mc-hidden');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const open = (item, i) => {
    const name = machineName(t(item.titleKey));
    setSlides(item.images.map((src, n) => ({ src, alt: `${name} ${n + 1}` })));
    openPhoto(i);
  };

  return (
    <div className="mc" ref={pageRef}>
      <div className="mc-hero wd-cover" style={coverStyle('machinery')}>
        <CoverPreload page="machinery" />
        <div className="mc-wrap">
          <div className="mc-crumb">
            <LangLink href="/">{t('machinery.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="mc-crumb-here">{t('machinery.breadcrumbCurrent')}</span>
          </div>
          <p className="mc-eyebrow">{t('machinery.eyebrow')}</p>
          <h1>{t('machinery.pageHeading')}</h1>
          <p className="mc-lead">{String(t('machinery.intro')).replace(/\s*\n\s*/g, ' ')}</p>
          <dl className="mc-stats">
            <div>
              <dt>{t('machinery.statMachines')}</dt>
              <dd>
                <StatCounter end={TOTAL} suffix="" className="mc-num" />
              </dd>
            </div>
            <div>
              <dt>{machineName(t('machinery.blocks.gangsaws'))}</dt>
              <dd>
                <StatCounter end={COUNTS['machinery.blocks.gangsaws']} suffix="" className="mc-num" />
              </dd>
            </div>
            <div>
              <dt>{machineName(t('machinery.slabs.polishingLines'))}</dt>
              <dd>
                <StatCounter end={COUNTS['machinery.slabs.polishingLines']} suffix="" className="mc-num" />
              </dd>
            </div>
            <div>
              <dt>{t('machinery.statThickness')}</dt>
              <dd>
                <bdi>8 cm</bdi>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mc-wrap">
        <section className="mc-section">
          <h2>{t('machinery.flowTitle')}</h2>
          <div className="mc-flow-wrap">
            <span className="mc-flow-line" aria-hidden="true">
              <i />
            </span>
            <ol className="mc-flow">
            {STAGES.map((stage, i) => (
              <li key={stage.id}>
                <a href={`#mc-${stage.id}`} className="mc-node">
                  <span className="mc-node-n">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{t(`machinery.stage${i + 1}Title`)}</strong>
                  <small>{t(`machinery.stage${i + 1}Text`)}</small>
                </a>
              </li>
            ))}
            </ol>
          </div>
        </section>

        {STAGES.map((stage, i) => (
          <section className="mc-stage" id={`mc-${stage.id}`} key={stage.id}>
            <div className="mc-stage-head mc-reveal">
              <span className="mc-stage-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="mc-eyebrow">{t(`machinery.stage${i + 1}Title`)}</p>
                <h2>{t(`machinery.stage${i + 1}Text`)}</h2>
                <p className="mc-caption">{String(t(stage.caption)).replace(/\s*\n\s*/g, ' ')}</p>
              </div>
            </div>
            <div className="mc-cards">
              {stage.data.map((item) => {
                const name = machineName(t(item.titleKey));
                return (
                  <article className="mc-card mc-reveal" key={item.titleKey}>
                    <button
                      type="button"
                      className="mc-card-img"
                      onClick={() => open(item, 0)}
                      aria-label={name}
                    >
                      <img loading="lazy" src={item.images[0]} alt={name} />
                      <span className="mc-count">×{COUNTS[item.titleKey]}</span>
                      {item.images.length > 1 && (
                        <span className="mc-photos">
                          {t('projects.photosMany').replace('{{count}}', item.images.length)}
                        </span>
                      )}
                    </button>
                    <h3>{name}</h3>
                    <p>{t(item.descriptionKey)}</p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="mc-band">
        <div className="mc-wrap">
          <div>
            <h2>{t('machinery.bandTitle')}</h2>
            <p>{t('machinery.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mc-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
