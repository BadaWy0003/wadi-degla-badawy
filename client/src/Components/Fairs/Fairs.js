import React from "react";
import './Fairs.css';
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function Fairs(){
    const { t } = useTranslation();
    
    return(
        <>
        <Helmet>
            <title>{t('fairs.pageTitle')}</title>
            <meta name="description" content={t('fairs.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/fairs" />
        </Helmet>
        
        <div className='fairs-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('fairs.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('fairs.breadcrumbHome')}</a>
                        <p>{'>'} {t('fairs.breadcrumbCurrent')}</p>
                        </div>
                </div>  
            <div className="coming-soon">
                <h1>{t('fairs.comingSoon')}</h1>
            </div>
            <ContactBubble />
            </div>    
            </>
            )
}