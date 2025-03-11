import React from "react";
import './News.css';
import ContactBubble from "../Contact/ContactBubble";

export default function News(){


    
    
    return(
        <div className='news-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>NEWS</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} News</p>
                        </div>
                </div>  
            <div className="coming-soon">
                <h1>Coming Soon</h1>
            </div>
            <ContactBubble />
            </div>    
            )
}