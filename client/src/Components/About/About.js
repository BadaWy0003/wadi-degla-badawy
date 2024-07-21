import React from "react";
import './About.css';
import bullseye_gold from '../Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../Assets/Icons/paper-plane-gold.svg'
import company_logo from '../Assets/Icons/partners/company-logo.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



export default function About(){

    const responsive2 = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 6
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 6
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1.4
        }
      };

    return(
        <div className='about-container'>
                <div className="gallery-hero">
                        <div className="gallery-hero-bg"></div>
                            <h1>ABOUT</h1>
                    </div>
                    <div className="about-home">
                    <h1>Welcome to Wadi Degla for Marble & Granite</h1>

                <div className="mission-vision">
                        <div>
                            <p>your trusted partner in the marble business since 1980. 
                                With our extensive experience and expertise, we have become a leading supplier of Egyptian marble worldwide. 
                                At Wadi Degla, we own and operate our own valuable quarries, ensuring a consistent supply of premium-quality marble. 
                                Our commitment to excellence is evident in every step of our process, from meticulous selection to timely delivery.</p>
                            </div>
                        <div>
                            <p>We offer a comprehensive range of products, including blocks, slabs, tiles, and cut-to-size materials, 
                                all available in various finishes. Our marble has graced projects across the globe, leaving a lasting impression of elegance. 
                                Choose Wadi Degla as your trusted partner in the world of fine marble.</p>
                            </div>
                </div>
            </div>                
            <div className="about-home">
                <div className="mission-vision">
                    <div className="mission">
                        <img src={bullseye_gold} alt=""/>
                        <div>
                            <h1>Mission</h1>
                            <p>To best serve the construction industry by supplying the highest quality of natural 
                                marbles and stones, and to grow unlimitedly as one of the best manufacturers of marbles
                                 in the Middle-East and the world.</p>
                            </div>
                        </div>
                    <div className="vision">
                    <img src={paper_plane_gold} alt=""/>
                        <div>
                            <h1>Vision</h1>
                            <p>To be recognized worldwide as one of the most reliable suppliers of best quality marbles, 
                                granite, and decorative stones.</p>
                            </div>
                    </div>
                </div>
            </div>   
            <div className="counter-about">
                    <div className="counter">
                        <img src={bullseye_gold} alt=""/>
                            <h1>44+</h1>
                            <h2>YEARS OF EXPERIENCE</h2>
                        </div>
                    <div className="counter">
                    <img src={paper_plane_gold} alt=""/>
                            <h1>1000+</h1>
                            <h2>PRODUCT VARIABLES</h2>
                    </div>
                    <div className="counter">
                        <img src={bullseye_gold} alt=""/>
                            <h1>10+</h1>
                            <h2>PARTNERS</h2>
                        </div>
                </div>
            <div className="our-partners">
                <h1>Our Partners</h1>
                <div className="partners-about">
                    <img src={company_logo} />
                    <img src={company_logo} />
                    <img src={company_logo} />
                    <img src={company_logo} />
                    <img src={company_logo} />
                    <img src={company_logo} />
                    <img src={company_logo} />

                    </div>
            </div>  
                
            </div>    
            )
}