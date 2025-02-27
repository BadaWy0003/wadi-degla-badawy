import React from "react";
import './Exports.css';
// import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Africa from '../../Public/Assets/Media/Africa.svg';
import Americas from '../../Public/Assets/Media/Americas.svg';
import Asia from '../../Public/Assets/Media/Asia.svg';
import Australia from '../../Public/Assets/Media/Australia.svg';
import Europe from '../../Public/Assets/Media/Europe.svg';
import exports from '../../Public/Assets/Media/24.jpg';
import ContactBubble from "../Contact/ContactBubble";



export default function Exports(){
    const [currentImage, setCurrentImage] = React.useState(Africa);
    const [activeButton, setActiveButton] = React.useState('Africa'); // Track active button


    const handleButtonClick = (region, image) => {
        setCurrentImage(image); // Update the image
        setActiveButton(region); // Update the active button
    };

        // Data for countries in each continent
        const continentData = {
            'North & South America': ['USA', 'Brazil', 'Panama'],
            'Europe': ['Romania', 'Albania', 'Bulgaria', 'Kosovo', 'Slovakia', 'Slovenia', 'Germany', 'Malta'],
            'Asia': ['China', 'South Korea', 'Russia', 'Lebanon', 'Kuwait', 'Jordan', 'Iraq', 'Saudi Arabia', 'UAE'],
            'Africa': ['Senegal', 'Kenya', 'Gambia', 'Libya'],
            'Australia': ['Australia'],
        };
        // Add this object to your component
const countryFlags = {
    // North & South America
    'USA': 'https://flagcdn.com/us.svg',
    'Brazil': 'https://flagcdn.com/br.svg',
    'Panama': 'https://flagcdn.com/pa.svg',

    // Europe
    'Romania': 'https://flagcdn.com/ro.svg',
    'Albania': 'https://flagcdn.com/al.svg',
    'Bulgaria': 'https://flagcdn.com/bg.svg',
    'Kosovo': 'https://flagcdn.com/xk.svg',
    'Slovakia': 'https://flagcdn.com/sk.svg',
    'Slovenia': 'https://flagcdn.com/si.svg',
    'Germany': 'https://flagcdn.com/de.svg',
    'Malta': 'https://flagcdn.com/mt.svg',

    // Asia
    'China': 'https://flagcdn.com/cn.svg',
    'South Korea': 'https://flagcdn.com/kr.svg',
    'Russia': 'https://flagcdn.com/ru.svg',
    'Lebanon': 'https://flagcdn.com/lb.svg',
    'Kuwait': 'https://flagcdn.com/kw.svg',
    'Jordan': 'https://flagcdn.com/jo.svg',
    'Iraq': 'https://flagcdn.com/iq.svg',
    'Saudi Arabia': 'https://flagcdn.com/sa.svg',
    'UAE': 'https://flagcdn.com/ae.svg',

    // Africa
    'Senegal': 'https://flagcdn.com/sn.svg',
    'Kenya': 'https://flagcdn.com/ke.svg',
    'Gambia': 'https://flagcdn.com/gm.svg',
    'Libya': 'https://flagcdn.com/ly.svg',

    // Australia
    'Australia': 'https://flagcdn.com/au.svg',
};
    
    
    return(
        <div className='exports-container'>
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>EXPORTS</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Exports</p>
                        </div>
                </div>  
                <div className="export-department">
                    <div className="export-department-content">
                        <h1>OUR EXPORT DEPARTMENT</h1>
                        <p>Our export department serves as the vital gateway to global markets, 
                            facilitating the distribution of exquisite natural stone products to discerning clientele around the world. 
                            Our department is responsible for orchestrating a seamless flow of operations, from negotiating international 
                            contracts and coordinating logistics to ensuring compliance with customs regulations and quality standards. 
                            With a keen eye for market trends and a deep understanding of diverse customer preferences, 
                            our export team identifies strategic opportunities for expanding the factory's reach. Moreover, 
                            we forge valuable relationships with international partners, architects, and designers, creating a 
                            network that not only promotes the brand but also fosters innovation and collaboration. 
                            Through our expertise and tireless dedication, the export department plays a pivotal role in showcasing the 
                            factory's craftsmanship and enhancing its global reputation as a
                        premier supplier of premium natural stone products.</p>    

                    </div>
                    <img src={exports} alt=""/>
                </div>   

                <div className="our-markets">
                    <h1>OUR MARKETS</h1>
                    <div className="markets">
                    <button
                        className={activeButton === 'North & South America' ? 'active' : ''}
                        onClick={() => handleButtonClick('North & South America', Americas)}
                    >
                        North & South America
                    </button>
                    <button
                        className={activeButton === 'Europe' ? 'active' : ''}
                        onClick={() => handleButtonClick('Europe', Europe)}
                    >
                        Europe
                    </button>
                    <button
                        className={activeButton === 'Asia' ? 'active' : ''}
                        onClick={() => handleButtonClick('Asia', Asia)}
                    >
                        Asia
                    </button>
                    <button
                        className={activeButton === 'Africa' ? 'active' : ''}
                        onClick={() => handleButtonClick('Africa', Africa)}
                    >
                        Africa
                    </button>
                    <button
                        className={activeButton === 'Australia' ? 'active' : ''}
                        onClick={() => handleButtonClick('Australia', Australia)}
                    >
                        Australia
                    </button>
                    </div>
                                    {/* Display countries for the active continent */}
                <div className="continent-countries-and-map">
                    <div className="continent-countries">
                        {continentData[activeButton].map((country, index) => (
                        <div>
                            <img
                            src={countryFlags[country]} // Flag image URL
                            alt={`${country} Flag`} // Alt text for accessibility
                            className="country-flag"
                            />
                            <p key={index}>{country}</p>
                        </div>
                        ))}
                        </div>
                        <img src={currentImage} alt="Current Market" />
                </div>

                    
                </div>
                <ContactBubble />

            </div>    
            )
}