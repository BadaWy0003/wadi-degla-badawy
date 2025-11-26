import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "./Home.css";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import { FreeMode, Autoplay } from 'swiper/modules';

import { partnerLogos } from "../Partners/Partners.js";

export default function PartnersHome() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        // Force document direction update
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }, [isRTL]);

    return(
        <section className="partners-home-section">
            <h2>{t('home.partnersClients')}</h2>
            <Swiper
                key={`partners-swiper-${isRTL}`}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                speed={2000}
                dir={isRTL ? 'rtl' : 'ltr'}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    reverseDirection: isRTL,
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                        centeredSlides: true,
                    },
                    768: {
                        slidesPerView: 3, 
                        spaceBetween: 15
                    },
                    968: {
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 50
                    }
                }}
                modules={[FreeMode, Autoplay]}
                className="partners-swiper"
            >
                {partnerLogos.map((logo, index) => (
                    <SwiperSlide key={index} className="partner-slide">
                        <img loading="lazy" id={`Partner-logo-home-${index + 1}`} src={logo} alt={`Partner ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>

            </section>
    );
}