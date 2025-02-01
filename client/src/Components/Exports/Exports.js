import React from "react";
import './Exports.css';
// import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Africa from '../../Public/Assets/Media/Africa.svg';
import Americas from '../../Public/Assets/Media/Americas.svg';
import Asia from '../../Public/Assets/Media/Asia.svg';
import Australia from '../../Public/Assets/Media/Australia.svg';
import Europe from '../../Public/Assets/Media/Europe.svg';
import home_bg from '../../Public/Assets/Media/home-bg.jpg';



export default function Exports(){
    const [currentImage, setCurrentImage] = React.useState(Africa);
    const [activeButton, setActiveButton] = React.useState('Africa'); // Track active button


    const handleButtonClick = (region, image) => {
        setCurrentImage(image); // Update the image
        setActiveButton(region); // Update the active button
    };

    return(
        <div className='exports-container'>
            <div className="gallery-hero">
                    <div className="gallery-hero-bg"></div>
                        <h1>EXPORTS</h1>
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
                    <img src={home_bg} alt=""/>
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
                    <img src={currentImage} alt="Current Market" />
                </div>
            </div>    
            )
}