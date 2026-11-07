'use client';
import React from 'react';
import './MasonryGrid.css'; // Import the CSS file
import usePhotoZoom from '../usePhotoZoom';

const MasonryGrid = ({ props }) => {
  const [openPhoto, zoom] = usePhotoZoom();
  // Convert images array to Lightbox format
  const slides = props.map((img) => ({ src: typeof img === 'object' ? img.src : img }));

  return (
    <div className="masonry-container">
      <div className="masonry-grid">
        {props.map((img, i) => {
          const imageSrc = typeof img === 'object' ? img.src : img;
          const imageAlt = typeof img === 'object' ? img.alt : `imaage ${i + 1}`;
          return (
            <div key={i} className="masonry-item" onClick={() => openPhoto(i)}>
              <img loading="lazy" src={imageSrc} alt={imageAlt} />
            </div>
          );
        })}
      </div>
      {zoom(slides)}
    </div>
  );
};

export default MasonryGrid;
