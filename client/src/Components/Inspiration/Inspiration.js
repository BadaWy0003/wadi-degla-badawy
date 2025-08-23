import React from "react";
import './Inspiration.css';
import {ancientImageData, interiorImageData, exteriorImageData} from "./InspirationImageData";
import InspoAncientSwiper from "./InspoAncientSwiper";
import InspoSwiper from "./InspoSwiper";
import { Helmet } from 'react-helmet-async';

import ContactBubble from "../Contact/ContactBubble";

export default function Inspiration(){
    
    return(
        <>
        <Helmet>
            <title>Inspiration | Wadidegla</title>
            <meta name="description" content="Inspiration Description" />
            <link rel="canonical" href="https://www.wadidegla-eg.com/inspiration" />
        </Helmet>

        <div className='inspiration-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>INSPIRATION</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Inspiration</p>
                        </div>
                </div>  
            <div className="inspo-ancient-section">
            <div className="inspo-section-title">
                        <h2>Ancient</h2>
                        <hr/>
                    </div>
            </div>
            <InspoAncientSwiper images={ancientImageData} />

            <div className="inspo-ancient-section">
            <div className="inspo-section-title">
                        <h2>Interior</h2>
                        <hr/>
                    </div>
            </div>
            <InspoSwiper images={interiorImageData} />

            <div className="inspo-ancient-section">
            <div className="inspo-section-title">
                        <h2>Exterior</h2>
                        <hr/>
                    </div>
            </div>
            <InspoSwiper images={exteriorImageData} />


            <ContactBubble />
            </div>  
            </>  
            )
}