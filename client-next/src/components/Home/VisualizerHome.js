'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';


export default function VisualizerHome() {
      const router = useRouter();
  const lang = useLang();
      const { t } = useTranslation();

    return(
        <section className="visualizer-home-section" aria-label={t('home.visualizerAlt')}>
            <div className="visualizer-home-inner">
            <h2>{t('home.bringVisionToLife')}</h2>
            <p>{t('home.bringVisionToLifeDesc')}</p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    router.push(`/${lang}/visualizer`);
                    window.scrollTo({top: 0});
                }}>{t('home.tryNow')}</button>                     

            </div>

        </section>
    );
}