'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';


export default function InspirationHome() {
      const { t } = useTranslation();

    return(
        <section className="inspiration-home-section" aria-label={t('home.inspirationAlt')}>
            <h2>{t('home.inspiration')}</h2>
            <h4>{t('home.inspirationTitle')}</h4>
            <p>{t('home.inspirationDesc')}</p>
                <LangLink href="/inspiration" className="btn-link">
                    <button type="button" className="btn2" style={{marginTop: "2rem"}}>{t('home.browseInspiration')}</button>
                </LangLink>

        </section>
    );
}