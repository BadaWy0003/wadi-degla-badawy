import React, { useState } from "react";
import './Exports.css';
import { useTranslation } from 'react-i18next';
import '../../i18n';

import GlobeChart from "./GlobeChart"; // Import the GlobeChart component




export default function OurMarkets(){
        const { t } = useTranslation();
        const [selectedContinent, setSelectedContinent] = useState("Africa");
        const [selectedCountry, setSelectedCountry] = useState(null);
      
    
    
      // 🌍 Data: Continents, Countries & Flags
      const continentData = {
        "North & South America": [
          { name: "USA", code: "US", flag: "https://flagcdn.com/us.svg", translationKey: "countries.usa" },
          { name: "Brazil", code: "BR", flag: "https://flagcdn.com/br.svg", translationKey: "countries.brazil" },
          { name: "Panama", code: "PA", flag: "https://flagcdn.com/pa.svg", translationKey: "countries.panama" }
        ],
        Europe: [
          { name: "Romania", code: "RO", flag: "https://flagcdn.com/ro.svg", translationKey: "countries.romania" },
          { name: "Albania", code: "AL", flag: "https://flagcdn.com/al.svg", translationKey: "countries.albania" },
          { name: "Bulgaria", code: "BG", flag: "https://flagcdn.com/bg.svg", translationKey: "countries.bulgaria" },
          { name: "Kosovo", code: "XK", flag: "https://flagcdn.com/xk.svg", translationKey: "countries.kosovo" },
          { name: "Slovakia", code: "SK", flag: "https://flagcdn.com/sk.svg", translationKey: "countries.slovakia" },
          { name: "Slovenia", code: "SI", flag: "https://flagcdn.com/si.svg", translationKey: "countries.slovenia" },
          { name: "Germany", code: "DE", flag: "https://flagcdn.com/de.svg", translationKey: "countries.germany" },
          { name: "Malta", code: "MT", flag: "https://flagcdn.com/mt.svg", translationKey: "countries.malta" }
        ],
        Asia: [
          { name: "China", code: "CN", flag: "https://flagcdn.com/cn.svg", translationKey: "countries.china" },
          { name: "South Korea", code: "KR", flag: "https://flagcdn.com/kr.svg", translationKey: "countries.southKorea" },
          { name: "Russia", code: "RU", flag: "https://flagcdn.com/ru.svg", translationKey: "countries.russia" },
          { name: "Lebanon", code: "LB", flag: "https://flagcdn.com/lb.svg", translationKey: "countries.lebanon" },
          { name: "Kuwait", code: "KW", flag: "https://flagcdn.com/kw.svg", translationKey: "countries.kuwait" },
          { name: "Jordan", code: "JO", flag: "https://flagcdn.com/jo.svg", translationKey: "countries.jordan" },
          { name: "Iraq", code: "IQ", flag: "https://flagcdn.com/iq.svg", translationKey: "countries.iraq" },
          { name: "Saudi Arabia", code: "SA", flag: "https://flagcdn.com/sa.svg", translationKey: "countries.saudiArabia" },
          { name: "UAE", code: "AE", flag: "https://flagcdn.com/ae.svg", translationKey: "countries.uae" }
        ],
        Africa: [
          { name: "Senegal", code: "SN", flag: "https://flagcdn.com/sn.svg", translationKey: "countries.senegal" },
          { name: "Kenya", code: "KE", flag: "https://flagcdn.com/ke.svg", translationKey: "countries.kenya" },
          { name: "Gambia", code: "GM", flag: "https://flagcdn.com/gm.svg", translationKey: "countries.gambia" },
          { name: "Libya", code: "LY", flag: "https://flagcdn.com/ly.svg", translationKey: "countries.libya" }
        ],
        Australia: [
          { name: "Australia", code: "AU", flag: "https://flagcdn.com/au.svg", translationKey: "countries.australia" }
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