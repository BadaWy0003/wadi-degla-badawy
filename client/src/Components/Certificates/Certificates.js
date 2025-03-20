import React from "react";
import './Certificates.css';
import { certificatesData } from "./CertificatesData"; // Import data
import CertificateLightBox from "./CertificateLightBox"; // Import Lightbox component

export default function Certificates() {
    return (
        <div className="certificates-page">
            <div className="breadcrumb">
            <a href="/">Home</a>
            <p>{'>'} Certificates</p>
            </div>
            {certificatesData.map((certificate, index) => (
                <div className="certificate-with-title" key={index}>                    
                    {/* Lightbox Component (Thumbnail & Full Image) */}
                    <CertificateLightBox 
                    thumbnail={certificate.thumbnail} 
                    fullImage={certificate.image} 
                    />
                    {/* Title */}
                    <h2>{certificate.name}</h2>
                </div>
            ))}
        </div>
    );
}
