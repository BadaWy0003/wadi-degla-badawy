'use client';
import React from "react";
import './Exports.css';
import 'react-multi-carousel/lib/styles.css';
import { useTranslation } from 'react-i18next';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
// const exports = '/Assets/Media/Exports/exports2.webp';
import OurMarkets from "./OurMarkets";
import ContactBubble from "../Contact/ContactBubble";
import LangLink from '../LangLink';

const exports1 = '/Assets/Media/Packing/packing3.webp';
const exports2 = '/Assets/Media/Packing/packing7.webp';
const exports3 = '/Assets/Media/Exports/exports3.webp';
const exports4 = '/Assets/Media/Exports/exports4.webp';
const exports5 = '/Assets/Media/Exports/exports5.webp';
const exports6 = '/Assets/Media/Exports/exports6.webp';
// const exports7 = '/Assets/Media/Exports/exports7.webp';
const exports8 = '/Assets/Media/Exports/exports8.webp';
const exports9 = '/Assets/Media/Exports/exports9.webp';
const exports10 = '/Assets/Media/Exports/exports10.webp';
const exports11 = '/Assets/Media/Exports/exports11.webp';
const exports12 = '/Assets/Media/Exports/exports12.webp';
const exports13 = '/Assets/Media/Exports/exports13.webp';
const exports14 = '/Assets/Media/Exports/exports14.webp';
const exports15 = '/Assets/Media/Exports/exports15.webp';
const exports16 = '/Assets/Media/Exports/exports16.webp';
const exports17 = '/Assets/Media/Exports/exports17.webp';
const exports18 = '/Assets/Media/Exports/exports18.webp';
const exports19 = '/Assets/Media/Exports/exports19.webp';
const exports20 = '/Assets/Media/Exports/exports20.webp';
const exports21 = '/Assets/Media/Exports/exports21.webp';
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


export default function Exports(){
        const { t } = useTranslation();
        const images = [
            { src: exports24, alt: t('exports.gallery.galleryAlt23') },
            { src: exports25, alt: t('exports.gallery.galleryAlt24') },
            { src: exports26, alt: t('exports.gallery.galleryAlt25') },
            { src: exports27, alt: t('exports.gallery.galleryAlt26') },
            { src: exports28, alt: t('exports.gallery.galleryAlt27') },
            { src: exports29, alt: t('exports.gallery.galleryAlt28') },
            { src: exports30, alt: t('exports.gallery.galleryAlt29') },
            { src: exports31, alt: t('exports.gallery.galleryAlt30') },
            { src: exports32, alt: t('exports.gallery.galleryAlt31') },
            { src: exports33, alt: t('exports.gallery.galleryAlt32') },
            { src: exports34, alt: t('exports.gallery.galleryAlt33') },
            { src: exports35, alt: t('exports.gallery.galleryAlt34') },
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
            { src: exports23, alt: t('exports.gallery.galleryAlt22') },
                    ];
    
    return(
        <>

        <div className='exports-container'>
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>{t('exports.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <LangLink href="/">{t('exports.breadcrumbHome')}</LangLink>
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
                    <img loading="lazy" src={exports26} alt={t('exports.departmentImageAlt')}/>
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