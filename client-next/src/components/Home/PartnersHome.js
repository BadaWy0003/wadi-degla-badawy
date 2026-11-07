'use client';
import React, { useEffect, useRef } from "react";
import "./Home.css";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import { useNearScreen, useLazyComponent } from '../../util/near-screen';

import { partnerLogos } from "../Partners/Partners.js";

// The slider's markup without the slider code: same classes, so the same size.
function PartnersPlaceholder() {
    return (
        <div className="swiper partners-swiper">
            <div className="swiper-wrapper">
                {partnerLogos.map((logo, index) => (
                    <div key={index} className="swiper-slide partner-slide">
                        <img loading="lazy" src={logo} alt={`Partner ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const loadPartnersSlider = () => import('./PartnersSlider');

export default function PartnersHome() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const sliderRef = useRef(null);
    const PartnersSlider = useLazyComponent(useNearScreen(sliderRef), loadPartnersSlider);

    useEffect(() => {
        // Force document direction update
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }, [isRTL]);

    return(
        <section className="partners-home-section">
            <h2>{t('home.partnersClients')}</h2>
            <p>{t('home.partnersDescription')}</p>
            {/* Same markup as the slider before it starts (same height); the slider code loads
                when the section comes near the screen. */}
            <div ref={sliderRef} className="partners-slider-box">
                {PartnersSlider ? (
                    <PartnersSlider isRTL={isRTL} alt={t('home.partnersAlt')} />
                ) : (
                    <PartnersPlaceholder />
                )}
            </div>

            </section>
    );
}