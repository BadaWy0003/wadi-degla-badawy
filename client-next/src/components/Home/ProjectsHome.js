'use client';
import React from "react";
import "./Home.css";
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';


export default function ProjectsHome() {
      const { t } = useTranslation();

    return(
        <section className="projects-home-section" aria-label={t('home.projectsAlt')}>
            <h2>{t('home.experienceWork')}</h2>
            <p>{t('home.experienceWorkDesc')}</p>
                <LangLink href="/projects" className="btn-link">
                    <button type="button" className="btn2" style={{marginTop: "2rem"}}>{t('home.viewProjects')}</button>
                </LangLink>                     


        </section>
    );
}