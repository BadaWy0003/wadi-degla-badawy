'use client';
import React from "react";
import './Machinery.css';
import { generalUseData, mngBlocksData, mngSlabsData, mngTilesData } from "./MachineryData";
import MachinerySwiper from "./MachinerySwiper";
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';


export default function Machinery(){
    const { t } = useTranslation();
    
    return(
        <>
        <Helmet>
            <title>{t('machinery.pageTitle')}</title>
            <meta name="description" content={t('machinery.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/machinery" />
        </Helmet>
        
        <div className='machinery-container'>
                    {/* 🌟 Hero Section */}
                    <div className="quarries-hero">
                        <h1>{t('machinery.heroTitle')}</h1>
                        <div className="breadcrumb">
                        <a href="/">{t('machinery.breadcrumbHome')}</a>
                        <p>{'>'} {t('machinery.breadcrumbCurrent')}</p>
                        </div>
                </div>  
                <div className="machinery-intro">
                    <p>{t('machinery.intro')}</p>    
                </div>   

                {/*GENERAL USE SECTION*/}  
                <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>{t('machinery.sections.generalUse')}</h2>
                        <hr/>
                    </div>
                    <p className="machinery-captions">{t('machinery.generalUse.caption')}</p>
                    <div className="machinery-grid">
                    {generalUseData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={t(item.titleKey)} description={t(item.descriptionKey)} />
                        ))}
                    </div>
                    </div>
                    
                    {/*BLOCKS SECTION*/}
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>{t('machinery.sections.blocks')}</h2>
                        <hr/>
                    </div>
                    <p className="machinery-captions">{t('machinery.blocks.caption1')}</p>
                    <div className="machinery-grid">
                    {mngBlocksData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={t(item.titleKey)} description={t(item.descriptionKey)} />
                        ))}
                    </div>
                    </div>

                    {/*SLABS SECTION*/}  
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>{t('machinery.sections.slabs')}</h2>
                        <hr/>
                    </div>    
                    <p className="machinery-captions">{t('machinery.slabs.caption')}</p>

                    <div className="machinery-grid">
                    {mngSlabsData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={t(item.titleKey)} description={t(item.descriptionKey)} />
                        ))}
                    </div>
                    </div>

                    {/*TILES SECTION*/} 
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>{t('machinery.sections.tiles')}</h2>
                        <hr/>
                    </div>
                    <p className="machinery-captions">{t('machinery.tiles.caption')}</p>

                    <div className="machinery-grid">
                    {mngTilesData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={t(item.titleKey)} description={t(item.descriptionKey)} />
                        ))}
                    </div>
                    </div>

                    <ContactBubble />
            </div>    
            </>
            )
}