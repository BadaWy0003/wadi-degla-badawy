import React from "react";
import './Exports.css';
import 'react-multi-carousel/lib/styles.css';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import exports from '../../Public/Assets/Media/Exports/exports2.webp';
import OurMarkets from "./OurMarkets";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';

import exports1 from '../../Public/Assets/Media/Packing/packing3.webp';
import exports2 from '../../Public/Assets/Media/Packing/packing7.webp';
import exports3 from '../../Public/Assets/Media/Exports/exports3.webp';
import exports4 from '../../Public/Assets/Media/Exports/exports4.webp';
import exports5 from '../../Public/Assets/Media/Exports/exports5.webp';
import exports6 from '../../Public/Assets/Media/Exports/exports6.webp';
// import exports7 from '../../Public/Assets/Media/Exports/exports7.webp';
import exports8 from '../../Public/Assets/Media/Exports/exports8.webp';
import exports9 from '../../Public/Assets/Media/Exports/exports9.webp';
import exports10 from '../../Public/Assets/Media/Exports/exports10.webp';
import exports11 from '../../Public/Assets/Media/Exports/exports11.webp';
import exports12 from '../../Public/Assets/Media/Exports/exports12.webp';
import exports13 from '../../Public/Assets/Media/Exports/exports13.webp';
import exports14 from '../../Public/Assets/Media/Exports/exports14.webp';
import exports15 from '../../Public/Assets/Media/Exports/exports15.webp';
import exports16 from '../../Public/Assets/Media/Exports/exports16.webp';
import exports17 from '../../Public/Assets/Media/Exports/exports17.webp';
import exports18 from '../../Public/Assets/Media/Exports/exports18.webp';
import exports19 from '../../Public/Assets/Media/Exports/exports19.webp';
import exports20 from '../../Public/Assets/Media/Exports/exports20.webp';
import exports21 from '../../Public/Assets/Media/Exports/exports21.webp';
import exports22 from '../../Public/Assets/Media/Exports/exports22.webp';


export default function Exports(){
        const { t } = useTranslation();
        const images = [
            exports1,
            exports2,
            exports3,
            exports4,
            exports5,
            exports6,
            exports8,
            exports9,
            exports10,
            exports11,
            exports12,
            exports13,
            exports14,
            exports15,
            exports16,
            exports17,
            exports18,
            exports19,
            exports20,
            exports21,
            exports22,
                    ];
    
    return(
        <>
        <Helmet>
            <title>{t('exports.pageTitle')}</title>
            <meta name="description" content={t('exports.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/exports" />
        </Helmet>

        <div className='exports-container'>
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('exports.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('exports.breadcrumbHome')}</a>
                        <p>{'>'} {t('exports.breadcrumbCurrent')}</p>
                        </div>
                </div>  
                <div className="export-department">
                    <div className="export-department-content">
                        <h2>{t('exports.departmentTitle')}</h2>
                        <p>{t('exports.departmentText')}</p>    
                    </div>
                    <img loading="lazy" src={exports} alt={t('exports.departmentImageAlt')}/>
                </div>   
                <OurMarkets />
                <div className="image-grid">
            <MasonryGrid props={images}/>

            </div>

                <ContactBubble />

            </div>  
            </>  
            )
}