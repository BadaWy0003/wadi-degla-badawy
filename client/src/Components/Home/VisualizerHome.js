import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function VisualizerHome() {
      const navigate = useNavigate();
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
                    navigate('/visualizer');
                    window.scrollTo({top: 0});
                }}>{t('home.tryNow')}</button>                     

            </div>

        </section>
    );
}