'use client';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import Zoom plugin
import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Inspiration.css";
import "../Projects/ProjectDetails.css";

export default function InspoAncientSwiper({ images, alt = "" }) {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="inspo-swiper-container">
          {/* Hint Text for Small Screens */}
          <p className="inspo-hint">Tap on the image to view it in full size and swipe to navigate</p>

          <Swiper
  key={images.length} // Forces re-render when images change
  autoplay={{
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
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
    onClick={() => handleImageClick(index)}
    style={{ height: "100%" }}
    >
  <div className="swiper-slide-container"
       onMouseEnter={() => setHovered(true)}
       onMouseLeave={() => setHovered(false)}>
    <img loading="lazy" src={image} alt={`${alt} ${index + 1}`.trim()} className="swiper-lazy" />
    {hovered && (
      <div className="image-overlay">
        <p>{t('common.imageHint')}</p>
      </div>
    )}
  </div>
</SwiperSlide>
))}
      </Swiper>

      {/* Lightbox for full-screen view */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((img) => ({ src: img }))}
        index={lightboxIndex}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }} // Allows zooming up to 3x

      />
    </div>
  );
}
