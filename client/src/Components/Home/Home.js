import React from "react";
import './Home.css';
import { Link } from "react-router-dom";
import hero_bg from '../Assets/Media/hero-bg.jpg';
import home_bg from '../Assets/Media/home-bg2.jpg'
import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Product from './Product'
import company_logo from '../Assets/Icons/partners/company-logo.png'
import company_logo_2 from '../Assets/Icons/partners/company-logo-2.svg'
import company_logo_3 from '../Assets/Icons/partners/company-logo-3.svg'
import company_logo_4 from '../Assets/Icons/partners/company-logo-4.svg'
import company_logo_5 from '../Assets/Icons/partners/company-logo-5.svg'
import company_logo_6 from '../Assets/Icons/partners/company-logo-6.svg'
import company_logo_7 from '../Assets/Icons/partners/company-logo-7.svg'
import company_logo_8 from '../Assets/Icons/partners/company-logo-8.svg'
import company_logo_9 from '../Assets/Icons/partners/company-logo-9.svg'
import company_logo_10 from '../Assets/Icons/partners/company-logo-10.svg'

import bullseye_gold from '../Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../Assets/Icons/paper-plane-gold.svg'
import Gallery from './Gallery-Home'
import image1 from '../Assets/Media/Gallery/1.jpg'
import image2 from '../Assets/Media/Gallery/2.jpg'
import image3 from '../Assets/Media/Gallery/3.jpg'
import image4 from '../Assets/Media/Gallery/4.jpg'
import image5 from '../Assets/Media/Gallery/5.jpg'
import image6 from '../Assets/Media/Gallery/6.jpg'
import image7 from '../Assets/Media/Gallery/7.jpg'
import image8 from '../Assets/Media/Gallery/8.jpg'
import image9 from '../Assets/Media/Gallery/9.jpg'
import image10 from '../Assets/Media/Gallery/10.jpg'
import image11 from '../Assets/Media/Gallery/11.jpg'
import image12 from '../Assets/Media/Gallery/12.jpg'
import image13 from '../Assets/Media/Gallery/13.jpg'
import image14 from '../Assets/Media/Gallery/14.jpg'
import image15 from '../Assets/Media/Gallery/15.jpg'
import image16 from '../Assets/Media/Gallery/16.jpg'
import image17 from '../Assets/Media/Gallery/17.jpg'
import image18 from '../Assets/Media/Gallery/18.jpg'
import image19 from '../Assets/Media/Gallery/19.jpg'
import image20 from '../Assets/Media/Gallery/20.jpg'
import image21 from '../Assets/Media/Gallery/21.jpg'
import image22 from '../Assets/Media/Gallery/22.jpg'
import image23 from '../Assets/Media/Gallery/23.jpg'
import image24 from '../Assets/Media/Gallery/24.jpg'
import image25 from '../Assets/Media/Gallery/25.jpg'
import image26 from '../Assets/Media/Gallery/26.jpg'
import image27 from '../Assets/Media/Gallery/27.jpg'
import image28 from '../Assets/Media/Gallery/28.jpg'
import image29 from '../Assets/Media/Gallery/29.jpg'
import image30 from '../Assets/Media/Gallery/30.jpg'
import image31 from '../Assets/Media/Gallery/31.jpg'
import image32 from '../Assets/Media/Gallery/32.jpg'
//slamo 3leko



export default function Home(){

    const galleryUrl = [
        image1, image2, image3, image4, image5, image6, image7, image8, image9
    ]


    const productData = [
        {
            id: 1,
            imageUrl: Galala,
            name: "Galala"
        },
        {
            id: 2,
            imageUrl: Sunny_Menia,
            name: "Sunny Menia"
        },
        {
            id: 3,
            imageUrl: Selvia_Menia,
            name: "Selvia Menia",
        },
        {
            id: 4,
            imageUrl: Felitto,
            name: "Felitto",
        },{
            id: 5,
            imageUrl: Galala,
            name: "Galala"
        },
        {
            id: 6,
            imageUrl: Sunny_Menia,
            name: "Sunny Menia"
        },
        {
            id: 7,
            imageUrl: Selvia_Menia,
            name: "Selvia Menia",
        },
        {
            id: 8,
            imageUrl: Felitto,
            name: "Felitto",
        }
        
    ]
    
    const product = productData.map(item => (
        <Product 
            id={item.id} 
            url={item.imageUrl} 
            name={item.name}
        />
    ))
    const responsive1 = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 4
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
        <div className="homepage">
            <div className="hero">
                <div className="hero-background"></div>
                <div className="banner">
                    <h1>Wadi Degla for marble & Granite</h1>
                    <p>Welcome to Wadi Degla for Marble & Granite, your trusted partner in the marble business since 1980.</p>
                        <div className="place4btns">
                            <button className="btn2">ABOUT US</button>
                            <button className="btn1">OUR PRODUCTS</button>
                        </div>
                </div>
            </div>
            <div className="about-home">
            <h1>About Wadi Degla</h1>
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
                <Link to='/about'><button className="btn2">LEARN MORE</button></Link>
            </div>
            <div className="products-home">
                <h1>Explore some of our products</h1>
                <Carousel responsive={responsive1} 
                            swipeable={true}
                            showDots={true}
                            ssr={true} 
                            infinite={true}
                            keyBoardControl={true}
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"        
                >  
                    {product}
                </Carousel>
                <div className="products-btn-plc">
                <button className="btn1">EXPLORE ALL</button>
                </div>
            </div>

            <div className="our-partners">
                <h1>Our Partners</h1>
                <Carousel responsive={responsive2}
                            swipeable={true}
                            showDots={false}
                            arrows={false}
                            ssr={true} 
                            infinite={true}
                            keyBoardControl={true}
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px" 
                >
                    <img src={company_logo} />
                    <img src={company_logo_2} />
                    <img src={company_logo_3} />
                    <img src={company_logo_4} />
                    <img src={company_logo_5} />
                    <img src={company_logo_6} />
                    <img src={company_logo_7} />
                    <img src={company_logo_8} />
                    <img src={company_logo_9} />
                    <img src={company_logo_10} />



                </Carousel>
            </div>

            <div className="gallery-home">
                <h1>Gallery</h1>
                <Gallery galleryUrl={galleryUrl} columnCount="3" gap="5"/>
                
                <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">VIEW ALL</button></Link>
            </div>
        </div>
    )
}
           
