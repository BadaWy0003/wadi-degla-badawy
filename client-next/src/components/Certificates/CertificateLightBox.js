'use client';
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import Zoom plugin

export default function CertificateLightBox({ thumbnail, fullImage, altText }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Thumbnail Image */}
            <img loading="lazy" 
                className="certificate-image"
                src={thumbnail} 
                alt={altText || "Certificate"} 
                onClick={() => setIsOpen(true)} 
            />

            {/* Lightbox */}
            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={[{ src: fullImage }]}
                carousel={{ finite: true }}  // Disables navigation arrows & swiping
                plugins={[Zoom]}  // Enable Zoom
                zoom={{ maxZoomPixelRatio: 3 }} // Allows zooming up to 3x
            />
        </>
    );
}
