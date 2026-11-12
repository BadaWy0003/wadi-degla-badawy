'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import './ProjectsPage.css';
import usePhotoZoom from '../usePhotoZoom';
import LangLink from '../LangLink';
import ProjectCard from './ProjectCard';
import { WHATSAPP_URL } from '../Contact/contactData';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { productSlug } from '../../util/product-slugs';
import { cardImageProps } from '../../util/responsive-img';

// Paragraphs are separated by an empty line (same rule as the news articles).
const toParagraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

// Project page (redesigned 2026-11-12): title + facts, a photo grid (up to 5 photos; any photo
// or "All N photos" opens the full-screen viewer), the stones used (links to their pages), the
// description when written, more projects and a WhatsApp band.
// project: from the admin panel, read at build time (src/util/projects-data.js), already in
// the page's language. related: cards of other projects (same country first).
export default function ProjectDetails({ project, related = [], relatedSameCountry = false }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();

  if (!project) {
    return (
      <div className="pj">
        <div className="pj-wrap pj-missing">{t('projects.projectNotFound')}</div>
      </div>
    );
  }

  const images = project.images?.length
    ? project.images
    : project.thumbnail
      ? [{ src: project.thumbnail, alt: project.name }]
      : [];
  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));
  const paragraphs = toParagraphs(project.description);
  const place = [project.city, project.country].filter(Boolean).join(' · ');
  const tiles = images.slice(0, 5);

  return (
    <div className="pj pj-detail">
      <div className="pj-wrap">
        <div className="pj-crumb">
          <LangLink href="/">{t('projects.breadcrumbHome')}</LangLink>
          <span aria-hidden="true">›</span>
          <LangLink href="/projects/">{t('projects.breadcrumbCurrent')}</LangLink>
          <span aria-hidden="true">›</span>
          <span className="pj-crumb-here">{project.name}</span>
        </div>

        <div className="pj-head">
          <div>
            {project.country && <p className="pj-eyebrow">{project.country}</p>}
            <h1>{project.name}</h1>
          </div>
          <dl className="pj-facts">
            {place && (
              <div>
                <dt>{t('projects.factLocation')}</dt>
                <dd>{place}</dd>
              </div>
            )}
            <div>
              <dt>{t('projects.factStones')}</dt>
              <dd>{project.materials.length}</dd>
            </div>
            <div>
              <dt>{t('projects.factPhotos')}</dt>
              <dd>{images.length}</dd>
            </div>
          </dl>
        </div>

        {tiles.length > 0 && (
          <div className={`pj-gallery pj-gallery-${tiles.length}`}>
            {tiles.map((img, i) => (
              <button
                type="button"
                key={img.src + i}
                className="pj-tile"
                onClick={() => openPhoto(i)}
                aria-label={img.alt || `${project.name} ${i + 1}`}
              >
                <img
                  {...(i === 0
                    ? { fetchPriority: 'high', src: img.src }
                    : { loading: 'lazy', ...cardImageProps(img.src, '25vw') })}
                  alt={img.alt || `${project.name} ${i + 1}`}
                />
              </button>
            ))}
            {images.length > 1 && (
              <button type="button" className="pj-all" onClick={() => openPhoto(0)}>
                {t('projects.allPhotos').replace('{{count}}', images.length)}
              </button>
            )}
          </div>
        )}

        {paragraphs.length > 0 && (
          <section className="pj-section pj-text">
            {/* dir="auto": English text on the Arabic page keeps its punctuation */}
            {paragraphs.map((text, i) => (
              <p key={i} dir="auto">
                {text}
              </p>
            ))}
          </section>
        )}

        {project.materials.length > 0 && (
          <section className="pj-section">
            <h2>{t('projects.stonesTitle')}</h2>
            <div className="pj-stones">
              {project.materials.map((m) => {
                const photo = m.finishes[0];
                return (
                  <LangLink key={m.id} href={`/products/${productSlug(m.name)}`} className="pj-stone">
                    <span className="pj-stone-img">
                      {photo && (
                        <img loading="lazy" src={photo.thumb || photo.link} alt={m.name} />
                      )}
                    </span>
                    <span className="pj-stone-name">{m.name}</span>
                    {PRODUCT_TYPE_KEYS[m.type] && (
                      <span className="pj-stone-type">{t(PRODUCT_TYPE_KEYS[m.type])}</span>
                    )}
                  </LangLink>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="pj-section">
            <h2>
              {relatedSameCountry
                ? t('projects.moreIn').replace('{{country}}', project.country)
                : t('projects.moreProjects')}
            </h2>
            <div className="pj-grid">
              {related.map((p) => (
                <ProjectCard key={p.id} card={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pj-band">
        <div className="pj-wrap">
          <div>
            <h2>{t('projects.detailBandTitle')}</h2>
            <p>{t('projects.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pj-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>

      {zoom(slides)}
    </div>
  );
}
