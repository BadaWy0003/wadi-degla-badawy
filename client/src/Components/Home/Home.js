import React from "react";
import './Home.css';
import { Link, useNavigate } from "react-router-dom";
import 'react-multi-carousel/lib/styles.css';
import MissionVisionSection from "../About/MissionVisionSection.js";
import QuarriesHome from "./QuarriesHome.js";
import FeaturedProducts from "./FeaturedProducts.js";
import PartnersHome from "./PartnersHome.js";
import CounterSection from "../About/CounterSection.js";
import VisualizerHome from "./VisualizerHome.js";
import OurMarkets from "../Exports/OurMarkets.js";
import ProjectsHome from "./ProjectsHome.js";
import ContactBubble from "../Contact/ContactBubble.js";
import CertificatesHome from "./CertificatesHome.js";
import InspirationHome from "./InspirationHome.js";
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
                    <h1>Wadi Degla Co.</h1>
                    <p>Welcome to Wadi Degla for Marble & Granite, your trusted partner in the marble business since 1980.</p>
                        <div className="place4btns">
                            <Link to='/history' onClick={() => {window.scrollTo(0, 0);}}><button className="btn2">OUR HISTORY</button></Link>

                            <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><button className="btn1">OUR PRODUCTS</button></Link>

                        </div>
            </div>
            <section className="intro-home-section">
                <h2>45 Years shaping the future of stone</h2>
                <p>With a legacy spanning 45 years, Wadi Degla for Marble & 
                    Granite has been at the forefront of quarrying, crafting, and 
                    exporting the finest natural stone. Passed down through three 
                    generations, our passion for excellence and innovation has cemented 
                    our reputation as a global leader in the industry. From 
                    Egypt’s legendary quarries to landmark projects across the 
                    world, we continue to shape architectural masterpieces, honoring 
                    our heritage while embracing the future. With every slab we extract 
                    and every stone we refine, we uphold a tradition of 
                    quality, expertise, and trust—bringing visions to life, one stone at 
                    a time.
                </p>
            </section>
            <MissionVisionSection />
            <div id="home-about-button" className="home-button-section">
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/about');
                    window.scrollTo({top: 0});
                }}>ABOUT WADI DEGLA</button>                     
            </div>

            <QuarriesHome />
            <FeaturedProducts />
            <PartnersHome />
            <CertificatesHome />
            <InspirationHome />

            <CounterSection />
            <VisualizerHome />
            <OurMarkets />
            <div className="home-button-section">
                <button
                className="btn2"
                style={{marginTop: "5rem"}}
                onClick={() => {
                    navigate('/exports');
                    window.scrollTo({top: 0});
                }}>LEARN MORE</button>                     
            </div>
            <ProjectsHome />

            <ContactBubble />
        </div>
    )
}
           
