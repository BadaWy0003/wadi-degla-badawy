import React, { useState } from "react";
import "./Section.css"; // Create a CSS file for styling
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper (Install if not installed)
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import 'yet-another-react-lightbox/styles.css';
import "../Projects/ProjectDetails.css";

export default function Section({ title, text, images, imagePosition = "left" }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const slides = images.map((img) => ({ src: img }));

  return (
    <>
      <div className="section-container">
        <div className={`section-content ${imagePosition === "right" ? "reverse" : ""}`}>
          {/* Swiper for Images */}
          <div className="image-container">
            <Swiper 
              spaceBetween={10} 
              slidesPerView={1}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}    
              modules={[Pagination, Navigation, Autoplay]}
              pagination={{ clickable: true }}
              navigation
              grabCursor={true}
            >
              {images.map((image, idx) => (
                <SwiperSlide 
                  key={idx}
                  onClick={() => { setIndex(idx); setOpen(true); }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <img loading="lazy" src={image} alt={`Slide ${idx + 1}`} />
                  {hovered && (
                    <div className="image-overlay">
                      <p>Click on the image to view it in full size and swipe to navigate</p>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Text Content */}
          <div className="text-container">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      </div>

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
