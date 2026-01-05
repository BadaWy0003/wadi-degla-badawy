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
            { src: exports1, alt: t('exports.gallery.galleryAlt1') },
            { src: exports2, alt: t('exports.gallery.galleryAlt2') },
            { src: exports3, alt: t('exports.gallery.galleryAlt3') },
            { src: exports4, alt: t('exports.gallery.galleryAlt4') },
            { src: exports5, alt: t('exports.gallery.galleryAlt5') },
            { src: exports6, alt: t('exports.gallery.galleryAlt6') },
            { src: exports8, alt: t('exports.gallery.galleryAlt7') },
            { src: exports9, alt: t('exports.gallery.galleryAlt8') },
            { src: exports10, alt: t('exports.gallery.galleryAlt9') },
            { src: exports11, alt: t('exports.gallery.galleryAlt10') },
            { src: exports12, alt: t('exports.gallery.galleryAlt11') },
            { src: exports13, alt: t('exports.gallery.galleryAlt12') },
            { src: exports14, alt: t('exports.gallery.galleryAlt13') },
            { src: exports15, alt: t('exports.gallery.galleryAlt14') },
            { src: exports16, alt: t('exports.gallery.galleryAlt15') },
            { src: exports17, alt: t('exports.gallery.galleryAlt16') },
            { src: exports18, alt: t('exports.gallery.galleryAlt17') },
            { src: exports19, alt: t('exports.gallery.galleryAlt18') },
            { src: exports20, alt: t('exports.gallery.galleryAlt19') },
            { src: exports21, alt: t('exports.gallery.galleryAlt20') },
            { src: exports22, alt: t('exports.gallery.galleryAlt21') },
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
                        <p>{t('exports.departmentIntro')}</p>
                        <p>{t('exports.departmentSupport')}</p>
                        <p className="export-ensures-title">{t('exports.exportEnsures')}</p>
                        <ul className="export-bullet-list">
                            <li>{t('exports.bulletPoint1')}</li>
                            <li>{t('exports.bulletPoint2')}</li>
                            <li>{t('exports.bulletPoint3')}</li>
                            <li>{t('exports.bulletPoint4')}</li>
                            <li>{t('exports.bulletPoint5')}</li>
                        </ul>
                        <p className="export-mission">{t('exports.missionText')}</p>
                        <p>{t('exports.missionGoal')}</p>
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