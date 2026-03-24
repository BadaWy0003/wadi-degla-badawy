'use client';
import React from "react";
import './Certificates.css';
import { certificatesData } from "./CertificatesData";
import CertificateLightBox from "./CertificateLightBox";
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';

export default function Certificates() {
    const { t } = useTranslation();
    return (
        <>
        
        <div className="certificates-page">
            <h1>{t('certificates.heroTitle')}</h1>
            <div className="breadcrumb">
            <a href="/">{t('certificates.breadcrumbHome')}</a>
            <p>{'>'} {t('certificates.breadcrumbCurrent')}</p>
            </div>
            {certificatesData.map((certificate, index) => (
                <div className="certificate-with-title" key={index}>                    
                    {/* Lightbox Component (Thumbnail & Full Image) */}
                    <CertificateLightBox 
                    thumbnail={certificate.thumbnail} 
                    fullImage={certificate.image} 
                    />
                    {/* Title */}
                    <h2>{t(certificate.name)}</h2>
                </div>
            ))}
            <ContactBubble />
        </div>
        </>
    );
}
