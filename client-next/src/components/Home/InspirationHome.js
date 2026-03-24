'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';


export default function InspirationHome() {
      const router = useRouter();
  const lang = useLang();
      const { t } = useTranslation();

    return(
        <section className="inspiration-home-section" aria-label={t('home.inspirationAlt')}>
            <h2>{t('home.inspiration')}</h2>
            <h4>{t('home.inspirationTitle')}</h4>
            <p>{t('home.inspirationDesc')}</p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    router.push(`/${lang}/inspiration`);
                    window.scrollTo({top: 0});
                }}>{t('home.browseInspiration')}</button>

        </section>
    );
}