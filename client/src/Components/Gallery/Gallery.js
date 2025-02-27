import React, { useState, useEffect } from "react";
import "./Gallery.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import apiClient from "../../util/client";
import ContactBubble from "../Contact/ContactBubble";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const typeName = "Gallery";
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/api/storage/type/${typeName}`);
        setGallery(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error:", error);
        setGallery([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

    // Convert images array to Lightbox format
    const slides = gallery
    .map((item) =>
      item.finishes && item.finishes[0]?.link ? { src: item.finishes[0].link } : null
    )
    .filter(Boolean);


  return (
    <div className="gallery-container">
      {/* 🌟 Hero Section */}
      <div className="quarries-hero">
          <h1>GALLERY</h1>
          <div className="breadcrumb">
          <a href="/">Home</a>
          <p>{'>'} Gallery</p>
          </div>
      </div>  
      {/* Masonry Grid Gallery */}
      <div className="masonry-container">
      {loading ? (
        <div className="loading-message">Loading Images...</div>
      ) : (
        <>
        <div className="masonry-grid">
          {slides.map((slide, i) => (
            <div key={i} className="masonry-item" onClick={() => { setIndex(i); setOpen(true); }}>
              <img src={slide.src} alt={`Gallery ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
        </>
      )}
      </div>
      
      {/* Lightbox Component */}
      <Lightbox open={open} close={() => setOpen(false)} slides={slides} index={index} />
      <ContactBubble />
    </div>
  );
}
