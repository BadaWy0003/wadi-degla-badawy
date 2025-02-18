import React from "react";
import './Quarries.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import image3 from '../../Public/Assets/Media/3.jpg';
import image21 from '../../Public/Assets/Media/21.jpg';
import image24 from '../../Public/Assets/Media/24.jpg';


export default function Quarries(){
  
  const globalFactoriesImages = [
          {
            images: [image3, image21, image24]
          }]
    
    
    return(
        <div className="quarries-container">

        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>OUR QUARRIES & FACTORIES</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Quarries & Factories</p>
                        </div>
                </div>  
  
      {/* 🏔️ Quarries Section */}
      <section className="quarries">
        <div
          className="quarries-title"
        >
          <h2>OUR QUARRIES</h2>
          <hr />
        </div>

        {/* Galala Quarry */}
        <div className="quarry-card left">
          <img
            src={image21}
            alt="Galala Quarry"

          />
          <div
            className="text"
            
          >
            <h3>Galala Quarry</h3>
            <p>
              Discovered by our pioneering grandfather, this quarry yields the
              iconic Galala Marble known for its elegance and durability.
            </p>
          </div>
        </div>

        {/* Zafarana Quarry */}
        <div className="quarry-card right">
          <div
            className="text"
            
          >
            <h3>Zafarana Quarry</h3>
            <p>
              A rich source of Zafarana Marble, famous for its pristine white
              color and versatility in architecture.
            </p>
          </div>
          <img
            src={image3}
            alt="Zafarana Quarry"
            
          />
        </div>

        {/* Creamy White Pearl Quarry */}
        <div className="quarry-card left">
          <img
            src={image24}
            alt="Creamy White Pearl Quarry"

          />
          <div
            className="text"
            
          >
            <h3>Creamy White Pearl Quarry</h3>
            <p>
              Our latest exclusive discovery, this marble is known for its
              creamy tones and refined texture.
            </p>
          </div>
        </div>

        {/* Samaha Quarry */}
        <div className="quarry-card right">
          <div
            className="text"
            
          >
            <h3>Samaha Quarry</h3>
            <p>
              Home to Samaha Marble, renowned for its unique texture and
              aesthetic appeal.
            </p>
          </div>
          <img
            src={image3}
            alt="Samaha Quarry"
            
          />
        </div>
      </section>

      {/* 🏭 Factories Section */}
      <section className="factories">
        <div
          className="quarries-title"
          
        >
          <h2>OUR FACTORIES</h2>
          <hr />
        </div>

        {/* Factory 2000 */}
        <div className="factory-card left">
          <img
            src={image24}
            alt="Factory 2000"
          />
          <div
            className="text"
            
          >
            <h3>Factory Established in 2000</h3>
            <p>
              Equipped with state-of-the-art technology to process high-quality
              marble and granite.
            </p>
          </div>
        </div>

        {/* Factory 2011 */}
        <div className="factory-card right">
          <div
            className="text"
            
          >
            <h3>Factory Established in 2011</h3>
            <p>
              Innovative machinery and skilled craftsmanship to refine our
              products.
            </p>
          </div>
          <img
            src={image21}
            alt="Factory 2011"
          />
        </div>

        {/* Factory 2015 */}
        <div className="factory-card left">
          <img
            src={image24}
            alt="Factory 2015"
            />
            <div
            className="text"
            
          >
            <h3>Factory Established in 2015</h3>
            <p>
              Our latest addition to meet growing demand for premium stone
              products.
            </p>
          </div>
        </div>
      </section>

      {/* 🌍 Global Facilities Section */}
      <section
        className="global"
      >
        <div className="global-text">
          <div
            className="quarries-title"
            
          >
            <h2>OUR GLOBAL FACILITIES</h2>
            <hr />
          </div>
          <p>
            Expanding to Gambia, Africa, and South America with Cleopatra by
            Wadi Degla.
          </p>
        </div>
        <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        navigation
        autoplay={{
            delay: 3000, // Autoplay delay in milliseconds (3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interaction
            pauseOnMouseEnter: true, // Pause autoplay on hover
          }}        
        modules={[Pagination, Autoplay]}
        className="global-facilities-slider"
        lazy={true}
        >
        {globalFactoriesImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
        
      </section>
  
      </div>
              
            )
}