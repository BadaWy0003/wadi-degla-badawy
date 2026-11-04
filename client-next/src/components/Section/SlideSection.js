'use client';
import React from "react";
import "./SlideSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {  Navigation } from "swiper/modules";
import "../Projects/ProjectDetails.css";

export default function SlideSection({ slides }) {
  return (
    <div className="slide-section-container">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        navigation
        modules={[ Navigation]}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="slide">
            <div className="image-wrapper">
              <img loading="lazy" src={slide.image} alt={slide.title || ""} />
            </div>
            <div className="text-wrapper">
              <h3>{slide.title}</h3>
              <p>{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
