'use client';
import React, { useState } from 'react';
import './ImageSection.css';
import '../Inspiration/Inspiration.css';
import usePhotoZoom from '../usePhotoZoom';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

export default function ImageSection({ sectionData }) {
  const { t } = useTranslation();
  const [openPhoto, zoom] = usePhotoZoom();
  const [hovered, setHovered] = useState(null);

  // Translated name (titleKey) when there is one, otherwise the plain title
  const slideTitle = (slide) => (slide.titleKey ? t(slide.titleKey) : slide.title);
  const slides = sectionData.map((item) => ({ src: item.image }));

  return (
    <>
      <div className="image-section-grid">
        {sectionData.map((slide, idx) => (
          <div
            key={idx}
            className="grid-item"
            onClick={() => openPhoto(idx)}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            <div className="image-section-image-wrapper">
              <img loading="lazy" src={slide.image} alt={slideTitle(slide)} />
              {hovered === idx && (
                <div className="image-overlay">
                  <p>{t('common.imageHint')}</p>
                </div>
              )}
            </div>
            <div className="image-section-text-wrapper">
              <h3>{slideTitle(slide)}</h3>
              <p>{slide.textKey ? t(slide.textKey) : slide.text}</p>
              {slide.link && (
                <LangLink
                  href={slide.link.href}
                  className="image-section-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t(slide.link.labelKey)}
                </LangLink>
              )}
            </div>
          </div>
        ))}
      </div>
      {zoom(slides)}
    </>
  );
}
