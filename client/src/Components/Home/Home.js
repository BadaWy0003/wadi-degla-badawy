import React from "react";
import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import 'react-multi-carousel/lib/styles.css';
import MissionVisionSection from "../About/MissionVisionSection.js";
import FeaturedProducts from "./FeaturedProducts.js";
import PartnersHome from "./PartnersHome.js";
import CounterSection from "../About/CounterSection.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ContactBubble from "../Contact/ContactBubble.js";
// import { useGlobalState } from '../GlobalStateContext.js';




export default function Home(){
      const navigate = useNavigate();
    
//   const globalState = useGlobalState(); // Access global state for user data

      
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
                            <Link to='/history' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">OUR HISTORY</button></Link>

                            <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">OUR PRODUCTS</button></Link>

                        </div>
                </div>
            </div>
            <section className="intro-home-section">
                <h4>At <strong>Wadi Degla</strong> Marble & Granite, three
                        generations of <strong>passion</strong> and <strong>expertise</strong> converge to bring
                        you the <strong>finest</strong> natural stone products. We are delighted
                        to introduce you to our legacy, our values, and our
                        commitment to <strong>excellence</strong> in every project we
                        undertake.
                </h4>
            </section>
            <MissionVisionSection />
            <div id="home-about-button" className="home-button-section">
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/exports');
                    window.scrollTo({top: 0});
                }}>ABOUT WADI DEGLA</button>                     
            </div>


            <FeaturedProducts />
            <PartnersHome />
            <CounterSection />
            <OurMarkets />
            <div className="home-button-section">
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/exports');
                    window.scrollTo({top: 0});
                }}>LEARN MORE</button>                     
            </div>
                      <ContactBubble />
        </div>
    )
}
           
