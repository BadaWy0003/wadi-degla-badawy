import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../Projects/ProjectDetails.css";


export default function MachinerySwiper({ images, title }) {
  return (
    <div className="machinery-item">
      <h2>{title}</h2>
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
          <SwiperSlide key={i}>
            <img loading="lazy" src={image} alt={`${title} ${i + 1}`} className="swiper-lazy" />
            <div className="swiper-lazy-preloader"></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
