import React from "react";
import './Home.css';
import { Link } from "react-router-dom";
import 'react-multi-carousel/lib/styles.css';
import MissionVisionSection from "../About/MissionVisionSection.js";
import CounterSection from "../About/CounterSection.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ContactBubble from "../Contact/ContactBubble.js";
import { useGlobalState } from '../GlobalStateContext.js';




export default function Home(){
  const globalState = useGlobalState(); // Access global state for user data
    
      
      // console.log("GlobalState.loggedIn: " + globalState.isLoggedIn + " GlobalState.token: "+ globalState.token );
      console.log("HOME/////GlobalState.fullname: " + globalState.fullName + 
        " GlobalState.companyName: "+ globalState.companyName + " GlobalState.address: "
         + globalState.address + " GlobalState.whatsapp: " + globalState.whatsapp + 
        "GlobalState.port: "+ globalState.port + " GlobalState.isLoggedIn: " + globalState.isLoggedIn + 
        " GlobalState.token: "+globalState.token + " GlobalState.rnc: "+globalState.rnc + 
        " GlobalState.country: "+globalState.country + " GlobalState.countryCode: "+globalState.countryCode
      +" GlobalState.email: "+globalState.email+" GlobalState.phone: "+globalState.phone);
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


            <MissionVisionSection />
            <CounterSection />
            <OurMarkets />

                      <ContactBubble />
        </div>
    )
}
           
