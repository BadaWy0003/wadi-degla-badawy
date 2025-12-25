import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import './History.css';
import MasonryGrid from '../MasonryGrid/MasonryGrid';
import ContactBubble from '../Contact/ContactBubble';
import CountUp from 'react-countup';
import history16 from '../../Public/Assets/Media/History/history16.webp'
import sameh_ghanam from '../../Public/Assets/Media/History/sameh-ghanam.webp'
import saeed_jr from '../../Public/Assets/Media/History/saeed-jr.webp'
import saeed_jr_2 from '../../Public/Assets/Media/History/saeed-jr-2.webp'
import saeed_jr_3 from '../../Public/Assets/Media/History/saeed-jr-3.webp'
import saeed_jr_4 from '../../Public/Assets/Media/History/saeed-jr-4.webp'
import saeed_jr_5 from '../../Public/Assets/Media/History/saeed-jr-5.webp'
import { HistoryImages } from './HistoryImages';
import { Helmet } from 'react-helmet-async';



export default function History() {
    const { t } = useTranslation();
    return (
        <>
        <Helmet>
            <title>{t('history.pageTitle')}</title>
            <meta name="description" content={t('history.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/history" />
        </Helmet>
        <div className='history-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>{t('history.heroTitle')}</h1>
                <div className="breadcrumb">
                <a href="/">{t('history.breadcrumbHome')}</a>
                <p>{'>'} {t('history.breadcrumbCurrent')}</p>
                </div>
            </div>
            {/* Intro Section */}
            <div className="history-intro-section">
                <div className="history-intro-section-title">
                <h2>{t('history.foundedTitle')}</h2>
                <CountUp start={2025}
                            end={1980}
                            duration={3}
                            delay={2}
                            enableScrollSpy={true}
                            separator=""
                            suffix=""
                            style={{ fontSize: '100px', fontWeight: 900, color: 'var(--goldColor)'}}
                />
                </div>
                
                <p className="first-gen-intro">{t('history.firstGenIntro')}</p>
            </div>
            <div className="first-gen-section">
                <div className="first-gen-title">
                    <hr/>
                    <h2>{t('history.visionTitle')}</h2>
                </div>
                <div className="first-gen-section-content">
                    <div className="first-gen-section-text">
                        <h3>{t('history.firstBreakthroughTitle')}</h3>
                        <p>{t('history.firstBreakthroughText')}</p>
                        <h3>{t('history.familyExpansionTitle')}</h3>
                        <p>{t('history.familyExpansionText')}</p>
                    </div>
                    <div className="first-gen-section-image">
                        <img loading="lazy" src={history16} alt={t('history.firstGenAlt')}/>
                    </div>
                </div>
            </div>
            <div className="second-gen-section">
                <div className="second-gen-title">
                    <hr/>
                    <h2>{t('history.secondGenTitle')}</h2>
                </div>
                <div className="second-gen-section-content">
                    <div className="second-gen-section-text">
                        <p>{t('history.secondGenText')}</p>
                        <p>{t('history.secondGenPartnershipText')}</p>
                    </div>
                    <div className="second-gen-section-image">
                        <img loading="lazy" src={sameh_ghanam} alt={t('history.secondGenAlt')}/>
                    </div>
                </div>
            </div>
            <div className="third-gen-section">
                <div className="third-gen-title">
                    <hr/>
                    <h2>{t('history.thirdGenTitle')}</h2>
                </div>
                <div className="third-gen-section-content">
                    <div className="third-gen-section-image">
                        <img loading="lazy" src={saeed_jr} alt={t('history.thirdGenAlt')}/>
                    </div>
                    <div className="third-gen-section-text">
                        <p>{t('history.thirdGenText')}</p>
                    </div>
                    <div className="third-gen-section-gallery">
                        <img loading="lazy" src={saeed_jr_2} alt={t('history.thirdGenGalleryAlt1')}/>
                        <img loading="lazy" src={saeed_jr_3} alt={t('history.thirdGenGalleryAlt2')}/>
                        <img loading="lazy" src={saeed_jr_4} alt={t('history.thirdGenGalleryAlt3')}/>
                        <img loading="lazy" src={saeed_jr_5} alt={t('history.thirdGenGalleryAlt4')}/>
                    </div>
                </div>
            </div>
            <div className="legacy-section">
                <div className="legacy-title">
                    <hr/>
                    <h2>{t('history.legacyTitle')}</h2>
                </div>
                <div className="legacy-section-content">
                    <div className="legacy-section-text">
                        <p>{t('history.legacyIntroText')}</p>
                    </div>
                    <MasonryGrid props={HistoryImages}/>
                </div>
            </div>
            <div className='history-final-section' alt={t('history.finalSectionAlt')}>
                <h2>{t('history.finalSectionTitle')}</h2>
                <p>{t('history.finalText1')}</p>
                <p>{t('history.finalText2')}</p>
            </div>
            <ContactBubble />
        </div>
        </>
    );
}
