'use client';
import React from "react";
import './Packing.css';
// import Carousel from 'react-multi-carousel';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import ContactBubble from "../Contact/ContactBubble";
import 'react-multi-carousel/lib/styles.css';
import { useTranslation } from 'react-i18next';


import image3 from '../../Public/Assets/Media/3.webp';
import image21 from '../../Public/Assets/Media/21.webp';
// import image24 from '../../Public/Assets/Media/24.webp';
import packing1 from '../../Public/Assets/Media/Packing/packing1.webp';
import packing2 from '../../Public/Assets/Media/Packing/packing2.webp';
import packing3 from '../../Public/Assets/Media/Packing/packing3.webp';
import packing4 from '../../Public/Assets/Media/Packing/packing4.webp';
import packing5 from '../../Public/Assets/Media/Packing/packing5.webp';
import packing6 from '../../Public/Assets/Media/Packing/packing6.webp';
import packing7 from '../../Public/Assets/Media/Packing/packing7.webp';
import packing8 from '../../Public/Assets/Media/Packing/packing8.webp';
import packing9 from '../../Public/Assets/Media/Packing/packing9.webp';
import packing10 from '../../Public/Assets/Media/Packing/packing10.webp';
import packing11 from '../../Public/Assets/Media/Packing/packing11.webp';
import packing12 from '../../Public/Assets/Media/Packing/packing12.webp';
import packing13 from '../../Public/Assets/Media/Packing/packing13.webp';
import packing14 from '../../Public/Assets/Media/Packing/packing14.webp';
import packing15 from '../../Public/Assets/Media/Packing/packing15.webp';
import packing16 from '../../Public/Assets/Media/Packing/packing16.webp';
import packing17 from '../../Public/Assets/Media/Packing/packing17.webp';
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
    ];
    
  const router = useRouter();
  const lang = useLang();

      function OnClick(){
    router.push(`/${lang}/contact`); 
    window.scrollTo({top: 0});
  }

    
    return(
        <>
        <Helmet>
                <title>{t('packing.pageTitle')}</title>
                <meta name="description" content={t('packing.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/packing" />
        </Helmet>
        
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