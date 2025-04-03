import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./ContactBubble.css";
import envelope from "../../Public/Assets/Icons/envelope.svg";

export default function ContactBubble() {
    const [isClicked, setIsClicked] = useState(false);
    const bubbleRef = useRef(null);
    const navigate = useNavigate();
    
    function OnClick(){
        navigate('/contact'); 
        window.scrollTo({top: 0});
       }
   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
                setIsClicked(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="contact-bubble-container" ref={bubbleRef}>
            <div 
                className={`contact-bubble ${isClicked ? 'active' : ''}`}
                onClick={() => setIsClicked(!isClicked)}
            >
                <img loading="lazy" src={envelope} alt="Contact Us" />
            </div>
            <div className={`contact-bubble-clicked ${isClicked ? 'active' : ''}`}>
                <p>We are looking forward to working with you!</p>
                <button 
                className="btn1"
                onClick={OnClick}>GET IN TOUCH</button>
            </div>
        </div>
    );
}