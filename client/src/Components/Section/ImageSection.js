import React from "react";

export default function ImageSection({ sectionData }) {
  return (
    <div className="image-section-container">
        {sectionData.map((slide, index) => (
            <>
            <div className="image-wrapper">
              <img src={slide.image} alt={`Slide ${index + 1}`} />
            </div>
            <div className="text-wrapper">
              <h3>{slide.title}</h3>
              <p>{slide.text}</p>
            </div>
            </>
        ))}
          </div>

  );

}
