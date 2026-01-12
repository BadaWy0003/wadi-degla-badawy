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
                        </>
                    }
                            images={cobbleImages} 
                    imagePosition="left" 

                />
                <div className="cobble-benefits">
                    <h2>{t('cobbles.benefitsMainTitle')}</h2>

                    <h3>{t('cobbles.benefitsTitle1')}</h3>
                    <p className="cobble-description">
                    {t('cobbles.benefitsText1')}
                    </p>

                    <h3>{t('cobbles.benefitsTitle2')}</h3>
                    <p className="cobble-description">
                    {t('cobbles.benefitsText2')}
                    </p>

                    <h3>{t('cobbles.benefitsTitle3')}</h3>
                    <p className="cobble-description">
                    {t('cobbles.benefitsText3')}
                    </p>

                    <h3>{t('cobbles.benefitsTitle4')}</h3>
                    <p className="cobble-description">
                    {t('cobbles.benefitsText4')}
                    </p>
                </div>
            </div>
            <ContactBubble />
            </div>   
            </> 
            )
}