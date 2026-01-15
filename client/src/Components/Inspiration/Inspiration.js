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
                <h3>{t('inspiration.ancientSubtitle')}</h3>
                <p>
                    {t('inspiration.ancientDescription').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.ancientDescription').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>
            <InspoAncientSwiper images={ancientImageData} />

            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.interiorTitle')}</h2>
                    <hr/>
                </div>
                <h3>{t('inspiration.interiorSubtitle')}</h3>
                <p>
                    {t('inspiration.interiorDescription').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.interiorDescription').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
                <h3>{t('inspiration.interiorApplicationsTitle')}</h3>
                <p>
                    {t('inspiration.interiorApplicationsList').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.interiorApplicationsList').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>
            <InspoSwiper images={interiorImageData} />

            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.exteriorTitle')}</h2>
                    <hr/>
                </div>
                <h3>{t('inspiration.exteriorSubtitle')}</h3>
                <p>
                    {t('inspiration.exteriorDescription').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.exteriorDescription').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
                <h3>{t('inspiration.exteriorApplicationsTitle')}</h3>
                <p>
                    {t('inspiration.exteriorApplicationsList').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.exteriorApplicationsList').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>
            <InspoSwiper images={exteriorImageData} />

            <div className="inspo-ancient-section">
                <div className="inspo-section-title">
                    <h2>{t('inspiration.whyChooseTitle')}</h2>
                    <hr/>
                </div>
                <h3>{t('inspiration.whyChooseSubtitle')}</h3>
                <p>
                    {t('inspiration.whyChooseList').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            {index < t('inspiration.whyChooseList').split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </p>
            </div>

            <ContactBubble />
        </div>
        </>
    )
}