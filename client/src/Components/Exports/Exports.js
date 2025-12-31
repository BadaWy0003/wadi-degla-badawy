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
            { src: exports1, alt: "Open empty export container ready for marble loading" },
            { src: exports2, alt: "Crated marble tiles arranged for container loading" },
            { src: exports3, alt: "Marble slabs securely packed inside container" },
            { src: exports4, alt: "Crates of limestone tiles loaded and secured for export" },
            { src: exports5, alt: "Wooden crates of marble blocks in export yard" },
            { src: exports6, alt: "Export containers stacked with natural stone shipments" },
            { src: exports8, alt: "Forklift loading crated marble tiles into container" },
            { src: exports9, alt: "Marble slabs wrapped and strapped on wooden pallets" },
            { src: exports10, alt: "Crated limestone tiles prepared for international shipping" },
            { src: exports11, alt: "Marble slabs storage area inside export container" },
            { src: exports12, alt: "Rows of packed marble crates ready for export" },
            { src: exports13, alt: "Open container with slabs secured by wooden braces" },
            { src: exports14, alt: "Limestone tiles packed in shrink-wrapped pallets" },
            { src: exports15, alt: "Warehouse palletized marble slabs ready for loading" },
            { src: exports16, alt: "Marble tile crates being arranged inside container" },
            { src: exports17, alt: "Stacked export crates with Wadi Degla branding" },
            { src: exports18, alt: "Marble loading operation in export terminal" },
            { src: exports19, alt: "Open container positioned for block loading" },
            { src: exports20, alt: "Heavy marble blocks aligned for export shipment" },
            { src: exports21, alt: "Stone tiles stacked in wooden crates outdoors" },
            { src: exports22, alt: "Marble packaging line inside factory export zone" },
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