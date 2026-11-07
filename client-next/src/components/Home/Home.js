"use client";
import React from "react";
import { useLazyBackgrounds } from "../../util/lazy-bg";
import "./Home.css";
import "react-multi-carousel/lib/styles.css";
import { useTranslation } from "react-i18next";
import MissionVisionSection from "../About/MissionVisionSection.js";
import QuarriesHome from "./QuarriesHome.js";
import FeaturedProducts from "./FeaturedProducts.js";
import PartnersHome from "./PartnersHome.js";
import CounterSection from "../About/CounterSection.js";
import VisualizerHome from "./VisualizerHome.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ProjectsHome from "./ProjectsHome.js";
import ContactBubble from "../Contact/ContactBubble.js";
import CertificatesHome from "./CertificatesHome.js";
import InspirationHome from "./InspirationHome.js";
import FaqHome from "./FaqHome.js";
// import { useGlobalState } from '../GlobalStateContext.js';
import LangLink from "../LangLink";

export default function Home() {
  useLazyBackgrounds();
  const { t } = useTranslation();

  //   const globalState = useGlobalState(); // Access global state for user data

  //   console.log("HOME/////GlobalState.fullname: " + globalState.fullName +
  //     " GlobalState.companyName: "+ globalState.companyName + " GlobalState.address: "
  //      + globalState.address + " GlobalState.whatsapp: " + globalState.whatsapp +
  //     "GlobalState.port: "+ globalState.port + " GlobalState.isLoggedIn: " + globalState.isLoggedIn +
  //     " GlobalState.token: "+globalState.token + " GlobalState.rnc: "+globalState.rnc +
  //     " GlobalState.country: "+globalState.country + " GlobalState.countryCode: "+globalState.countryCode
  //   +" GlobalState.email: "+globalState.email+" GlobalState.phone: "+globalState.phone);

  return (
    <>
      <div className="homepage">
        <div className="hero">
          <h1 className="hero-heading">{t("home.companyName")}</h1>
          <p>{t("home.heroWelcome")}</p>
          <div className="place4btns">
            <LangLink
              href="/history"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <button className="btn2">{t("home.ourHistory")}</button>
            </LangLink>

            <LangLink
              href="/products"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <button className="btn1">{t("home.ourProducts")}</button>
            </LangLink>
          </div>
        </div>
        <section className="intro-home-section">
          <h2>{t("home.legacy45Years")}</h2>
          <p>{t("home.legacyDescription")}</p>
        </section>
        <MissionVisionSection />
        <div id="home-about-button" className="home-button-section">
          <LangLink href="/about" className="btn-link">
            <button type="button" className="btn2" style={{ marginTop: "2rem" }}>
              {t("home.aboutWadiDegla")}
            </button>
          </LangLink>
        </div>

        <QuarriesHome />
        <FeaturedProducts />
        <PartnersHome />
        <CertificatesHome />
        <InspirationHome />

        <CounterSection />
        <VisualizerHome />
        <OurMarkets />
        <div className="home-button-section">
          <LangLink href="/exports" className="btn-link">
            <button type="button" className="btn2" style={{ marginTop: "5rem" }}>
              {t("home.learnMore")}
            </button>
          </LangLink>
        </div>
        <ProjectsHome />
        <FaqHome />

        <ContactBubble />
      </div>
    </>
  );
}
