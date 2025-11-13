import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


export default function InspirationHome() {
      const navigate = useNavigate();
      const { t } = useTranslation();

    return(
        <section className="inspiration-home-section">
            <h2>{t('home.inspiration')}</h2>
            <h4>{t('home.inspirationTitle')}</h4>
            <p>{t('home.inspirationDesc')}</p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/inspiration');
                    window.scrollTo({top: 0});
                }}>{t('home.browseInspiration')}</button>

        </section>
    );
}