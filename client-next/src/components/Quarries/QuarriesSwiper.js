'use client';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import './Quarries.css';
import '../Projects/ProjectDetails.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'yet-another-react-lightbox/styles.css';
import { cardImageProps } from '../../util/responsive-img';


export default function QuarriesSwiper({images, alt = ""}){
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const slides = images.map((img) => ({ src: img }));

  return(
    <>
      <Swiper
        autoplay={{
          delay: 2000, // Delay in milliseconds (3 seconds)
          disableOnInteraction: false, // Continue autoplay after user interaction
          pauseOnMouseEnter: true, // Pause autoplay when hovered
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
            onClick={() => { setIndex(i); setOpen(true); }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <img loading="lazy" {...cardImageProps(image, '(max-width: 768px) 100vw, 800px')} alt={`${alt} ${i + 1}`.trim()} className="swiper-lazy" />
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
    </>
  );
}

