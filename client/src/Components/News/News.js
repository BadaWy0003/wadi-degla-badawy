import React from "react";
import './News.css';
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function News(){
    const { t } = useTranslation();


    
    
    return(
        <>
        <Helmet>
            <title>{t('news.pageTitle')}</title>
            <meta name="description" content={t('news.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/news" />
        </Helmet>
        
        <div className='news-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('news.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('news.breadcrumbHome')}</a>
                        <p>{'>'} {t('news.breadcrumbCurrent')}</p>
                        </div>
                </div>  
            <div className="coming-soon">
                <p>{t('news.newsDescription')}</p>
                <h1>{t('news.comingSoon')}</h1>
            </div>
            <ContactBubble />
            </div>   
            </> 
            )
}