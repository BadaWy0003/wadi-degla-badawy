'use client';
import React from 'react';
import LazyInspoSlider from './LazyInspoSlider';

// One-photo-at-a-time slider of the Inspiration page (ancient works).
export default function InspoAncientSwiper({ images, alt = '' }) {
  return <LazyInspoSlider kind="ancient" images={images} alt={alt} />;
}
