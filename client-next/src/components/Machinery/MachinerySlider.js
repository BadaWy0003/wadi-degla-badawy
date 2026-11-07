'use client';
// One photo slider of the Machinery page. Loaded by MachinerySwiper only when it comes near the
// screen (Swiper is ~31 KB gzipped).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

export default function MachinerySlider({ images, title, onOpen }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  return (
    <Swiper
      autoplay={{
        delay: 4000, // Delay in milliseconds (4 seconds)
        disableOnInteraction: false, // Continue autoplay after user interaction
        pauseOnMouseEnter: true, // Pause autoplay when hovered
      }}
      navigation
      loop={true}
      pagination={{ clickable: true }}
      slidesPerView={1}
      modules={[Navigation, Pagination, Autoplay]}
      className="machinery-slider"
      lazy={true}
    >
      {images.map((image, i) => (
        <SwiperSlide
          key={i}
          onClick={() => onOpen(i)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img loading="lazy" src={image} alt={`${title} ${i + 1}`} className="swiper-lazy" />
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
