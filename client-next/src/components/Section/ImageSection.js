'use client';
import React, { useState } from "react";
import "./ImageSection.css";
import "../Inspiration/Inspiration.css";
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'yet-another-react-lightbox/styles.css';
import { useTranslation } from 'react-i18next';

export default function ImageSection({ sectionData }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(null);

  const slides = sectionData.map((item) => ({ src: item.image }));

  return (
    <>
      <div className="image-section-grid">
        {sectionData.map((slide, idx) => (
          <div 
            key={idx} 
            className="grid-item"
            onClick={() => { setIndex(idx); setOpen(true); }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            <div className="image-section-image-wrapper">
              <img loading="lazy" src={slide.image} alt={`Slide ${idx + 1}`} />
              {hovered === idx && (
                <div className="image-overlay">
                  <p>{t('common.imageHint')}</p>
                </div>
              )}
            </div>
            <div className="image-section-text-wrapper">
              <h3>{slide.title}</h3>
              <p>{slide.textKey ? t(slide.textKey) : slide.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Component */}
      <Lightbox 
        open={open} 
        close={() => setOpen(false)} 
        slides={slides} 
        index={index}
        plugins={[Zoom]} 
        zoom={{ maxZoomPixelRatio: 3 }} 
      />
    </>
  );
}
