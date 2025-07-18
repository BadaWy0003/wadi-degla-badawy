import React from "react";
import './NotFound404.css';
import ContactBubble from "../Contact/ContactBubble";
import logo_color_stroke from "../../Public/Assets/Media/logo-color-stroke-notext.svg"
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

export default function NotFound404() {
    const navigate = useNavigate();
    
    return (
        <>
        <Helmet>
            <title>404 | Wadidegla</title>
            <meta name="description" content="404 Description" />
            <link rel="canonical" href="https://www.wadidegla-eg.com/*" />
        </Helmet>

        <div className="page-404">
            <div className="container-404">
                <img loading="lazy" 
                src={logo_color_stroke} 
                alt="Logo" 
                className="logo-404" />
                <div className="content-404">
                <h1>404 Not Found</h1>
                <p>The page you are looking for might be removed or is temporarily unavailable</p>
                <button
                    className="btn1"
                    style={{marginTop: "2rem"}}
                    onClick={() => {
                        navigate('/');
                        window.scrollTo({top: 0});
                    }}>BACK TO HOMEPAGE</button>  
            </div>
        </div>                   
            <ContactBubble />
        </div>
        </>
    );
}
