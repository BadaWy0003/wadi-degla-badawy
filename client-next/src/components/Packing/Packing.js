'use client';
import React from "react";
import './Packing.css';
// import Carousel from 'react-multi-carousel';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import ContactBubble from "../Contact/ContactBubble";
import 'react-multi-carousel/lib/styles.css';
import { useTranslation } from 'react-i18next';


const image3 = '/Assets/Media/3.webp';
const image21 = '/Assets/Media/21.webp';
// const image24 = '/Assets/Media/24.webp';
const packing1 = '/Assets/Media/Packing/packing1.webp';
const packing2 = '/Assets/Media/Packing/packing2.webp';
const packing3 = '/Assets/Media/Packing/packing3.webp';
const packing4 = '/Assets/Media/Packing/packing4.webp';
const packing5 = '/Assets/Media/Packing/packing5.webp';
const packing6 = '/Assets/Media/Packing/packing6.webp';
const packing7 = '/Assets/Media/Packing/packing7.webp';
const packing8 = '/Assets/Media/Packing/packing8.webp';
const packing9 = '/Assets/Media/Packing/packing9.webp';
const packing10 = '/Assets/Media/Packing/packing10.webp';
const packing11 = '/Assets/Media/Packing/packing11.webp';
const packing12 = '/Assets/Media/Packing/packing12.webp';
const packing13 = '/Assets/Media/Packing/packing13.webp';
const packing14 = '/Assets/Media/Packing/packing14.webp';
const packing15 = '/Assets/Media/Packing/packing15.webp';
const packing16 = '/Assets/Media/Packing/packing16.webp';
const packing17 = '/Assets/Media/Packing/packing17.webp';
const exports22 = '/Assets/Media/Exports/exports22.webp';
const exports23 = '/Assets/Media/Exports/exports23.webp';
const exports24 = '/Assets/Media/Exports/exports24.webp';
const exports25 = '/Assets/Media/Exports/exports25.webp';
const exports26 = '/Assets/Media/Exports/exports26.webp';
const exports27 = '/Assets/Media/Exports/exports27.webp';
const exports28 = '/Assets/Media/Exports/exports28.webp';
const exports29 = '/Assets/Media/Exports/exports29.webp';
const exports30 = '/Assets/Media/Exports/exports30.webp';
const exports31 = '/Assets/Media/Exports/exports31.webp';
const exports32 = '/Assets/Media/Exports/exports32.webp';
const exports33 = '/Assets/Media/Exports/exports33.webp';
const exports34 = '/Assets/Media/Exports/exports34.webp';
const exports35 = '/Assets/Media/Exports/exports35.webp';

import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';


export default function Packing(){
    const { t } = useTranslation();

    const images = [
        { src: packing1, alt: t('packing.packingAlt1') },
        { src: packing2, alt: t('packing.packingAlt2') },
        { src: packing3, alt: t('packing.packingAlt3') },
        { src: packing4, alt: t('packing.packingAlt4') },
        { src: packing5, alt: t('packing.packingAlt5') },
        { src: packing6, alt: t('packing.packingAlt6') },
        { src: packing7, alt: t('packing.packingAlt7') },
        { src: packing8, alt: t('packing.packingAlt8') },
        { src: packing9, alt: t('packing.packingAlt9') },
        { src: packing10, alt: t('packing.packingAlt10') },
        { src: packing11, alt: t('packing.packingAlt11') },
        { src: packing12, alt: t('packing.packingAlt12') },
        { src: packing13, alt: t('packing.packingAlt13') },
        { src: packing14, alt: t('packing.packingAlt14') },
        { src: packing15, alt: t('packing.packingAlt15') },
        { src: packing16, alt: t('packing.packingAlt16') },
        { src: packing17, alt: t('packing.packingAlt17') },
        { src: exports22, alt: t('packing.packingAlt18') },
        { src: exports23, alt: t('packing.packingAlt19') },
        { src: exports24, alt: t('packing.packingAlt20') },
        { src: exports25, alt: t('packing.packingAlt21') },
        { src: exports26, alt: t('packing.packingAlt22') },
        { src: exports27, alt: t('packing.packingAlt23') },
        { src: exports28, alt: t('packing.packingAlt24') },
        { src: exports29, alt: t('packing.packingAlt25') },
        { src: exports30, alt: t('packing.packingAlt26') },
        { src: exports31, alt: t('packing.packingAlt27') },
        { src: exports32, alt: t('packing.packingAlt28') },
        { src: exports33, alt: t('packing.packingAlt29') },
        { src: exports34, alt: t('packing.packingAlt30') },
        { src: exports35, alt: t('packing.packingAlt31') },
    ];
    
  const router = useRouter();
  const lang = useLang();

      function OnClick(){
    router.push(`/${lang}/contact`); 
    window.scrollTo({top: 0});
  }

    
    return(
        <>
        
        <div className='packing-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                            <h1>{t('packing.heroTitle')}</h1>
                            <div className="breadcrumb">
                            <a href="/">{t('packing.breadcrumbHome')}</a>
                            <p>{'>'} {t('packing.breadcrumbCurrent')}</p>
                            </div>
                </div>  
     
                <div className="packing-slabs">
                    <div className="packing-slabs-content">
                            <h2>{t('packing.slabsTitle')}</h2>

                            <h3>{t('packing.woodenBundleTitle')}</h3>
                            <p>{t('packing.woodenBundleText')}</p>

                            <h3>{t('packing.normalPackingTitle')}</h3>
                            <p>{t('packing.normalPackingText')}</p>

                    </div>
                        <img loading="lazy" src={image3} alt={t('packing.slabsImageAlt')}/>
                </div>  

                <div className="packing-tiles">
                        <img loading="lazy" src={image21} alt={t('packing.tilesImageAlt')}/>
                    <div className="packing-tiles-content">
                        <h2>{t('packing.tilesTitle')}</h2>

                        <h3>{t('packing.woodenCratesTitle')}</h3>
                        <p>{t('packing.woodenCratesText')}</p>

                        <h3>{t('packing.woodenPalletTitle')}</h3>
                        <p>{t('packing.woodenPalletText')}</p>
                    </div>
                </div> 

            {/* Why Our Packing Matters Section */}
            <div className="packing-benefits">
                <h2>{t('packing.whyMatterTitle')}</h2>
                <div className="benefits-grid">
                    <div className="benefit-item">
                        <p>{t('packing.benefit1')}</p>
                    </div>
                    <div className="benefit-item">
                        <p>{t('packing.benefit2')}</p>
                    </div>
                    <div className="benefit-item">
                        <p>{t('packing.benefit3')}</p>
                    </div>
                    <div className="benefit-item">
                        <p>{t('packing.benefit4')}</p>
                    </div>
                    <div className="benefit-item">
                        <p>{t('packing.benefit5')}</p>
                    </div>
                    <div className="benefit-item">
                        <p>{t('packing.benefit6')}</p>
                    </div>
                </div>
            </div>

            {/* Professional Packing Request Section */}
            <div className="packing-cta-section">
                <h2>{t('packing.ctaTitle')}</h2>
                <p>{t('packing.ctaDescription')}</p>
                <p className="cta-contact">{t('packing.ctaContact')}</p>
                <div className="cta-buttons">
                    <button className="btn2" onClick={OnClick}>{t('packing.ctaButton1')}</button>
                    <button className="btn1" onClick={OnClick}>{t('packing.ctaButton2')}</button>
                </div>
            </div>
            {/* Image Grid Section */}

            <div className="image-grid">
            <MasonryGrid props={images}/>

            </div>

            <ContactBubble />

            </div>    
            </>
            )
}