import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function QuarriesHome() {
      const navigate = useNavigate();
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
                    navigate('/quarries');
                    window.scrollTo({top: 0});
                }}>{t('home.learnMore')}</button>                     

        </section>
    );
}