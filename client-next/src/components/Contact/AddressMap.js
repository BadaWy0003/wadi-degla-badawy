'use client';
import React from 'react';

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d106453.07238307402!2d31.1722617!3d29.944811!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458390007929e37%3A0x83f903df75caead0!2sWadidegla%20for%20marbl%20and%20granite!5e0!3m2!1sen!2seg!4v1741651658436!5m2!1sen!2seg';

// Google Maps embed of the head office. The box has its own background and pin, so it
// still looks intentional while the map loads (or if a network blocks Google Maps).
export default function AddressMap({ title = 'Map' }) {
  return (
    <div className="cx-map">
      <iframe
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        src={MAP_EMBED_URL}
      />
    </div>
  );
}
