'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectDetails.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import Product from '../Products/Product';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom'; // Import Zoom plugin
import 'yet-another-react-lightbox/styles.css';
import ContactBubble from '../Contact/ContactBubble.js';
import '../Products/Products.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import LangLink from '../LangLink';

// Paragraphs are separated by an empty line (same rule as the news articles).
const toParagraphs = (text) =>
  String(text || '')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

// project: from the admin panel, read at build time (src/util/projects-data.js), already in
// the page's language, with its materials as product cards.
export default function ProjectDetails({ project }) {
  const router = useRouter();
  const lang = useLang();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  if (!project) {
    return <div className="error-message">{t('projects.projectNotFound')}</div>;
  }

  const images = project.images || [];
  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));
  const paragraphs = toParagraphs(project.description);

  return (
    <div className="project-details-page">
      <div className="breadcrumb">
        <LangLink href="/">{t('projects.breadcrumbHome')}</LangLink>
        <p>
          {'>'} {t('projects.breadcrumbExplore')}
        </p>
        <LangLink href="/projects/">
          {'>'} {t('projects.breadcrumbCurrent')}
        </LangLink>
        <p>
          {'>'} {project.name}
        </p>
      </div>
      <p className="project-hint">{t('projects.tapToView')}</p>
      <div className="project-details-container">
        <div className="project-details-left">
          {images.length > 0 ? (
            <Swiper
              key={images.length}
              pagination={{ clickable: true }}
              navigation
              modules={[Pagination, Navigation]}
              lazy={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="project-gallery-swiper"
            >
              {images.map((image, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => {
                    setIndex(index);
                    setOpen(true);
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <img
                    loading="lazy"
                    src={image.src}
                    alt={image.alt || `${project.name} ${index + 1}`}
                    className="project-image"
                  />
                  {hovered && (
                    <div className="image-overlay">
                      <p>{t('projects.clickToView')}</p>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              loading="lazy"
              src={project.thumbnail}
              alt={project.name}
              className="project-image"
            />
          )}
        </div>

        <div className="project-details-right">
          <h1 className="project-details-title">{project.name}</h1>
          <p className="project-details-description">
            {t('projects.location')}{' '}
            <strong>
              {project.city}
              {project.city ? ' - ' : ''}
              {project.country}
            </strong>
          </p>

          {paragraphs.length > 0 && (
            <div className="project-details-text">
              {paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          )}

          <p>{t('projects.materialSupplied')}</p>
          {project.materials.length > 0 ? (
            <div className="materials-supplied-container">
              {project.materials.map((product) => (
                <Product key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <p id="no-materials">{t('projects.noMaterials')}</p>
          )}

          <button
            className="btn1"
            onClick={() => router.push(`/${lang}/contact`)}
            style={{ width: '100%', marginTop: '2rem' }}
          >
            {t('projects.learnMore')}
          </button>
        </div>
      </div>
      <ContactBubble />

      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
}
