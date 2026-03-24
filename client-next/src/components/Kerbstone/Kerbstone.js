'use client';
import React from "react";
import './Kerbstone.css';
import Section from "../Section/Section";
import { str,
        full_batter,
        bullnose,
        roundtop,
        channel,
        transition } from "./KerbstoneImageData";
const kerb_intro_img = '/Assets/Media/Kerb-and-Cobbles/kerb/kerb-bg.webp';
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';

export default function Kerbstone(){
    const { t } = useTranslation();
    return(
        <>
        
    <div className='kerbstone-container'>
            {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('kerbstone.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('kerbstone.breadcrumbHome')}</a>
                        <p>{'>'} {t('kerbstone.breadcrumbCurrent')}</p>
                        </div>
                </div>  
            <div className="kerbstone-section">   
                <section className="kerb-intro"> 
                    <h2>{t('kerbstone.introTitle')}</h2>
                    <img loading="lazy" className="kerb-intro-img-mobile" src={kerb_intro_img} alt={t('kerbstone.introImageAlt')} />
                    <p>{t('kerbstone.introText1')}<br/><br/>{t('kerbstone.introText2')}</p>
                    </section>
            <Section 
                    title={t('kerbstone.str.title')} 
                    text={t('kerbstone.str.text')}
                    images={str} 
                    imagePosition="left" 
                />
                <Section 
                    title={t('kerbstone.fullBatter.title')} 
                    text={t('kerbstone.fullBatter.text')}
                    images={full_batter} 
                    imagePosition="right" 
                />
                <Section 
                    title={t('kerbstone.bullnose.title')} 
                    text={t('kerbstone.bullnose.text')}
                    images={bullnose} 
                    imagePosition="left" 
                />
                <Section 
                    title={t('kerbstone.roundTop.title')} 
                    text={t('kerbstone.roundTop.text')}
                    images={roundtop} 
                    imagePosition="right" 
                />
    
                <Section 
                    title={t('kerbstone.channel.title')} 
                    text={t('kerbstone.channel.text')}
                    images={channel} 
                    imagePosition="left" 
                />

                <Section 
                    title={t('kerbstone.transition.title')} 
                    text={t('kerbstone.transition.text')}
                    images={transition} 
                    imagePosition="right" 
                />
                <section className="kerb-final"> 
                    <h2>{t('kerbstone.finalTitle')}</h2>
                    <p>{t('kerbstone.finalText1')}<br/><br/>{t('kerbstone.finalText2')}<br/><br/>{t('kerbstone.finalText3')}</p>

                    </section>

            </div>
            <ContactBubble />
            </div>  
            </>  
            )
}