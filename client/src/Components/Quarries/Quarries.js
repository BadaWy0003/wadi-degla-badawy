import React from "react";
import './Quarries.css';
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import image3 from '../../Public/Assets/Media/3.jpg';
import image21 from '../../Public/Assets/Media/21.jpg';
import image24 from '../../Public/Assets/Media/24.jpg';


export default function Quarries(){

      // Animations
    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      };


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
        <motion.div
          className="quarries-title"
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
        >
          <h2>OUR QUARRIES</h2>
          <hr />
        </motion.div>

        {/* Galala Quarry */}
        <div className="quarry-card left">
          <motion.img
            src={image21}
            alt="Galala Quarry"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft} // Image slides in from the left
          />
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight} // Text slides in from the right
          >
            <h3>Galala Quarry</h3>
            <p>
              Discovered by our pioneering grandfather, this quarry yields the
              iconic Galala Marble known for its elegance and durability.
            </p>
          </motion.div>
        </div>

        {/* Zafarana Quarry */}
        <div className="quarry-card right">
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft} // Text slides in from the left
          >
            <h3>Zafarana Quarry</h3>
            <p>
              A rich source of Zafarana Marble, famous for its pristine white
              color and versatility in architecture.
            </p>
          </motion.div>
          <motion.img
            src={image3}
            alt="Zafarana Quarry"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight} // Image slides in from the right
          />
        </div>

        {/* Creamy White Pearl Quarry */}
        <div className="quarry-card left">
          <motion.img
            src={image24}
            alt="Creamy White Pearl Quarry"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft} // Image slides in from the left
          />
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight} // Text slides in from the right
          >
            <h3>Creamy White Pearl Quarry</h3>
            <p>
              Our latest exclusive discovery, this marble is known for its
              creamy tones and refined texture.
            </p>
          </motion.div>
        </div>

        {/* Samaha Quarry */}
        <div className="quarry-card right">
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft} // Text slides in from the left
          >
            <h3>Samaha Quarry</h3>
            <p>
              Home to Samaha Marble, renowned for its unique texture and
              aesthetic appeal.
            </p>
          </motion.div>
          <motion.img
            src={image3}
            alt="Samaha Quarry"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight} // Image slides in from the right
          />
        </div>
      </section>

      {/* 🏭 Factories Section */}
      <section className="factories">
        <motion.div
          className="quarries-title"
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
        >
          <h2>OUR FACTORIES</h2>
          <hr />
        </motion.div>

        {/* Factory 2000 */}
        <div className="factory-card left">
          <motion.img
            src={image24}
            alt="Factory 2000"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft}
          />
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight}
          >
            <h3>Factory Established in 2000</h3>
            <p>
              Equipped with state-of-the-art technology to process high-quality
              marble and granite.
            </p>
          </motion.div>
        </div>

        {/* Factory 2011 */}
        <div className="factory-card right">
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft}
          >
            <h3>Factory Established in 2011</h3>
            <p>
              Innovative machinery and skilled craftsmanship to refine our
              products.
            </p>
          </motion.div>
          <motion.img
            src={image21}
            alt="Factory 2011"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight}
          />
        </div>

        {/* Factory 2015 */}
        <div className="factory-card left">
          <motion.img
            src={image24}
            alt="Factory 2015"
            initial="hidden"
            whileInView="visible"
            variants={fadeInLeft}
          />
          <motion.div
            className="text"
            initial="hidden"
            whileInView="visible"
            variants={fadeInRight}
          >
            <h3>Factory Established in 2015</h3>
            <p>
              Our latest addition to meet growing demand for premium stone
              products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌍 Global Facilities Section */}
      <section
        className="global"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
      >
        <div className="global-text">
          <motion.div
            className="quarries-title"
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
          >
            <h2>OUR GLOBAL FACILITIES</h2>
            <hr />
          </motion.div>
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