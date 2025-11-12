import React from "react";
import './About.css';
import logo_color_stroke_notext from '../../Public/Assets/Media/logo-color-stroke-notext.svg'
import expertise_square_image from '../../Public/Assets/Media/about-expertise.webp'
import MissionVisionSection from "./MissionVisionSection";
import CounterSection from "./CounterSection";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

import 'react-multi-carousel/lib/styles.css';



export default function About(){
    const { t } = useTranslation();

    return(
        <>
          <Helmet>
                <title>{t('about.pageTitle')}</title>
                <meta name="description" content={t('about.metaDescription')} />
                <link rel="canonical" href="https://www.wadidegla-eg.com/about" />
            </Helmet>
        <div className='about-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>{t('about.heroTitle')}</h1>
                <div className="breadcrumb">
                <a href="/">{t('about.breadcrumbHome')}</a>
                <p>{'>'} {t('about.breadcrumbCurrent')}</p>
                </div>
            </div>  
            {/* Intro Section */}
            <div className="about-intro-section">
                <div className="about-intro-section-content">
                    <h2>{t('about.introTitle')}</h2>
                    <p> {t('about.introText1')}
                        <br/><br/>
                        {t('about.introText2')}
                    </p>
                </div>

                <div className="about-intro-section-image">
                    <img loading="lazy" src={logo_color_stroke_notext} alt={t('about.logoAlt')}/>
                </div>
            </div>

            < MissionVisionSection />
            <div className="our-expertise-section">
                <div className="our-expertise-title">
                    <hr/>
                    <h2>{t('about.expertiseTitle')}</h2>
                    <p>{t('about.expertiseSubtitle')}</p>
                </div>
                <div className="our-expertise-section-content">
                    <div className="our-expertise-section-content-image">
                        <img loading="lazy" src={expertise_square_image} alt={t('about.expertiseImageAlt')}/>
                    </div>
                    <div className="our-expertise-section-content-text">
                        <p>{t('about.expertiseIntro')}</p>
                        <li><strong>{t('about.globalReachTitle')}</strong> <br/>{t('about.globalReachText')}</li>
                        <li><strong>{t('about.resourcesTitle')}</strong> <br/>{t('about.resourcesText')}</li>
                        <li><strong>{t('about.graniteTitle')}</strong> <br/>{t('about.graniteText')}</li>
                        <li><strong>{t('about.partnershipsTitle')}</strong> <br/>{t('about.partnershipsText')}</li>
                        <li><strong>{t('about.solutionsTitle')}</strong> <br/>{t('about.solutionsText')}</li>
                    </div>
                </div>
            </div>

            <CounterSection />

            <div className="thanks-section">
                <h2>{t('about.thanksTitle')}</h2>
                <h4>{t('about.thanksText')}</h4>
            </div>
            <ContactBubble />

        </div>   
        </> 
            )
}