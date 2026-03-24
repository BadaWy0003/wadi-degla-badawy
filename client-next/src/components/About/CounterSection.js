'use client';
import React from "react";
import "./CounterSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import CountUp from "react-countup";
import { useTranslation } from 'react-i18next';

const projects = '/Assets/Icons/projects.svg';
const manpower = '/Assets/Icons/manpower-stroke.svg';
const tiles = '/Assets/Icons/tiles.svg';
const technology = '/Assets/Icons/technology.svg';
const craftsmanship = '/Assets/Icons/craftsmanship.png';
const global_supply_chain = '/Assets/Icons/global-supply-chain.svg';
const experience = '/Assets/Icons/experience.svg';

export default function CounterSection() {
  const { t } = useTranslation();
  return (
    <section className="about-counters-section">
      <h2>{t('about.counters.sectionTitle')}</h2>
      
      {/* Experience Counter */}
      <div id="experience-card" className="counter-card">
        <img loading="lazy" src={experience} alt={t('about.counters.experienceIconAlt')} />
        <h3>{t('about.counters.experienceTitle')}</h3>
        <CountUp start={0} end={45} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
      </div>

      {/* Counters Section (First 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <div className="counters-swiper">
          <Swiper 
            autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            }}          
            
            loop={true}
            spaceBetween={0} 
            slidesPerView={1} 
            modules={[Navigation, Autoplay]}
            >
            {[ 
              { img: manpower, title: t('about.counters.manpowerTitle'), count: 500 },
              { img: tiles, title: t('about.counters.productionTitle'), count: 3000 },
              { img: projects, title: t('about.counters.projectsTitle'), count: 300 }
            ].map((item, index) => (
              <SwiperSlide key={index}>
                <div className="counter-card">
                  <img loading="lazy" src={item.img} alt={`${item.title.toLowerCase()}-icon`} />
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
            <img loading="lazy" src={manpower} alt={t('about.counters.manpowerIconAlt')} />
            <h3>{t('about.counters.manpowerTitle')}</h3>
            <CountUp start={0} end={500} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={tiles} alt={t('about.counters.productionIconAlt')} />
            <h3>{t('about.counters.productionTitle')}</h3>
            <CountUp start={0} end={3000} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={projects} alt={t('about.counters.projectsIconAlt')} />
            <h3>{t('about.counters.projectsTitle')}</h3>
            <CountUp start={0} end={300} duration={3} enableScrollSpy={true} suffix=" +" className="counter-text" />
          </div>
        </div>
      </div>

      <h2>{t('about.counters.sectionTitle2')}</h2>

      {/* Counters Section (Second 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <div className="counters-swiper">
        <Swiper 
            autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            }}          
            
            loop={true}
            spaceBetween={10} 
            slidesPerView={1} 
            modules={[Navigation, Autoplay]}
            >
            {[ 
              { img: technology, title: t('about.counters.technologyTitle'), text: t('about.counters.technologyText') },
              { img: craftsmanship, title: t('about.counters.craftsmanshipTitle'), text: t('about.counters.craftsmanshipText') },
              { img: global_supply_chain, title: t('about.counters.supplyChainTitle'), text: t('about.counters.supplyChainText') }
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
            <img loading="lazy" src={technology} alt={t('about.counters.technologyIconAlt')} />
            <h3>{t('about.counters.technologyTitle')}</h3>
            <p>{t('about.counters.technologyText')}</p>
          </div>
          <div className="counter-card">
            <img loading="lazy" src={craftsmanship} alt={t('about.counters.craftsmanshipIconAlt')} />
            <h3>{t('about.counters.craftsmanshipTitle')}</h3>
            <p>{t('about.counters.craftsmanshipText')}</p>
          </div>
          <div className="counter-card">
            <img loading="lazy" src={global_supply_chain} alt={t('about.counters.supplyChainIconAlt')} />
            <h3>{t('about.counters.supplyChainTitle')}</h3>
            <p>{t('about.counters.supplyChainText')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
