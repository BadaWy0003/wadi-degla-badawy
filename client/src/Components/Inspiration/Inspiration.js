import React from "react";
import './Inspiration.css';
import {ancientImageData, interiorImageData, exteriorImageData} from "./InspirationImageData";
import InspoAncientSwiper from "./InspoAncientSwiper";
import InspoSwiper from "./InspoSwiper";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import '../../i18n';

import ContactBubble from "../Contact/ContactBubble";

export default function Inspiration(){
    const { t } = useTranslation();
    return(
        <>
        <Helmet>
            <title>{t('inspiration.pageTitle')}</title>
            <meta name="description" content={t('inspiration.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/inspiration" />
        </Helmet>

        <div className='inspiration-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>{t('inspiration.heroTitle')}</h1>
                <div className="breadcrumb">
                    <a href="/">{t('inspiration.breadcrumbHome')}</a>
                    <p>{'>'} {t('inspiration.breadcrumbCurrent')}</p>
                </div>
            </div>
            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.ancientTitle')}</h2>
                    <hr/>
                </div>
            </div>
            <InspoAncientSwiper images={ancientImageData} />

            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.interiorTitle')}</h2>
                    <hr/>
                </div>
            </div>
            <InspoSwiper images={interiorImageData} />

            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.exteriorTitle')}</h2>
                    <hr/>
                </div>
            </div>
            <InspoSwiper images={exteriorImageData} />

            <ContactBubble />
        </div>
        </>
    )
}