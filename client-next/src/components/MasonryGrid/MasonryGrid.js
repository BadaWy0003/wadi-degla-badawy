'use client';
import React, { useState } from 'react';
import './MasonryGrid.css'; // Import the CSS file
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom'; // Import Zoom plugin
import 'yet-another-react-lightbox/styles.css';

const MasonryGrid = ({ props }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // Convert images array to Lightbox format
  const slides = props.map((img) => ({ src: typeof img === 'object' ? img.src : img }));

  return (
    <div className="masonry-container">
      <div className="masonry-grid">
        {props.map((img, i) => {
          const imageSrc = typeof img === 'object' ? img.src : img;
          const imageAlt = typeof img === 'object' ? img.alt : `imaage ${i + 1}`;
          return (
            <div
              key={i}
              className="masonry-item"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              <img loading="lazy" src={imageSrc} alt={imageAlt} />
            </div>
          );
        })}
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
    </div>
  );
};

export default MasonryGrid;
