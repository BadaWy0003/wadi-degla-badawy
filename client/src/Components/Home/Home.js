import React, { useState, useEffect } from "react";
import './Home.css';
import { Link } from "react-router-dom";
import apiClient from "../../util/client.js";
import Product from "../Products/Product.js";
import 'react-multi-carousel/lib/styles.css';
import MissionVisionSection from "../About/MissionVisionSection.js";
import CounterSection from "../About/CounterSection.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ContactBubble from "../Contact/ContactBubble.js";
// import { useGlobalState } from '../GlobalStateContext.js';




export default function Home(){
//   const globalState = useGlobalState(); // Access global state for user data
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
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
                <div className="hero-background"></div>
                <div className="banner">
                    <h1>Wadi Degla for marble & Granite</h1>
                    <p>Welcome to Wadi Degla for Marble & Granite, your trusted partner in the marble business since 1980.</p>
                        <div className="place4btns">
                            <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">ABOUT US</button></Link>

                            <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">OUR PRODUCTS</button></Link>

                        </div>
                </div>
            </div>


            <div className="featured-products-section">
                <h2>Featured Products</h2>
                <p>Discover our most popular selections</p>
                <div className="product-cards-container-2">
                <div className="product-cards-2">
                    {featuredProducts.map((item) => (
                    <Product key={item.id} item={item} />
                    ))}
                </div>
                </div>
            </div>


            <MissionVisionSection />
            <CounterSection />
            <OurMarkets />

                      <ContactBubble />
        </div>
    )
}
           
