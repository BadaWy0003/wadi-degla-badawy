'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';


export default function QuarriesHome() {
      const router = useRouter();
  const lang = useLang();
      const { t } = useTranslation();

    return(
        <section className="quarries-home-section">
            <h2>{t('home.globalQuarries')}</h2>
            <h4>{t('home.globalQuarriesTitle')}</h4>
            <p>{t('home.globalQuarriesDesc')}</p>
                <button
                alt={t('home.globalQuarriesAlt')}
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    router.push(`/${lang}/quarries`);
                    window.scrollTo({top: 0});
                }}>{t('home.learnMore')}</button>                     

        </section>
    );
}