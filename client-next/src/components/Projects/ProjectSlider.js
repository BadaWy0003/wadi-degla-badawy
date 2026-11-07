'use client';
// The photo slider of a project page. Loaded by ProjectDetails after the page shows (it sits
// at the top, so it starts right away, but its code, ~31 KB gzipped, is not in the first
// download).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

export default function ProjectSlider({ images, name, onOpen }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  return (
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
          onClick={() => onOpen(index)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            loading="lazy"
            src={image.src}
            alt={image.alt || `${name} ${index + 1}`}
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
  );
}
