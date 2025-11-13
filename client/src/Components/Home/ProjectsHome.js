import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function ProjectsHome() {
      const navigate = useNavigate();
      const { t } = useTranslation();

    return(
        <section className="projects-home-section">
            <h2>{t('home.experienceWork')}</h2>
            <p>{t('home.experienceWorkDesc')}</p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/projects');
                    window.scrollTo({top: 0});
                }}>{t('home.viewProjects')}</button>                     


        </section>
    );
}