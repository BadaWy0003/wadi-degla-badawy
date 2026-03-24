'use client';
import React from "react";
import './NotFound404.css';
import ContactBubble from "../Contact/ContactBubble";
import logo_color_stroke from "../../Public/Assets/Media/logo-color-stroke-notext.svg"
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

export default function NotFound404() {
    const router = useRouter();
  const lang = useLang();
    const { t } = useTranslation();
    
    return (
        <>
        <Helmet>
            <title>{t('notFound.pageTitle')}</title>
            <meta name="description" content={t('notFound.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/*" />
        </Helmet>

        <div className="page-404">
            <div className="container-404">
                <img loading="lazy" 
                src={logo_color_stroke} 
                alt={t('notFound.logoAlt')} 
                className="logo-404" />
                <div className="content-404">
                <h1>{t('notFound.heading')}</h1>
                <p>{t('notFound.message')}</p>
                <button
                    className="btn1"
                    style={{marginTop: "2rem"}}
                    onClick={() => {
                        router.push(`/${lang}/`);
                        window.scrollTo({top: 0});
                    }}>{t('notFound.buttonText')}</button>  
            </div>
        </div>                   
            <ContactBubble />
        </div>
        </>
    );
}
