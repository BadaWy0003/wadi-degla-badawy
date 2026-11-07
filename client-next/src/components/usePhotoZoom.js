'use client';
// The full-screen photo viewer (PhotoZoom, ~15 KB gzipped) for a page or slider, loaded on the
// first photo click instead of with the page.
//   const [openPhoto, zoom] = usePhotoZoom();
//   <img onClick={() => openPhoto(i)} />   ...   {zoom(slides)}
// slides: [{ src, alt? }]
import React, { useState } from 'react';
import { useLazyComponent } from '../util/near-screen';

const loadPhotoZoom = () => import('./PhotoZoom');

export default function usePhotoZoom() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [wanted, setWanted] = useState(false);
  const PhotoZoom = useLazyComponent(wanted, loadPhotoZoom);

  const openPhoto = (i) => {
    setIndex(i);
    setWanted(true);
    setOpen(true);
  };

  const zoom = (slides) =>
    PhotoZoom ? (
      <PhotoZoom open={open} close={() => setOpen(false)} slides={slides} index={index} />
    ) : null;

  return [openPhoto, zoom];
}
