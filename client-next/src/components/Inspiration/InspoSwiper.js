'use client';
import React from 'react';
import LazyInspoSlider from './LazyInspoSlider';

// "Coverflow" photo slider of the Inspiration page (interior / exterior).
export default function InspoSwiper({ images, alt = '' }) {
  return <LazyInspoSlider kind="coverflow" images={images} alt={alt} />;
}
