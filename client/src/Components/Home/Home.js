import React, { useState, useEffect } from "react";
import './Home.css';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Autoplay, Pagination, Navigation } from 'swiper/modules';
import apiClient from "../../util/client.js";
import 'react-multi-carousel/lib/styles.css';
import MissionVisionSection from "../About/MissionVisionSection.js";
import CounterSection from "../About/CounterSection.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ContactBubble from "../Contact/ContactBubble.js";
// import { useGlobalState } from '../GlobalStateContext.js';




export default function Home(){
//   const globalState = useGlobalState(); // Access global state for user data
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  const featuredNames = [
    "Creamy White Pearl",
    "Pietra Grey",
    "Sunny Light",
    "Calacatta Italy",
    "Arabescato",
    "Triesta Beige",
    "New Halayeb",
    "Red Aswan"
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await apiClient.get('/api/storage/all');
      if (data.data) {
        const featured = data.data.filter(product => 
          featuredNames.includes(product.name)
        );
        setFeaturedProducts(featured);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

      
    //   console.log("HOME/////GlobalState.fullname: " + globalState.fullName + 
    //     " GlobalState.companyName: "+ globalState.companyName + " GlobalState.address: "
    //      + globalState.address + " GlobalState.whatsapp: " + globalState.whatsapp + 
    //     "GlobalState.port: "+ globalState.port + " GlobalState.isLoggedIn: " + globalState.isLoggedIn + 
    //     " GlobalState.token: "+globalState.token + " GlobalState.rnc: "+globalState.rnc + 
    //     " GlobalState.country: "+globalState.country + " GlobalState.countryCode: "+globalState.countryCode
    //   +" GlobalState.email: "+globalState.email+" GlobalState.phone: "+globalState.phone);

    return(
        <div className="homepage">
            <div className="hero">
                <div className="banner">
                    <h1>Wadi Degla for marble & Granite</h1>
                    <p>Welcome to Wadi Degla for Marble & Granite, your trusted partner in the marble business since 1980.</p>
                        <div className="place4btns">
                            <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">ABOUT US</button></Link>

                            <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">OUR PRODUCTS</button></Link>

                        </div>
                </div>
            </div>
            <MissionVisionSection />


            <div className="featured-products-section">
                <h2>Featured Products</h2>
                <p>Discover our most popular selections</p>
                <Swiper
                effect={'cube'}
                grabCursor={true}
                loop={true}
                cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-custom-pagination'
                }}
                navigation={{
                    nextEl: '.swiper-custom-button-next',
                    prevEl: '.swiper-custom-button-prev'
                }}
                modules={[EffectCube, Pagination, Navigation, Autoplay]}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: true,
                  }}
                className="featured-cube-swiper"
                >
                {featuredProducts.map((item) => (
                    <SwiperSlide key={item.id}>
                    <div className="featured-cube-slide">
                        {item.finishes.find(finish => finish.finish === 'Polished') && (
                        <img 
                            src={item.finishes.find(finish => finish.finish === 'Polished').link} 
                            alt={item.name} 
                        />
                        )}
                        <div className="slide-overlay">
                        <h3>{item.name}</h3>
                        <p>{item.type}</p>
                        <button 
                            className="btn2"
                            onClick={() => {
                            navigate(`/products/${item.id}`);
                            window.scrollTo({top: 0});
                            }}
                        >
                            More Details
                        </button>
                        </div>
                    </div>
                    </SwiperSlide>
                ))}
                </Swiper>
                <div className="swiper-custom-navigation">
                <div className="swiper-custom-button-prev">‹</div>
                <div className="swiper-custom-pagination"></div>
                <div className="swiper-custom-button-next">›</div>
                </div>
                </div>

            <CounterSection />
            <OurMarkets />

                      <ContactBubble />
        </div>
    )
}
           
