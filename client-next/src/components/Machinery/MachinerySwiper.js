'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'yet-another-react-lightbox/styles.css';
import "../Projects/ProjectDetails.css";


export default function MachinerySwiper({ images, title, description }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const slides = images.map((img) => ({ src: img }));

  return (
    <div className="machinery-item">
      <h3>{title}</h3>
      {description && <p className="machinery-description">{description}</p>}
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
            onClick={() => { setIndex(i); setOpen(true); }}
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

      {/* Lightbox Component */}
      <Lightbox 
        open={open} 
        close={() => setOpen(false)} 
        slides={slides} 
        index={index}
        plugins={[Zoom]} 
        zoom={{ maxZoomPixelRatio: 3 }} 
      />
    </div>
  );
}
