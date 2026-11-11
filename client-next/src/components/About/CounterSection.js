'use client';
import React, { useRef } from "react";
import "./CounterSection.css";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNearScreen, useLazyComponent } from "../../util/near-screen";
import StatCounter from "./StatCounter";
import { useTranslation } from 'react-i18next';

const projects = '/Assets/Icons/projects.svg';
const manpower = '/Assets/Icons/manpower-stroke.svg';
const tiles = '/Assets/Icons/tiles.svg';
const technology = '/Assets/Icons/technology.svg';
const craftsmanship = '/Assets/Icons/craftsmanship.png';
const global_supply_chain = '/Assets/Icons/global-supply-chain.svg';
const experience = '/Assets/Icons/experience.svg';

// The slider's markup without the slider code (same classes, so the same size).
function CounterSlidesStatic({ slides }) {
  return (
    <div className="swiper">
      <div className="swiper-wrapper">
        {slides.map((slide, index) => (
          <div className="swiper-slide" key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}

const loadCounterSlider = () => import("./CounterSlider");

// Phone-only slider: static slides first, the real slider (and its code) once it comes near
// the screen. On desktop .counters-swiper is display:none, so it never loads.
function LazyCounterSlider({ slides, delay, spaceBetween }) {
  const ref = useRef(null);
  const CounterSlider = useLazyComponent(useNearScreen(ref), loadCounterSlider);
  return (
    <div className="counters-swiper" ref={ref}>
      {CounterSlider ? (
        <CounterSlider slides={slides} delay={delay} spaceBetween={spaceBetween} />
      ) : (
        <CounterSlidesStatic slides={slides} />
      )}
    </div>
  );
}

export default function CounterSection() {
  const { t } = useTranslation();
  return (
    <section className="about-counters-section">
      <h2>{t('about.counters.sectionTitle')}</h2>
      
      {/* Experience Counter */}
      <div id="experience-card" className="counter-card">
        <img loading="lazy" src={experience} alt={t('about.counters.experienceIconAlt')} />
        <h3>{t('about.counters.experienceTitle')}</h3>
        <StatCounter end={46} />
      </div>

      {/* Counters Section (First 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <LazyCounterSlider
          delay={2000}
          spaceBetween={0}
          slides={[
            { img: manpower, title: t('about.counters.manpowerTitle'), count: 500 },
            { img: tiles, title: t('about.counters.productionTitle'), count: 3000 },
            { img: projects, title: t('about.counters.projectsTitle'), count: 300 },
          ].map((item, index) => (
            <div className="counter-card" key={index}>
              <img loading="lazy" src={item.img} alt={`${item.title.toLowerCase()}-icon`} />
              <h3>{item.title}</h3>
              {/* Static number on the mobile slider: the looping slider re-creates its
                  slides, which restarted (or never started) the CountUp animation, so
                  the live site showed "0 +". Same format as CountUp ("3,000 +"). */}
              <span className="counter-text">{item.count.toLocaleString('en-US')} +</span>
            </div>
          ))}
        />

        {/* Grid Layout for Large Screens */}
        <div className="counters-grid">
          <div className="counter-card">
            <img loading="lazy" src={manpower} alt={t('about.counters.manpowerIconAlt')} />
            <h3>{t('about.counters.manpowerTitle')}</h3>
            <StatCounter end={500} />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={tiles} alt={t('about.counters.productionIconAlt')} />
            <h3>{t('about.counters.productionTitle')}</h3>
            <StatCounter end={3000} />
          </div>
          <div className="counter-card">
            <img loading="lazy" src={projects} alt={t('about.counters.projectsIconAlt')} />
            <h3>{t('about.counters.projectsTitle')}</h3>
            <StatCounter end={300} />
          </div>
        </div>
      </div>

      <h2>{t('about.counters.sectionTitle2')}</h2>

      {/* Counters Section (Second 3) */}
      <div className="about-counters-section-inner">
        {/* Swiper for Small Screens */}
        <LazyCounterSlider
          delay={3000}
          spaceBetween={10}
          slides={[
            { img: technology, title: t('about.counters.technologyTitle'), text: t('about.counters.technologyText') },
            { img: craftsmanship, title: t('about.counters.craftsmanshipTitle'), text: t('about.counters.craftsmanshipText') },
            { img: global_supply_chain, title: t('about.counters.supplyChainTitle'), text: t('about.counters.supplyChainText') },
          ].map((item, index) => (
            <div className="counter-card" key={index}>
              <img loading="lazy" src={item.img} alt={`${item.title}-icon`} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        />

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
