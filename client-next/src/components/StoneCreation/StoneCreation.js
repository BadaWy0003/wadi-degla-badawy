'use client';
import React from "react";
import './StoneCreation.css';
import "../Inspiration/Inspiration.css";
// import Section from "../Section/Section";
import { architectureData, mosaicsData } from "./StoneCreationData";
import ContactBubble from "../Contact/ContactBubble";
import ImageSection from "../Section/ImageSection";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

export default function StoneCreation(){
    const { t } = useTranslation();
    return(
        <>
        
        <div className='stone-creation-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('stoneCreation.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <LangLink href="/">{t('stoneCreation.breadcrumbHome')}</LangLink>
                        <p>{'>'} {t('stoneCreation.breadcrumbCurrent')}</p>
                        </div>
                </div>  

            <div className="stone-creation-section">
            <div className="inspo-section-title">
                        <h2>{t('stoneCreation.landscapingTitle')}</h2>
                        <hr/>
                    </div>
            <p>{t('stoneCreation.landscapingDescription')}</p>
            <ImageSection sectionData={architectureData} />
            </div>
            
            <div className="stone-creation-section">

            <div className="inspo-section-title">
                        <h2>{t('stoneCreation.mosaicsTitle')}</h2>
                        <hr/>
                    </div>
            <p>{t('stoneCreation.mosaicsDescription')}</p>
            <ImageSection sectionData={mosaicsData} />

            </div>
            <ContactBubble />
            </div>    
            </>
            )
}