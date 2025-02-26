import React from "react";
import './Quarries.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import image03 from '../../Public/Assets/Media/3.jpg';
import image21 from '../../Public/Assets/Media/21.jpg';
import image24 from '../../Public/Assets/Media/24.jpg';
import creamy_white_pearl_quarry_1 from '../../Public/Assets/Media/Quarries/creamy-white-pearl-quarry-1.jpeg';
import creamy_white_pearl_quarry_2 from '../../Public/Assets/Media/Quarries/creamy-white-pearl-quarry-2.jpeg';
import creamy_white_pearl_quarry_3 from '../../Public/Assets/Media/Quarries/creamy-white-pearl-quarry-3.jpeg';
import creamy_white_pearl_quarry_4 from '../../Public/Assets/Media/Quarries/creamy-white-pearl-quarry-4.jpeg';
import galala_quarry_1 from '../../Public/Assets/Media/Quarries/galala-quarry-1.jpeg';
import galala_quarry_2 from '../../Public/Assets/Media/Quarries/galala-quarry-2.jpeg';
import galala_quarry_3 from '../../Public/Assets/Media/Quarries/galala-quarry-3.jpeg';
import galala_quarry_4 from '../../Public/Assets/Media/Quarries/galala-quarry-4.jpeg';
import image1 from '../../Public/Assets/Media/Quarries/first-factory/image1.jpeg';
import image2 from '../../Public/Assets/Media/Quarries/first-factory/image2.jpeg';
import image3 from '../../Public/Assets/Media/Quarries/first-factory/image3.jpeg';
import image4 from '../../Public/Assets/Media/Quarries/first-factory/image4.jpeg';
import image5 from '../../Public/Assets/Media/Quarries/first-factory/image5.jpeg';
import image6 from '../../Public/Assets/Media/Quarries/first-factory/image6.jpeg';
import image7 from '../../Public/Assets/Media/Quarries/first-factory/image7.jpeg';
import image8 from '../../Public/Assets/Media/Quarries/first-factory/image8.jpeg';
import image9 from '../../Public/Assets/Media/Quarries/first-factory/image9.jpeg';

import secondfactory1 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory1.jpg';
import secondfactory2 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory2.jpg';
import secondfactory3 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory3.jpeg';
import secondfactory4 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory4.jpeg';
import secondfactory5 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory5.jpg';
import secondfactory6 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory6.jpeg';
import secondfactory7 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory7.jpeg';
import secondfactory8 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory8.jpeg';
import secondfactory9 from '../../Public/Assets/Media/Quarries/second-factory/secondfactory9.jpeg';

import third_factory1 from '../../Public/Assets/Media/Quarries/third-factory/thirdfactory1.jpeg';
import third_factory2 from '../../Public/Assets/Media/Quarries/third-factory/thirdfactory2.jpeg';
import third_factory3 from '../../Public/Assets/Media/Quarries/third-factory/thirdfactory3.jpeg';
import third_factory4 from '../../Public/Assets/Media/Quarries/third-factory/thirdfactory4.jpg';


export default function Quarries(){
  
  const globalFactoriesImages = [
          {
            images: [image03, image21, image24]
          }]

  const galalaQuarryImages = [
    {
      images: [galala_quarry_1, galala_quarry_4, galala_quarry_2, galala_quarry_3]
    }]

  // const zaafranaQuarryImages = [
  //   {
  //     images: [image03, image21, image24]
  //   }]

  const creamyQuarryImages = [
    {
      images: [creamy_white_pearl_quarry_2, creamy_white_pearl_quarry_1, creamy_white_pearl_quarry_3, creamy_white_pearl_quarry_4]
    }]

  // const samahaQuarryImages = [
  //   {
  //     images: [image03, image21, image24]
  //   }]

  const firstFactoryImages = [
    {
      images: [image8,
              image2,
              image3,
              image4,
              image5,
              image6,
              image7,
              image1,
              image9]
    }]

  const secondFactoryImages = [
    {
      images: [secondfactory6,
              secondfactory1,
              secondfactory2,
              secondfactory3,
              secondfactory4,
              secondfactory5,
              secondfactory7,
              secondfactory8,
              secondfactory9]
    }]

  const thirdFactoryImages = [
    {
      images: [third_factory4,
                third_factory1,
                third_factory2,
                third_factory3]
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
        <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="quarries-slider"
        lazy={true}
        >
        {galalaQuarryImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
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
            <h3>Creamy White Pearl Quarry</h3>
            <p>
            Our latest exclusive discovery, this marble is known for its
            creamy tones and refined texture.
            </p>
          </div>
          <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="quarries-slider"
        lazy={true}
        >
        {creamyQuarryImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
        </div>

        {/* Creamy White Pearl Quarry */}

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
        <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="quarries-slider"
        lazy={true}
        >
        {firstFactoryImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
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
          <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="quarries-slider"
        lazy={true}
        >
        {secondFactoryImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
        </div>

        {/* Factory 2015 */}
        <div className="factory-card left">
        <Swiper
        loop={true} // Enable infinite loop
        pagination={{ clickable: true }}
        slidesPerView={1}
        modules={[Pagination, Autoplay]}
        className="quarries-slider"
        lazy={true}
        >
        {thirdFactoryImages[0].images.map((image, i) => (
            <SwiperSlide key={i}>
            <img src={image} alt={`${i}`} className="swiper-lazy"/>
            <div className="swiper-lazy-preloader"></div>
            </SwiperSlide>
        ))}
        </Swiper>
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