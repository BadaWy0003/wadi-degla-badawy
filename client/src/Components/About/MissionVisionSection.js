import React from 'react';
import bullseye_gold from '../../Public/Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../../Public/Assets/Icons/paper-plane-gold.svg'
import "./About.css"
export default function MissionVisionSection() {
    return(
                    <div className="mission-vision-section">
        
                        <div className="vision-card" >
                            <img loading="lazy" src={paper_plane_gold} alt="vision-icon"/>
                            <h2>Our Vision</h2>
                            <p> To be a global leader in the natural stone industry,
                                recognized for our exceptional products, sustainable
                                practices, and dedication to transforming architectural
                                visions into timeless realities.</p>
                        </div>
                        <div className="mission-card">
                            <img loading="lazy" src={bullseye_gold} alt="mission-icon"/>
                            <h2>Our Mission</h2>
                            <p> To deliver unparalleled quality in marble and granite
                                products, exceeding our clients' expectations through
                                innovation, expertise, and a commitment to excellence,
                                while upholding the rich heritage of our family legacy.
                                </p>
                        </div>
        
                    </div> 
        
    );
}