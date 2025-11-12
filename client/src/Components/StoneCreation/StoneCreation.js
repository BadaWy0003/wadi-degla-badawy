import React from "react";
import './StoneCreation.css';
import "../Inspiration/Inspiration.css";
// import Section from "../Section/Section";
import { architectureData, mosaicsData } from "./StoneCreationData";
import ContactBubble from "../Contact/ContactBubble";
import ImageSection from "../Section/ImageSection";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function StoneCreation(){
    const { t } = useTranslation();
    return(
        <>
        <Helmet>
            <title>{t('stoneCreation.pageTitle')}</title>
            <meta name="description" content={t('stoneCreation.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/stone creations" />
        </Helmet>
        
        <div className='stone-creation-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('stoneCreation.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('stoneCreation.breadcrumbHome')}</a>
                        <p>{'>'} {t('stoneCreation.breadcrumbCurrent')}</p>
                        </div>
                </div>  

            <div className="stone-creation-section">
            <div className="inspo-section-title">
                        <h2>{t('stoneCreation.landscapingTitle')}</h2>
                        <hr/>
                    </div>
            <ImageSection sectionData={architectureData} />
            </div>
            
            <div className="stone-creation-section">

            <div className="inspo-section-title">
                        <h2>{t('stoneCreation.mosaicsTitle')}</h2>
                        <hr/>
                    </div>
            <ImageSection sectionData={mosaicsData} />

            </div>
            <ContactBubble />
            </div>    
            </>
            )
}