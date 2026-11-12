'use client';
import React from 'react';
import './PackingPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import { WHATSAPP_URL } from '../Contact/contactData';

// Packing (redesigned 2026-11-12, design A "Slabs + tiles cards"): header with numbers, the two
// slab methods and the two tile methods as cards (photo, label, the steps as a checklist),
// "Why our packing matters", a grid of 9 photos (all 31 open in the zoom viewer), the Related
// pages links (children) and a WhatsApp band.

const P = (n) => `/Assets/Media/Packing/packing${n}.webp`;
const E = (n) => `/Assets/Media/Exports/exports${n}.webp`;
// [photo, number of its packing.packingAlt<N> text]
const PHOTOS = [
  [P(16), 16],
  [P(3), 3],
  [P(7), 7],
  [E(26), 22],
  [P(12), 12],
  [E(29), 25],
  [P(15), 15],
  [E(31), 27],
  [P(13), 13],
  ...[1, 2, 4, 5, 6, 8, 9, 10, 11, 14, 17].map((n) => [P(n), n]),
  ...[22, 23, 24, 25, 27, 28, 30, 32, 33, 34, 35].map((n) => [E(n), n - 4]),
];
const SHOWN = 9;
const GROUPS = [
  {
    id: 'slabs',
    title: 'packing.slabsTitle',
    methods: [
      { key: 'woodenBundle', photo: P(16), alt: 16 },
      { key: 'normalPacking', photo: P(10), alt: 10 },
    ],
  },
  {
    id: 'tiles',
    title: 'packing.tilesTitle',
    methods: [
      { key: 'woodenCrates', photo: E(24), alt: 20 },
      { key: 'woodenPallet', photo: P(9), alt: 9 },
    ],
  },
];
const BENEFITS = [1, 2, 3, 4, 5, 6];

const lines = (text) =>
  String(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

export default function Packing({ children }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const slides = PHOTOS.map(([src, n]) => ({ src, alt: t(`packing.packingAlt${n}`) }));
  const indexOf = (src) => Math.max(0, PHOTOS.findIndex(([s]) => s === src));

  return (
    <div className="pk">
      <div className="pk-hero">
        <div className="pk-wrap">
          <div className="pk-crumb">
            <LangLink href="/">{t('packing.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="pk-crumb-here">{t('packing.breadcrumbCurrent')}</span>
          </div>
          <p className="pk-eyebrow">{t('packing.eyebrow')}</p>
          <h1>{t('packing.heroTitle')}</h1>
          <p className="pk-lead">{t('packing.intro')}</p>
          <dl className="pk-stats">
            <div>
              <dt>{t('packing.statBundle')}</dt>
              <dd>
                <bdi>8–15</bdi>
              </dd>
            </div>
            <div>
              <dt>{t('packing.statMethods')}</dt>
              <dd>4</dd>
            </div>
            <div>
              <dt>{t('packing.statContainer')}</dt>
              <dd>
                <bdi>20 ft</bdi>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pk-wrap">
        {GROUPS.map((group) => (
          <section className="pk-section" key={group.id}>
            <p className="pk-eyebrow">{t(`packing.group_${group.id}`)}</p>
            <h2>{t(group.title)}</h2>
            <div className="pk-methods">
              {group.methods.map((m) => (
                <article className="pk-method" key={m.key}>
                  <button
                    type="button"
                    className="pk-method-img"
                    onClick={() => openPhoto(indexOf(m.photo))}
                    aria-label={t(`packing.${m.key}Title`)}
                  >
                    <img loading="lazy" src={m.photo} alt={t(`packing.packingAlt${m.alt}`)} />
                    <span className="pk-tag">{t(`packing.${m.key}Tag`)}</span>
                  </button>
                  <h3>{t(`packing.${m.key}Title`)}</h3>
                  <ul className="pk-checks">
                    {lines(t(`packing.${m.key}Text`)).map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="pk-section">
          <h2>{t('packing.whyMatterTitle')}</h2>
          <ul className="pk-benefits">
            {BENEFITS.map((n) => (
              <li key={n}>
                <span className="pk-tick" aria-hidden="true">
                  ✓
                </span>
                {t(`packing.benefit${n}`)}
              </li>
            ))}
          </ul>
        </section>

        <section className="pk-section">
          <h2>{t('packing.galleryTitle')}</h2>
          <div className="pk-gallery">
            {PHOTOS.slice(0, SHOWN).map(([src, n], i) => (
              <button
                type="button"
                key={src}
                className="pk-tile"
                onClick={() => openPhoto(i)}
                aria-label={t(`packing.packingAlt${n}`)}
              >
                <img loading="lazy" src={src} alt={t(`packing.packingAlt${n}`)} />
              </button>
            ))}
            <button type="button" className="pk-all" onClick={() => openPhoto(0)}>
              {t('projects.allPhotos').replace('{{count}}', PHOTOS.length)}
            </button>
          </div>
        </section>

        {/* the "Related pages" links (server component from the page) */}
        {children}
      </div>

      <div className="pk-band">
        <div className="pk-wrap">
          <div>
            <h2>{t('packing.ctaTitle')}</h2>
            <p>{t('packing.ctaDescription')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pk-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
