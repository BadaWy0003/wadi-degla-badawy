import React from "react";
import "./Section.css"; // Create a CSS file for styling
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper (Install if not installed)
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Section({ title, text, images, imagePosition = "left" }) {
  return (
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
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
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
  );
}
