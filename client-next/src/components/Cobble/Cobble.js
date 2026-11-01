'use client';
import React from "react";
import './Cobble.css';
import Section from "../Section/Section";
import { cobbleImages } from "./CobbleImageData";
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

export default function Cobble(){
    const { t } = useTranslation();
    return(
        <>

        <div className='cobble-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('cobbles.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <LangLink href="/">{t('cobbles.breadcrumbHome')}</LangLink>
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
                <div className="cobble-flamed-section">

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

                    {/* Ideal Applications Section */}
                    <div className="cobble-applications">
                        <h2>{t('cobbles.applicationsTitle')}</h2>
                        <p>{t('cobbles.applicationsIntro')}</p>
                        <ul>
                            {t('cobbles.applicationsList').split('\n').map((item, index) => {
                                const trimmedItem = item.trim();
                                return trimmedItem ? <li key={index}>{trimmedItem.replace(/^- /, '')}</li> : null;
                            })}
                        </ul>
                    </div>
                </div>
                {/* Flamed Granite Paving Section */}
                <div className="cobble-flamed-section">
                    <div className="cobble-flamed">
                        <h2>{t('cobbles.flamedTitle')}</h2>
                        <p>{t('cobbles.flamedIntro')}</p>

                        <h3>{t('cobbles.flamedProcessTitle')}</h3>
                        <p>{t('cobbles.flamedProcessIntro')}</p>
                        <ul>
                            {t('cobbles.flamedProcessList').split('\n').map((item, index) => {
                                const trimmedItem = item.trim();
                                return trimmedItem ? <li key={index}>{trimmedItem.replace(/^- /, '')}</li> : null;
                            })}
                        </ul>

                        <h3>{t('cobbles.flamedBenefitsTitle')}</h3>
                        <ul>
                            {t('cobbles.flamedBenefitsList').split('\n').map((item, index) => {
                                const trimmedItem = item.trim();
                                return trimmedItem ? <li key={index}>{trimmedItem.replace(/^- /, '')}</li> : null;
                            })}
                        </ul>
                    </div>

                    {/* Where Flamed Paving Works Best */}
                    <div className="cobble-best-applications">
                        <h2>{t('cobbles.bestApplicationsTitle')}</h2>
                        <ul>
                            {t('cobbles.bestApplicationsList').split('\n').map((item, index) => {
                                const trimmedItem = item.trim();
                                return trimmedItem ? <li key={index}>{trimmedItem.replace(/^- /, '')}</li> : null;
                            })}
                        </ul>
                    </div>
                </div>
                {/* Technical & Custom Options */}
                <div className="cobble-technical">
                    <h2>{t('cobbles.technicalTitle')}</h2>
                    <p>{t('cobbles.technicalIntro')}</p>
                    <ul>
                        {t('cobbles.technicalOptions').split('\n').map((item, index) => {
                            const trimmedItem = item.trim();
                            return trimmedItem ? <li key={index}>{trimmedItem.replace(/^- /, '')}</li> : null;
                        })}
                    </ul>
                    <p className="technical-compliance">{t('cobbles.technicalCompliance')}</p>
                </div>

                {/* Final CTA Section */}
                <div className="cobble-cta-section">
                    <div className="cobble-cta">
                        <h2>{t('cobbles.ctaTitle')}</h2>
                        <p>{t('cobbles.ctaText')}</p>
                    </div>
                    <LangLink href="/contact"><button className="btn1">{t('cobbles.ctaButton')}</button></LangLink>
                </div>
            </div>
            <ContactBubble />
            </div>   
            </> 
            )
}