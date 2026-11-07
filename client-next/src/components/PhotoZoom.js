'use client';
// Full-screen photo viewer with zoom (yet-another-react-lightbox, ~15 KB gzipped). Load it with
// useLazyComponent() only when a photo is clicked, never in the first page download.
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function PhotoZoom({ open, close, slides, index = 0 }) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 3 }}
    />
  );
}
