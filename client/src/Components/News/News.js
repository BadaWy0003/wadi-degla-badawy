import React from "react";
import './News.css';
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';

export default function News(){


    
    
    return(
        <>
        <Helmet>
            <title>News | Wadidegla</title>
            <meta name="description" content="News Description" />
            <link rel="canonical" href="https://www.wadidegla-eg.com/news" />
        </Helmet>
        
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
            </> 
            )
}