import React from "react";
import './Cobble.css';
import Section from "../Section/Section";
import { cobbleImages } from "./CobbleImageData";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function Cobble(){
    const { t } = useTranslation();
    return(
        <>
        <Helmet>
            <title>{t('cobbles.pageTitle')}</title>
            <meta name="description" content={t('cobbles.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/cobbles" />
        </Helmet>

        <div className='cobble-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('cobbles.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('cobbles.breadcrumbHome')}</a>
                        <p>{'>'} {t('cobbles.breadcrumbCurrent')}</p>
                        </div>
                </div>  

            <div className="cobble-section">
            <Section 
                    title={t('cobbles.sectionTitle')}
                    text={
                        <>
                        {t('cobbles.graniteText1')}
                        <br/><br/>
                        {t('cobbles.graniteText2')}
                        <br/><br/>
                        {t('cobbles.graniteText3')}
                        </>
                    }
                            images={cobbleImages} 
                    imagePosition="left" 

                />
                <p className="cobble-description">
                {t('cobbles.flamedPavingText1')}
                <br/><br/>
                {t('cobbles.flamedPavingText2')}
                <br/><br/>
                {t('cobbles.flamedPavingText3')}
                <br/><br/>
                {t('cobbles.flamedPavingText4')}
                <br/><br/>
                {t('cobbles.flamedPavingText5')}
                <br/><br/>
                {t('cobbles.flamedPavingText6')}
                </p>
            </div>
            <ContactBubble />
            </div>   
            </> 
            )
}