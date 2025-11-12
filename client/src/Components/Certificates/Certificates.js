import React from "react";
import './Certificates.css';
import { certificatesData } from "./CertificatesData";
import CertificateLightBox from "./CertificateLightBox";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function Certificates() {
    const { t } = useTranslation();
    return (
        <>
        <Helmet>
            <title>{t('certificates.pageTitle')}</title>
            <meta name="description" content={t('certificates.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/certificates" />
        </Helmet>
        
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
