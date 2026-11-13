'use client';
import React, { useState } from "react";
import './Exports.css';
import { useTranslation } from 'react-i18next';

import GlobeChart from "./LazyGlobeChart"; // amCharts globe, loaded when scrolled into view




export default function OurMarkets(){
        const { t } = useTranslation();
        const [selectedContinent, setSelectedContinent] = useState("Africa");
        const [selectedCountry, setSelectedCountry] = useState(null);
      
    
    
      // 🌍 Data: Continents, Countries & Flags
      const continentData = {
        "North & South America": [
          { name: "USA", code: "US", flag: "/Assets/Icons/flags/us.svg", translationKey: "countries.usa" },
          { name: "Brazil", code: "BR", flag: "/Assets/Icons/flags/br.svg", translationKey: "countries.brazil" },
          { name: "Panama", code: "PA", flag: "/Assets/Icons/flags/pa.svg", translationKey: "countries.panama" },
          { name: "Venezuela", code: "VE", flag: "/Assets/Icons/flags/ve.svg", translationKey: "countries.venezuela" },
          { name: "Mexico", code: "MX", flag: "/Assets/Icons/flags/mx.svg", translationKey: "countries.mexico" },
          { name: "Dominican Republic", code: "DO", flag: "/Assets/Icons/flags/do.svg", translationKey: "countries.dominicanRepublic" },
          { name: "Bahamas", code: "BS", flag: "/Assets/Icons/flags/bs.svg", translationKey: "countries.bahamas" }
        ],
        Europe: [
          { name: "Romania", code: "RO", flag: "/Assets/Icons/flags/ro.svg", translationKey: "countries.romania" },
          { name: "Albania", code: "AL", flag: "/Assets/Icons/flags/al.svg", translationKey: "countries.albania" },
          { name: "Bulgaria", code: "BG", flag: "/Assets/Icons/flags/bg.svg", translationKey: "countries.bulgaria" },
          { name: "Kosovo", code: "XK", flag: "/Assets/Icons/flags/xk.svg", translationKey: "countries.kosovo" },
          { name: "Slovakia", code: "SK", flag: "/Assets/Icons/flags/sk.svg", translationKey: "countries.slovakia" },
          { name: "Slovenia", code: "SI", flag: "/Assets/Icons/flags/si.svg", translationKey: "countries.slovenia" },
          { name: "Germany", code: "DE", flag: "/Assets/Icons/flags/de.svg", translationKey: "countries.germany" },
          { name: "Malta", code: "MT", flag: "/Assets/Icons/flags/mt.svg", translationKey: "countries.malta" },
          { name: "Greece", code: "GR", flag: "/Assets/Icons/flags/gr.svg", translationKey: "countries.greece" },
          { name: "United Kingdom", code: "GB", flag: "/Assets/Icons/flags/gb.svg", translationKey: "countries.unitedKingdom" }
        ],
        Asia: [
          { name: "China", code: "CN", flag: "/Assets/Icons/flags/cn.svg", translationKey: "countries.china" },
          { name: "South Korea", code: "KR", flag: "/Assets/Icons/flags/kr.svg", translationKey: "countries.southKorea" },
          { name: "Russia", code: "RU", flag: "/Assets/Icons/flags/ru.svg", translationKey: "countries.russia" },
          { name: "Lebanon", code: "LB", flag: "/Assets/Icons/flags/lb.svg", translationKey: "countries.lebanon" },
          { name: "Kuwait", code: "KW", flag: "/Assets/Icons/flags/kw.svg", translationKey: "countries.kuwait" },
          { name: "Jordan", code: "JO", flag: "/Assets/Icons/flags/jo.svg", translationKey: "countries.jordan" },
          { name: "Iraq", code: "IQ", flag: "/Assets/Icons/flags/iq.svg", translationKey: "countries.iraq" },
          { name: "Saudi Arabia", code: "SA", flag: "/Assets/Icons/flags/sa.svg", translationKey: "countries.saudiArabia" },
          { name: "UAE", code: "AE", flag: "/Assets/Icons/flags/ae.svg", translationKey: "countries.uae" }
        ],
        Africa: [
          { name: "Senegal", code: "SN", flag: "/Assets/Icons/flags/sn.svg", translationKey: "countries.senegal" },
          { name: "Kenya", code: "KE", flag: "/Assets/Icons/flags/ke.svg", translationKey: "countries.kenya" },
          { name: "Gambia", code: "GM", flag: "/Assets/Icons/flags/gm.svg", translationKey: "countries.gambia" },
          { name: "Libya", code: "LY", flag: "/Assets/Icons/flags/ly.svg", translationKey: "countries.libya" }
        ],
        Australia: [
          { name: "Australia", code: "AU", flag: "/Assets/Icons/flags/au.svg", translationKey: "countries.australia" }
        ]
      };
    
      // Handle continent click
      const handleContinentClick = (continent) => {
        setSelectedContinent(continent === selectedContinent ? null : continent);
      };
    
      // Handle country click
      const handleCountryClick = (countryCode) => {
        setSelectedCountry(countryCode);
      };
    
    return(
                        <section className="our-markets" aria-label={t('exports.marketsAlt')}>
                            <h2>{t('exports.marketsTitle')}</h2>
                            <p className="our-markets-sub-1">{t('exports.marketsDescription1')}</p>
                            {/* 🌍 Continent Buttons */}
                            <div className="continent-buttons">
                                {Object.keys(continentData).map((continent, index) => (
                                <button
                                    key={index}
                                    className={selectedContinent === continent ? "active" : ""}
                                    onClick={() => handleContinentClick(continent)}
                                >
                                    {t(`exports.continents.${continent}`)}
                                </button>
                                ))}
                            </div>
        
                        {/* 🏳️ Country List (Shows when a continent is clicked) */}
                        {selectedContinent && (
                            <div className="country-list">
                                {continentData[selectedContinent].map((country, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => handleCountryClick(country.code)}
                                        className={selectedCountry === country.code ? "active" : ""} // ✅ Add active class
                                    >
                                        <img loading="lazy" src={country.flag} alt={t(`exports.${country.translationKey}Flag`)} className="country-flag" />
                                        {t(`exports.${country.translationKey}`)}
                                    </button>
                                ))}
                            </div>
                        )}
                                    <p className="our-markets-sub-2">{t('exports.marketsDescription2')}</p>

                        {/* 🌐 Interactive Globe */}
                        <GlobeChart selectedCountry={selectedCountry} />
                        </section>
        
    );
}