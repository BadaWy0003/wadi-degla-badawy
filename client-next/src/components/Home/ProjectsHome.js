'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';


export default function ProjectsHome() {
      const router = useRouter();
  const lang = useLang();
      const { t } = useTranslation();

    return(
        <section className="projects-home-section" aria-label={t('home.projectsAlt')}>
            <h2>{t('home.experienceWork')}</h2>
            <p>{t('home.experienceWorkDesc')}</p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    router.push(`/${lang}/projects`);
                    window.scrollTo({top: 0});
                }}>{t('home.viewProjects')}</button>                     


        </section>
    );
}