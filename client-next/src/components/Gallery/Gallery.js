'use client';
import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import Zoom plugin
import "yet-another-react-lightbox/styles.css";
import apiClient from "../../util/client";
import ContactBubble from "../Contact/ContactBubble";
import "../Exports/Exports.css";
import "../MasonryGrid/MasonryGrid.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

export default function Gallery() {
  const { t } = useTranslation();
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const typeName = "Gallery";
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/api/storage/type/${typeName}`);
        setGallery(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error:", error);
        setGallery([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

    // Convert images array to Lightbox format
    const slides = gallery
    .map((item) =>
      item.finishes && item.finishes[0]?.link ? { src: item.finishes[0].link } : null
    )
    .filter(Boolean);


  return (
    <>
    
    <div className="gallery-container">
          <div className="gallery-intro">
            <h1>{t('gallery.heroTitle')}</h1>
          </div>

          <div className="breadcrumb">
          <LangLink href="/">{t('gallery.breadcrumbHome')}</LangLink>
          <p>{'>'} {t('gallery.breadcrumbCurrent')}</p>
          </div>

          <div className="gallery-intro">
            <p>{t('gallery.heroSubtitle')}</p>
          </div>
      {/* Masonry Grid Gallery */}
      <div className="masonry-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
        <div className="masonry-grid">
          {slides.map((slide, i) => (
            <div key={i} className="masonry-item" onClick={() => { setIndex(i); setOpen(true); }}>
              <img loading="lazy" src={slide.src} alt={t('gallery.imageAlt', { number: i + 1 })} />
            </div>
          ))}
        </div>
        </>
      )}
      </div>
      
      {/* Lightbox Component */}
      <Lightbox 
        open={open} 
        close={() => setOpen(false)} 
        slides={slides} index={index} 
        plugins={[Zoom]} 
        zoom={{ maxZoomPixelRatio: 3 }} 
        />
      <ContactBubble />
    </div>
    </>
  );
}
