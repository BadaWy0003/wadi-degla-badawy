'use client';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import Zoom plugin
import "yet-another-react-lightbox/styles.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import "swiper/css/navigation";

import './Inspiration.css';

// Import required modules
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';

export default function InspoSwiper({ images }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleImageClick = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
      };
    
  return (
    <div className="inspo-swiper-container">
    {/* Hint Text for Small Screens */}
    <p className="inspo-hint">Tap on the image to view it in full size and swipe to navigate</p>

    <Swiper
  effect="coverflow"
  autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
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
        onClick={() => handleImageClick(index)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        >
            <div className="swiper-slide-container">
              <img loading="lazy" src={image} alt={`Slide ${index}`} />
              {hoveredIndex === index && (
                <div className="image-overlay">
                  <p>Click on the image to view it in full size and swipe to navigate</p>
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
