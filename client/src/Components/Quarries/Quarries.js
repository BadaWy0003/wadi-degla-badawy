import React from "react";
import "./Quarries.css";
import "../Fairs/Fairs.css";
import QuarriesSwiper from "./QuarriesSwiper";
import {
  galalaQuarryImages,
  creamyQuarryImages,
  beigeSinaiPearlQuarryImages,
  firstFactoryImages,
  secondFactoryImages,
  thirdFactoryImages,
} from "./QuarriesImageData";
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function Quarries() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("quarries.pageTitle")}</title>
        <meta name="description" content={t("quarries.metaDescription")} />
        <link rel="canonical" href="https://www.wadidegla-eg.com/quarries" />
      </Helmet>

      <div className="quarries-container">
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
          <h1>{t("quarries.heroTitle")}</h1>
          <div className="breadcrumb">
            <a href="/">{t("quarries.breadcrumbHome")}</a>
            <p>
              {">"} {t("quarries.breadcrumbCurrent")}
            </p>
          </div>
        </div>

        {/* 🏔️ Quarries Section */}
        <section className="quarries">
          <div className="quarries-title">
            <h2>{t("quarries.ourQuarries")}</h2>
            <hr />
          </div>

          {/* Galala Quarry */}
          <div className="quarry-card left">
            <QuarriesSwiper images={galalaQuarryImages} />
            <div className="text">
              <h3>{t("quarries.galalaTitle")}</h3>
              <p>
                {t("quarries.galalaText")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.galalaText").split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>

          {/* Creamy Quarry */}
          <div className="quarry-card right">
            <div className="text">
              <h3>{t("quarries.creamyTitle")}</h3>
              <p>
                {t("quarries.creamyText")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.creamyText").split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
              </p>
            </div>
            <QuarriesSwiper images={creamyQuarryImages} />
          </div>

          {/* Beige Sinai Pearl Quarry */}
          <div className="quarry-card left">
            <QuarriesSwiper images={beigeSinaiPearlQuarryImages} />
            <div className="text">
              <h3>{t("quarries.beigeSinaiPearlTitle")}</h3>
              <p>
                {t("quarries.beigeSinaiPearlText")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.beigeSinaiPearlText").split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>
        </section>

        {/* 🏭 Factories Section */}
        <section className="factories">
          <div className="quarries-title">
            <h2>{t("quarries.ourFactories")}</h2>
            <hr />
          </div>
          <p className="machinery-captions">
            {t("quarries.factoriesDescription")}
          </p>

          {/* Factory 2000 */}
          <div className="factory-card left">
            <QuarriesSwiper images={firstFactoryImages} />
            <div className="text">
              <h3>{t("quarries.factory2000Title")}</h3>
              <p>
                {t("quarries.factory2000Text")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.factory2000Text").split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>

          {/* Factory 2011 */}
          <div className="factory-card right">
            <div className="text">
              <h3>{t("quarries.factory2011Title")}</h3>
              <p>
                {t("quarries.factory2011Text")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.factory2011Text").split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </p>
            </div>
            <QuarriesSwiper images={secondFactoryImages} />
          </div>

          {/* Factory 2015 */}
          <div className="factory-card left">
            <QuarriesSwiper images={thirdFactoryImages} />
            <div className="text">
              <h3>{t("quarries.factory2015Title")}</h3>
              <p>
                {t("quarries.factory2015Text")
                  .split("\n")
                  .map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index <
                        t("quarries.factory2015Text").split("\n").length -
                          1 && <br />}
                    </React.Fragment>
                  ))}
              </p>
            </div>
          </div>
        </section>

        {/* 🌍 Global Facilities Section */}
        <section className="global">
          <div className="global-text">
            <div className="quarries-title">
              <h2>{t("quarries.globalFacilities")}</h2>
              <hr />
            </div>
            <p>{t("quarries.globalDescription")}</p>
            <div className="coming-soon">
              <h1>{t("quarries.comingSoon")}</h1>
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
    </>
  );
}
