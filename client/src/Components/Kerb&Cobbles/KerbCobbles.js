import React from "react";
import './KerbCobbles.css';
import Section from "./Section";

import bullnose1 from "../../Public/Assets/Media/Kerb-and-Cobbles/bullnose1.jpg";
import bullnose2 from "../../Public/Assets/Media/Kerb-and-Cobbles/bullnose2.jpg";
import roundtop1 from "../../Public/Assets/Media/Kerb-and-Cobbles/roundtop1.jpg";
import roundtop2 from "../../Public/Assets/Media/Kerb-and-Cobbles/roundtop2.png";
import ContactBubble from "../Contact/ContactBubble";

export default function KerbCobbles(){
   const images1=[
        bullnose1,
        bullnose2,
    ]
   const images2=[
        roundtop1,
        roundtop2,
    ]
    return(
        <div className='kerbcobbles-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>KERBSTONE & COBBLES</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Kerbstone & Cobbles</p>
                        </div>
                </div>  
            <section className="kerbcobbles-section">        
                <Section 
                    title="BULLNOSE KERBSTONE" 
                    text="We know that hard landscaping for city developments 
                    and highway projects have to meet certain standards 
                    and provide durable surfaces that can withstand increasing 
                    levels of traffic – that’s where our collection of bullnose 
                    kerbs can help. Precision-manufactured and durable, they are 
                    used for highway schemes up and down the country. These 
                    products meet strict guidelines." 
                    images={images1} 
                    imagePosition="left" 
                />

                <Section 
                    title="Urban Architecture" 
                    text="Explore the modern and historical architectural wonders." 
                    images={images2} 
                    imagePosition="right" 
                />
            </section>

            <ContactBubble />
            </div>    
            )
}