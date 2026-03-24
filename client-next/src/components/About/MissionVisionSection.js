'use client';
import React from 'react';
import bullseye_gold from '../../Public/Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../../Public/Assets/Icons/paper-plane-gold.svg'
import "./About.css"
import { useTranslation } from 'react-i18next';
export default function MissionVisionSection() {
    const { t } = useTranslation();
    return(
                    <div className="mission-vision-section">
        
                        <div className="vision-card" >
                            <img loading="lazy" src={paper_plane_gold} alt={t('about.visionIconAlt')}/>
                            <h2>{t('about.visionTitle')}</h2>
                            <p>{t('about.visionText')}</p>
                        </div>
                        <div className="mission-card">
                            <img loading="lazy" src={bullseye_gold} alt={t('about.missionIconAlt')}/>
                            <h2>{t('about.missionTitle')}</h2>
                            <p>{t('about.missionText')}</p>
                        </div>
        
                    </div> 
        
    );
}