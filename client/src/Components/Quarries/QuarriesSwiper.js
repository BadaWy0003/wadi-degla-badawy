import React from "react";
import './Quarries.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


export default function QuarriesSwiper({images}){

    return(
            <Swiper
            autoplay={{
              delay: 2000, // Delay in milliseconds (3 seconds)
              disableOnInteraction: false, // Continue autoplay after user interaction
              pauseOnMouseEnter: true, // Pause autoplay when hovered
            }}    
              navigation
              loop={true}
              pagination={{ clickable: true }}
              slidesPerView={1}
              modules={[Navigation, Pagination, Autoplay]}
              className="quarries-slider"
              lazy={true}
            >
              {images.map((image, i) => (
                <SwiperSlide key={i}>
                  <img src={image} alt={`Slide ${i}`} className="swiper-lazy" />
                  <div className="swiper-lazy-preloader"></div>
                </SwiperSlide>
              ))}
            </Swiper>   
    );
}

