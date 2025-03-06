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
        <div className="partners-home-section">
            <h2>Our Partners</h2>
            <Swiper
                slidesPerView={7}
                spaceBetween={30}
                freeMode={true}
                loop={true}
                speed={2000}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    968: {
                        slidesPerView: 3,
                        spaceBetween: 40
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
                        <img src={logo} alt={`Partner ${index + 1}`} />
                    </SwiperSlide>
                ))}
            </Swiper>

            </div>
    );
}