import React from "react";
import './Quarries.css';
import QuarriesSwiper from "./QuarriesSwiper";
import {galalaQuarryImages, creamyQuarryImages, firstFactoryImages, secondFactoryImages, thirdFactoryImages} from "./QuarriesImageData";
import ContactBubble from "../Contact/ContactBubble";


export default function Quarries(){
  
    
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
          <QuarriesSwiper images={galalaQuarryImages} />
          <div
            className="text"
            
          >
            <h3>Galala Quarries</h3>
            <p>
              Discovered by our pioneering grandfather, these quarries yield the
              iconic Galala Marble known for its elegance and durability.
            </p>
          </div>
        </div>

        {/* Creamy Quarry */}
        <div className="quarry-card right">
          <div
            className="text"
            
          >
            <h3>Creamy White Pearl Quarry</h3>
            <p>
            Our latest exclusive discovery, this marble is known for its
            creamy tones and refined texture.
            </p>
          </div>
          <QuarriesSwiper images={creamyQuarryImages} />
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
        <p className="machinery-captions">Our state-of-the-art factories span a combined area of over 
          27,000 square meters, ensuring top-quality production 
          at scale.</p>

        {/* Factory 2000 */}
        <div className="factory-card left">
        <QuarriesSwiper images={firstFactoryImages} />
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
          <QuarriesSwiper images={secondFactoryImages} />
          </div>

        {/* Factory 2015 */}
        <div className="factory-card left">
        <QuarriesSwiper images={thirdFactoryImages} />
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
          <div className="coming-soon">
        <h1>Coming Soon</h1>
        </div>

          {/* <p>
            Expanding to Gambia, Africa, and South America with Cleopatra by
            Wadi Degla.
          </p> */}
        </div>
        {/* <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        navigation
        slidesPerView={1}
        autoplay={{
            delay: 3000, // Autoplay delay in milliseconds (3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interaction
            pauseOnMouseEnter: true, // Pause autoplay on hover
          }}        
        modules={[Navigation, Pagination, Autoplay]}
        className="global-facilities-slider"
        lazy={true}
        >
        {globalFactoriesImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img loading="lazy" src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper> */}
        
      </section>
      <ContactBubble />

      </div>
              
            )
}