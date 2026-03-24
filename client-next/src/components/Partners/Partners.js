'use client';
import React from "react";
import './Partners.css';
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';

import otrovato from '../../Public/Assets/Icons/partners/otrovato.png';
import orascom from '../../Public/Assets/Icons/partners/orascom.png';
import emaar from '../../Public/Assets/Icons/partners/emaar.svg';
import hydepark from '../../Public/Assets/Icons/partners/hydepark.png';
import wyndham from '../../Public/Assets/Icons/partners/wyndham.png';
import majid_alfuttaim from '../../Public/Assets/Icons/partners/majid-alfuttaim.png';
import trade_logistics from '../../Public/Assets/Icons/partners/trade-logistics.png';
import egy_consulate_kuwait from '../../Public/Assets/Icons/partners/egy-consulate-kuwait.jpeg';
import ckpc from '../../Public/Assets/Icons/partners/ckpc.jpeg';
import wd_developments from '../../Public/Assets/Icons/partners/wd-developments.jpeg';
import mountain_view from '../../Public/Assets/Icons/partners/mountain-view.png';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

    // Array of partner logo image URLs
    export const partnerLogos = [
        otrovato,
        orascom,
        emaar,
        egy_consulate_kuwait,
        wyndham,
        hydepark,
        majid_alfuttaim,
        trade_logistics,
        ckpc,
        wd_developments,
        mountain_view,
    ];

export default function Partners() {
    const router = useRouter();
  const lang = useLang();
    const { t } = useTranslation();

    
    const handleButtonClick = () => {
        router.push(`/${lang}/contact`); // Navigate to the contact page
    };

    return (
        <>
        <Helmet>
            <title>{t('partners.pageTitle')}</title>
            <meta name="description" content={t('partners.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/partners" />
        </Helmet>
        
        <div className='partners-container'>
            <h1>{t('partners.heroTitle')}</h1>
            <div className="breadcrumb">
            <a href="/">{t('partners.breadcrumbHome')}</a>
            <p>{'>'} {t('partners.breadcrumbCurrent')}</p>
            </div>

            <div className="partners">
                {partnerLogos.map((logo, index) => (
                    <img loading="lazy"
                        id={`partner-logo-${index + 1}`}
                        key={index} // Unique key for each logo
                        src={logo}
                        alt={t('partners.imageAlt', { number: index + 1 })}
                    />
                ))}
            </div>

            <button className="btn1" onClick={handleButtonClick}>
                {t('partners.cta')}
            </button>
            <ContactBubble />
        </div>
        </>
    );
}