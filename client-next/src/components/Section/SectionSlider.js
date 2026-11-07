'use client';
// The photo slider of a Section (patterns, cobbles, kerbstone pages). Loaded by Section only
// when it comes near the screen (Swiper is ~31 KB gzipped).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function SectionSlider({ images, altBase, onOpen }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      modules={[Pagination, Navigation, Autoplay]}
      pagination={{ clickable: true }}
      navigation
      grabCursor={true}
    >
      {images.map((image, idx) => (
        <SwiperSlide
          key={idx}
          onClick={() => onOpen(idx)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img loading="lazy" src={image} alt={`${altBase} ${idx + 1}`.trim()} />
          {hovered && (
            <div className="image-overlay">
              <p>{t('common.imageHint')}</p>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
