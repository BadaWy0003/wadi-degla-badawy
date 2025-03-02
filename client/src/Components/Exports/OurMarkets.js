import React, { useState } from "react";
import './Exports.css';

import GlobeChart from "./GlobeChart"; // Import the GlobeChart component




export default function OurMarkets(){
        const [selectedContinent, setSelectedContinent] = useState("Africa");
        const [selectedCountry, setSelectedCountry] = useState(null);
      
    
    
      // 🌍 Data: Continents, Countries & Flags
      const continentData = {
        "North & South America": [
          { name: "USA", code: "US", flag: "https://flagcdn.com/us.svg" },
          { name: "Brazil", code: "BR", flag: "https://flagcdn.com/br.svg" },
          { name: "Panama", code: "PA", flag: "https://flagcdn.com/pa.svg" }
        ],
        Europe: [
          { name: "Romania", code: "RO", flag: "https://flagcdn.com/ro.svg" },
          { name: "Albania", code: "AL", flag: "https://flagcdn.com/al.svg" },
          { name: "Bulgaria", code: "BG", flag: "https://flagcdn.com/bg.svg" },
          { name: "Kosovo", code: "XK", flag: "https://flagcdn.com/xk.svg" },
          { name: "Slovakia", code: "SK", flag: "https://flagcdn.com/sk.svg" },
          { name: "Slovenia", code: "SI", flag: "https://flagcdn.com/si.svg" },
          { name: "Germany", code: "DE", flag: "https://flagcdn.com/de.svg" },
          { name: "Malta", code: "MT", flag: "https://flagcdn.com/mt.svg" }
        ],
        Asia: [
          { name: "China", code: "CN", flag: "https://flagcdn.com/cn.svg" },
          { name: "South Korea", code: "KR", flag: "https://flagcdn.com/kr.svg" },
          { name: "Russia", code: "RU", flag: "https://flagcdn.com/ru.svg" },
          { name: "Lebanon", code: "LB", flag: "https://flagcdn.com/lb.svg" },
          { name: "Kuwait", code: "KW", flag: "https://flagcdn.com/kw.svg" },
          { name: "Jordan", code: "JO", flag: "https://flagcdn.com/jo.svg" },
          { name: "Iraq", code: "IQ", flag: "https://flagcdn.com/iq.svg" },
          { name: "Saudi Arabia", code: "SA", flag: "https://flagcdn.com/sa.svg" },
          { name: "UAE", code: "AE", flag: "https://flagcdn.com/ae.svg" }
        ],
        Africa: [
          { name: "Senegal", code: "SN", flag: "https://flagcdn.com/sn.svg" },
          { name: "Kenya", code: "KE", flag: "https://flagcdn.com/ke.svg" },
          { name: "Gambia", code: "GM", flag: "https://flagcdn.com/gm.svg" },
          { name: "Libya", code: "LY", flag: "https://flagcdn.com/ly.svg" }
        ],
        Australia: [
          { name: "Australia", code: "AU", flag: "https://flagcdn.com/au.svg" }
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
                        <div className="our-markets">
                            <h2>OUR MARKETS</h2>
                            {/* 🌍 Continent Buttons */}
                            <div className="continent-buttons">
                                {Object.keys(continentData).map((continent, index) => (
                                <button
                                    key={index}
                                    className={selectedContinent === continent ? "active" : ""}
                                    onClick={() => handleContinentClick(continent)}
                                >
                                    {continent}
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
                                        <img src={country.flag} alt={`${country.name} Flag`} className="country-flag" />
                                        {country.name}
                                    </button>
                                ))}
                            </div>
                        )}
        
                        {/* 🌐 Interactive Globe */}
                        <GlobeChart selectedCountry={selectedCountry} />
                        </div>
        
    );
}