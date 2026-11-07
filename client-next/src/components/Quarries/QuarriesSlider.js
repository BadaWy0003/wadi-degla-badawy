'use client';
// One photo slider of the Quarries page. Loaded by QuarriesSwiper only when it comes near the
// screen (Swiper is ~31 KB gzipped).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { cardImageProps } from '../../util/responsive-img';

export default function QuarriesSlider({ images, alt, onOpen }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  return (
    <Swiper
      autoplay={{
        delay: 2000,
        disableOnInteraction: false, // Continue autoplay after user interaction
        pauseOnMouseEnter: true,
      }}
      navigation
      loop={true}
      pagination={{ clickable: true }}
      slidesPerView={1}
      modules={[Navigation, Pagination, Autoplay]}
      className="quarries-slider"
      lazy={true}
    >
      {images.map((image, i) => (
        <SwiperSlide
          key={i}
          onClick={() => onOpen(i)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            loading="lazy"
            {...cardImageProps(image, '(max-width: 768px) 100vw, 800px')}
            alt={`${alt} ${i + 1}`.trim()}
            className="swiper-lazy"
          />
          <div className="swiper-lazy-preloader"></div>
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
