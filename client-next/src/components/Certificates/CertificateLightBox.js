'use client';
import React, { useState } from 'react';
import { useLazyComponent } from '../../util/near-screen';

// The zoom viewer's code is loaded the first time a certificate is clicked.
const loadCertificateZoom = () => import('./CertificateZoom');

export default function CertificateLightBox({ thumbnail, fullImage, altText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  const CertificateZoom = useLazyComponent(wanted, loadCertificateZoom);

  return (
    <>
      {/* Thumbnail Image */}
      <img
        loading="lazy"
        className="certificate-image"
        src={thumbnail}
        alt={altText || 'Certificate'}
        onClick={() => {
          setWanted(true);
          setIsOpen(true);
        }}
      />

      {CertificateZoom && (
        <CertificateZoom open={isOpen} close={() => setIsOpen(false)} fullImage={fullImage} />
      )}
    </>
  );
}
