import React from "react";
import './Packing.css';
// import Carousel from 'react-multi-carousel';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';
import 'react-multi-carousel/lib/styles.css';
import { useTranslation } from 'react-i18next';
import '../../i18n';


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


export default function Packing(){
    const { t } = useTranslation();

    const images = [
        packing1,
        packing2,
        packing3,
        packing4,
        packing5,
        packing6,
        packing7,
        packing8,
        packing9,
        packing10,
        packing11,
        packing12,
        packing13,
        packing14,
        packing15,
        packing16,
        packing17,
    ];

    
    
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
                        <h1>{t('packing.tilesTitle')}</h1>

                        <h3>{t('packing.woodenCratesTitle')}</h3>
                        <p>{t('packing.woodenCratesText')}</p>

                        <h3>{t('packing.woodenPalletTitle')}</h3>
                        <p>{t('packing.woodenPalletText')}</p>
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