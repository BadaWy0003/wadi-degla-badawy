import React from "react";
import "./CounterSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import CountUp from "react-countup";

import projects from "../../Public/Assets/Icons/projects.svg";
import manpower from "../../Public/Assets/Icons/manpower-stroke.svg";
import tiles from "../../Public/Assets/Icons/tiles.svg";
import technology from "../../Public/Assets/Icons/technology.svg";
import craftsmanship from "../../Public/Assets/Icons/craftsmanship.png";
import global_supply_chain from "../../Public/Assets/Icons/global-supply-chain.svg";
import experience from "../../Public/Assets/Icons/experience.svg";

export default function CounterSection() {
  return (
    <section className="about-counters-section">
      {/* Experience Counter */}
      <div id="experience-card" className="counter-card">
        <img loading="lazy" src={experience} alt="experience-icon" />
        <h3>YEARS OF EXPERIENCE</h3>
        <CountUp start={0} end={45} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
      </div>

      {/* Counters Section (First 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <div className="counters-swiper">
          <Swiper 
            autoplay={{
            delay: 2000, // Delay in milliseconds (3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interaction
            pauseOnMouseEnter: true, // Pause autoplay when hovered
            }}          
            
            loop={true}
            spaceBetween={0} 
            slidesPerView={1} 
            modules={[Navigation, Autoplay]}
            >
            {[ 
              { img: manpower, title: "MANPOWER", count: 500 },
              { img: tiles, title: "M² PRODUCED/DAY", count: 3000 },
              { img: projects, title: "COMPLETED PROJECTS", count: 300 }
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <div className="counter-card">
                  <img loading="lazy" src={item.img} alt={`${item.title}-icon`} />
                  <h3>{item.title}</h3>
                  <CountUp start={0} end={item.count} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grid Layout for Large Screens */}
        <div className="counters-grid">
          <div className="counter-card">
            <img loading="lazy" src={manpower} alt="manpower-icon" />
            <h3>MANPOWER</h3>
            <CountUp start={0} end={500} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={tiles} alt="tiles-icon" />
            <h3>M<sup>2</sup> PRODUCED/DAY</h3>
            <CountUp start={0} end={3000} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={projects} alt="projects-icon" />
            <h3>COMPLETED PROJECTS</h3>
            <CountUp start={0} end={300} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
        </div>
      </div>

      {/* Counters Section (Second 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <div className="counters-swiper">
        <Swiper 
            autoplay={{
            delay: 2000, // Delay in milliseconds (3 seconds)
            disableOnInteraction: false, // Continue autoplay after user interaction
            pauseOnMouseEnter: true, // Pause autoplay when hovered
            }}          
            
            loop={true}
            spaceBetween={10} 
            slidesPerView={1} 
            modules={[Navigation, Autoplay]}
            >
            {[ 
              { img: technology, title: "ADVANCED TECHNOLOGY", text: "State-of-the-art machinery for precision & efficiency." },
              { img: craftsmanship, title: "SKILLED CRAFTSMANSHIP", text: "Generations of knowledge ensuring top quality." },
              { img: global_supply_chain, title: "GLOBAL SUPPLY CHAIN", text: "Strong international partnerships for steady supply." }
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <div className="counter-card">
                  <img loading="lazy" src={item.img} alt={`${item.title}-icon`} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Grid Layout for Large Screens */}
        <div className="counters-grid">
          <div className="counter-card">
            <img loading="lazy" src={technology} alt="technology-icon" />
            <h3>ADVANCED TECHNOLOGY</h3>
            <p>State-of-the-art machinery for precision & efficiency.</p>
          </div>
          <div className="counter-card">
            <img loading="lazy" src={craftsmanship} alt="craftsmanship-icon" />
            <h3>SKILLED CRAFTSMANSHIP</h3>
            <p>Generations of knowledge ensuring top quality.</p>
          </div>
          <div className="counter-card">
            <img loading="lazy" src={global_supply_chain} alt="global-supply-chain-icon" />
            <h3>GLOBAL SUPPLY CHAIN</h3>
            <p>Strong international partnerships for steady supply.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
