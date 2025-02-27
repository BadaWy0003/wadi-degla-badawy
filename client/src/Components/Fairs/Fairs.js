import React from "react";
import './Fairs.css';
import ContactBubble from "../Contact/ContactBubble";

export default function Fairs(){


    
    
    return(
        <div className='fairs-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>FAIRS</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Fairs</p>
                        </div>
                </div>  
            <div className="coming-soon">
                <h1>Coming Soon</h1>
            </div>
            <ContactBubble />
            </div>    
            )
}