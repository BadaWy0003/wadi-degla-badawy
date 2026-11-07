'use client';
// The two photo sliders of the Inspiration page: "coverflow" (two photos side by side, the
// middle one in front) and "ancient" (one photo at a time). Loaded by InspoSwiper /
// InspoAncientSwiper only when they come near the screen (Swiper is ~31 KB gzipped).
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';

const AUTOPLAY = { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true };

export default function InspoSlider({ kind, images, alt, onOpen }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(null);
  const overlay = (
    <div className="image-overlay">
      <p>{t('common.imageHint')}</p>
    </div>
  );

  if (kind === 'coverflow') {
    return (
      <Swiper
        effect="coverflow"
        autoplay={AUTOPLAY}
        centeredSlides={true}
        slidesPerView={'2'}
        coverflowEffect={{
          rotate: 30, // Reduce rotation to make it more noticeable
          stretch: 10, // Adds spacing between slides
          depth: 300, // Increase depth to make perspective more visible
          modifier: 2, // Intensify the effect
          slideShadows: false,
        }}
        navigation
        modules={[EffectCoverflow, Navigation, Autoplay]}
        className="inspo-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            onClick={() => onOpen(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="swiper-slide-container">
              <img loading="lazy" src={image} alt={`${alt} ${index + 1}`.trim()} />
              {hovered === index && overlay}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <Swiper
      key={images.length} // Forces re-render when images change
      autoplay={AUTOPLAY}
      navigation
      loop={true}
      pagination={{ clickable: true }}
      slidesPerView={1}
      modules={[Navigation, Pagination, Autoplay]}
      className="ancient-swiper"
    >
      {images.map((image, index) => (
        <SwiperSlide
          key={`slide-${index}`}
          onClick={() => onOpen(index)}
          style={{ height: '100%' }}
        >
          <div
            className="swiper-slide-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              loading="lazy"
              src={image}
              alt={`${alt} ${index + 1}`.trim()}
              className="swiper-lazy"
            />
            {hovered && overlay}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
