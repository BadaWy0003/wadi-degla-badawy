import React from "react";
import './Exports.css';
import 'react-multi-carousel/lib/styles.css';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import exports from '../../Public/Assets/Media/Exports/exports2.webp';
import OurMarkets from "./OurMarkets";
import ContactBubble from "../Contact/ContactBubble";

import exports1 from '../../Public/Assets/Media/Packing/packing3.webp';
import exports2 from '../../Public/Assets/Media/Packing/packing7.webp';
import exports3 from '../../Public/Assets/Media/Exports/exports3.webp';
import exports4 from '../../Public/Assets/Media/Exports/exports4.webp';
import exports5 from '../../Public/Assets/Media/Exports/exports5.webp';
import exports6 from '../../Public/Assets/Media/Exports/exports6.webp';


export default function Exports(){
        const images = [
            exports1,
            exports2,
            exports3,
            exports4,
            exports5,
            exports6
                    ];
    
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
                        <h2>OUR EXPORT DEPARTMENT</h2>
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
                    <img loading="lazy" src={exports} alt=""/>
                </div>   
                <OurMarkets />
                <div className="image-grid">
            <MasonryGrid props={images}/>

            </div>

                <ContactBubble />

            </div>    
            )
}