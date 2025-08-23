import React from "react";
import './Certificates.css';
import { certificatesData } from "./CertificatesData"; // Import data
import CertificateLightBox from "./CertificateLightBox"; // Import Lightbox component
import ContactBubble from "../Contact/ContactBubble"; // Import Contact Bubble component
import { Helmet } from 'react-helmet-async';

export default function Certificates() {
    return (
        <>
        <Helmet>
            <title>Our Certificates | Wadidegla</title>
            <meta name="description" content="Certificates Description" />
            <link rel="canonical" href="https://www.wadidegla-eg.com/certificates" />
        </Helmet>
        
        <div className="certificates-page">
            <h1>OUR CERTIFICATES</h1>
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
            <ContactBubble />
        </div>
        </>
    );
}
