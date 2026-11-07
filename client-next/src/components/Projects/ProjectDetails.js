'use client';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectDetails.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Product from '../Products/Product';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';
import usePhotoZoom from '../usePhotoZoom';
import ContactBubble from '../Contact/ContactBubble.js';
import '../Products/Products.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import LangLink from '../LangLink';

const loadSlider = () => import('./ProjectSlider');

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
  const sliderRef = useRef(null);
  const Slider = useLazyComponent(useNearScreen(sliderRef), loadSlider);
  const [openPhoto, zoom] = usePhotoZoom();

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
            Slider ? (
              <Slider images={images} name={project.name} onOpen={openPhoto} />
            ) : (
              // Until the slider code arrives: the same markup without Swiper (same size).
              <div className="swiper project-gallery-swiper" ref={sliderRef}>
                <div className="swiper-wrapper">
                  {images.map((image, index) => (
                    <div className="swiper-slide" key={index} onClick={() => openPhoto(index)}>
                      <img
                        loading={index === 0 ? undefined : 'lazy'}
                        src={image.src}
                        alt={image.alt || `${project.name} ${index + 1}`}
                        className="project-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
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
              {/* dir="auto": English text shown on the Arabic page (no Arabic written yet)
                  keeps its left-to-right punctuation */}
              {paragraphs.map((text, i) => (
                <p key={i} dir="auto">
                  {text}
                </p>
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

      {zoom(slides)}
    </div>
  );
}
