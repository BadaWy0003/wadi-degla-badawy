'use client';
// The partners logo slider. Loaded by PartnersHome only when the section is near the screen
// (Swiper is ~31 KB gzipped). Its logos load right away (no loading="lazy"): the slides off to
// the side would otherwise load late and make the slider grow while it is on screen.
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import { partnerLogos } from '../Partners/PartnersData';

export default function PartnersSlider({ isRTL, alt }) {
  return (
    <Swiper
      key={`partners-swiper-${isRTL}`}
      slidesPerView={1}
      spaceBetween={0}
      loop={true}
      speed={2000}
      dir={isRTL ? 'rtl' : 'ltr'}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
        reverseDirection: isRTL,
      }}
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 0, centeredSlides: true },
        768: { slidesPerView: 3, spaceBetween: 15 },
        968: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 50 },
      }}
      modules={[FreeMode, Autoplay]}
      className="partners-swiper"
      alt={alt}
    >
      {partnerLogos.map((logo, index) => (
        <SwiperSlide key={index} className="partner-slide">
          <img id={`Partner-logo-home-${index + 1}`} src={logo} alt={`Partner ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
