'use client';
import React from "react";
import './Home.css';
import "../Certificates/Certificates.css";
import { useTranslation } from 'react-i18next';
import { certificatesData } from "../Certificates/CertificatesData"; // Import data
import CertificateLightBox from "../Certificates/CertificateLightBox"; // Import Lightbox component

export default function CertificatesHome() {
    const { t } = useTranslation();
    return (
        <section className="certificates-home">
            <h2>{t('home.certificates')}</h2>
            <p className="certificates-hint-pc">{t('home.certificatesHintPc')}</p>
            {/* <p className="certificates-hint-mobile">{t('home.certificatesHintMobile')}</p> */}
            <div className="certificates-home-grid">
            {certificatesData.map((certificate, index) => (
                <div  key={index}>                    
                    {/* Lightbox Component (Thumbnail & Full Image) */}
                    <CertificateLightBox 
                    thumbnail={certificate.thumbnail} 
                    fullImage={certificate.image}
                    width={certificate.thumbWidth}
                    height={certificate.thumbHeight}
                    altText={t('home.certificatesAlt')}
                    />
                </div>
            ))}
            </div>
        </section>
    );
}
