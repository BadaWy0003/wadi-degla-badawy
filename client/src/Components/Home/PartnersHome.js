import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import "./Home.css";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Autoplay } from 'swiper/modules';

import { partnerLogos } from "../Partners/Partners.js";

export default function PartnersHome() {

    return(
        <section className="partners-home-section">
            <h2>Our Partners & Clients</h2>
            <Swiper
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                speed={2000}
                autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 0, // Remove space for better centering
                        centeredSlides: true, // Center the single slide
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
                        <img id={`Partner-logo-home-${index + 1}`} src={logo} alt={`Partner ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>

            </section>
    );
}