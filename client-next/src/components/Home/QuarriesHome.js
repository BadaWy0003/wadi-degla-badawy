'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';


export default function QuarriesHome() {
      const { t } = useTranslation();

    return(
        <section className="quarries-home-section lazy-bg">
            <h2>{t('home.globalQuarries')}</h2>
            <h4>{t('home.globalQuarriesTitle')}</h4>
            <p>{t('home.globalQuarriesDesc')}</p>
                <LangLink href="/quarries" className="btn-link" title={t('home.globalQuarriesAlt')}>
                    <button type="button" className="btn2" style={{marginTop: "2rem"}}>{t('home.learnMore')}</button>
                </LangLink>                     

        </section>
    );
}