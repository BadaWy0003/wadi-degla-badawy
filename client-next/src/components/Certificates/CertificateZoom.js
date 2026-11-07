'use client';
// Full-size certificate with zoom. Loaded by CertificateLightBox only when a certificate is
// clicked (yet-another-react-lightbox + zoom, ~15 KB gzipped).
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function CertificateZoom({ open, close, fullImage }) {
  return (
    <Lightbox
      open={open}
      close={close}
      slides={[{ src: fullImage }]}
      carousel={{ finite: true }} // Disables navigation arrows & swiping
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 3 }} // Allows zooming up to 3x
    />
  );
}
