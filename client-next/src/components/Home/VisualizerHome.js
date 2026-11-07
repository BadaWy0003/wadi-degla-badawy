'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';


export default function VisualizerHome() {
      const { t } = useTranslation();

    return(
        <section className="visualizer-home-section" aria-label={t('home.visualizerAlt')}>
            <div className="visualizer-home-inner lazy-bg">
            <h2>{t('home.bringVisionToLife')}</h2>
            <p>{t('home.bringVisionToLifeDesc')}</p>
                <LangLink href="/visualizer" className="btn-link">
                    <button type="button" className="btn2" style={{marginTop: "2rem"}}>{t('home.tryNow')}</button>
                </LangLink>                     

            </div>

        </section>
    );
}