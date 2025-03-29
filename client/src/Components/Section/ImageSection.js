import React from "react";
import "./ImageSection.css";

export default function ImageSection({ sectionData }) {
  return (
    <div className="image-section-grid">
      {sectionData.map((slide, index) => (
        <div key={index} className="grid-item">
          <div className="image-section-image-wrapper">
            <img src={slide.image} alt={`Slide ${index + 1}`} />
          </div>
          <div className="image-section-text-wrapper">
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
