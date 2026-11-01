'use client';
import React from "react";
import './Partners.css';
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';

const otrovato = '/Assets/Icons/partners/otrovato.png';
const orascom = '/Assets/Icons/partners/orascom.png';
const emaar = '/Assets/Icons/partners/emaar.svg';
const hydepark = '/Assets/Icons/partners/hydepark.png';
const wyndham = '/Assets/Icons/partners/wyndham.png';
const majid_alfuttaim = '/Assets/Icons/partners/majid-alfuttaim.png';
const trade_logistics = '/Assets/Icons/partners/trade-logistics.png';
const egy_consulate_kuwait = '/Assets/Icons/partners/egy-consulate-kuwait.jpeg';
const ckpc = '/Assets/Icons/partners/ckpc.jpeg';
const wd_developments = '/Assets/Icons/partners/wd-developments.jpeg';
const mountain_view = '/Assets/Icons/partners/mountain-view.png';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import LangLink from '../LangLink';

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
        
        <div className='partners-container'>
            <h1>{t('partners.heroTitle')}</h1>
            <div className="breadcrumb">
            <LangLink href="/">{t('partners.breadcrumbHome')}</LangLink>
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