import React from "react";
import './Home.css';
import { certificatesData } from "../Certificates/CertificatesData"; // Import data
import CertificateLightBox from "../Certificates/CertificateLightBox"; // Import Lightbox component

export default function CertificatesHome() {
    return (
        <section className="certificates-home">
            <h2>Certificates</h2>
            <p className="certificates-hint-pc">click on logo to view certificate</p>
            <p className="certificates-hint-mobile">tap on logo to view certificate</p>
            <div className="certificates-home-grid">
            {certificatesData.map((certificate, index) => (
                <div  key={index}>                    
                    {/* Lightbox Component (Thumbnail & Full Image) */}
                    <CertificateLightBox 
                    thumbnail={certificate.thumbnail} 
                    fullImage={certificate.image} 
                    />
                </div>
            ))}
            </div>
        </section>
    );
}
