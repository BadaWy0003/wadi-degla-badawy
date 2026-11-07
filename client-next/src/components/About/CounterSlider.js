'use client';
// Phone-only slider of the counters section. Loaded by CounterSection only when the slider is
// near the screen (it is display:none on desktop, so it never loads there).
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

export default function CounterSlider({ slides, delay, spaceBetween }) {
  return (
    <Swiper
      autoplay={{ delay, disableOnInteraction: false, pauseOnMouseEnter: true }}
      loop={true}
      spaceBetween={spaceBetween}
      slidesPerView={1}
      modules={[Navigation, Autoplay]}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
}
