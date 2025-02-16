import React, { useState } from "react";
import "./MasonryGrid.css"; // Import the CSS file
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';



const MasonryGrid = ({props}) => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
  // Convert images array to Lightbox format
  const slides = props.map((img) => ({ src: img }));

  return (
    <div className="masonry-container">
      <div className="masonry-grid">
        {props.map((img, i) => (
          <div key={i} className="masonry-item" onClick={() => { setIndex(i); setOpen(true); }}>
            <img src={img} alt={`imaage ${i + 1}`} />
          </div>
        ))}
      </div>

      {/* Lightbox Component */}
      <Lightbox open={open} close={() => setOpen(false)} slides={slides} index={index} />
    </div>
  );
};


export default MasonryGrid;
