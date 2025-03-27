import React from "react";
import "./Section.css"; // Create a CSS file for styling
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper (Install if not installed)
import "swiper/css";

export default function Section({ title, text, images, imagePosition = "left" }) {
  return (
    <div className="section-container">
      <div className={`section-content ${imagePosition === "right" ? "reverse" : ""}`}>
        {/* Swiper for Images */}
        <div className="image-container">
          <Swiper spaceBetween={10} slidesPerView={1}>
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
