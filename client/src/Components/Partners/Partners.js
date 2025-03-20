import React from "react";
import './Partners.css';
import { useNavigate } from "react-router-dom";
import ContactBubble from "../Contact/ContactBubble";
import otrovato from '../../Public/Assets/Icons/partners/otrovato.png';
import orascom from '../../Public/Assets/Icons/partners/orascom.png';
import emaar from '../../Public/Assets/Icons/partners/emaar.svg';
import hydepark from '../../Public/Assets/Icons/partners/hydepark.png';
import wyndham from '../../Public/Assets/Icons/partners/wyndham.png';
import majid_alfuttaim from '../../Public/Assets/Icons/partners/majid-alfuttaim.png';
import trade_logistics from '../../Public/Assets/Icons/partners/trade-logistics.png';
import egy_consulate_kuwait from '../../Public/Assets/Icons/partners/egy-consulate-kuwait.jpeg';
import ckpc from '../../Public/Assets/Icons/partners/ckpc.jpeg';
import wd_developments from '../../Public/Assets/Icons/partners/wd-developments.jpeg';
import mountain_view from '../../Public/Assets/Icons/partners/mountain-view.png';

    // Array of partner logo image URLs
    export const partnerLogos = [
        otrovato,
        orascom,
        emaar,
        egy_consulate_kuwait,
        wyndham,
        hydepark,
        majid_alfuttaim,
        trade_logistics,
        ckpc,
        wd_developments,
        mountain_view,
    ];

export default function Partners() {
    const navigate = useNavigate();

    
    const handleButtonClick = () => {
        navigate("/contact"); // Navigate to the contact page
    };

    return (
        <div className='partners-container'>
            <h1>OUR PARTNERS & CLIENTS</h1>
            <div className="partners">
                {partnerLogos.map((logo, index) => (
                    <img
                        id={`partner-logo-${index + 1}`}
                        key={index} // Unique key for each logo
                        src={logo}
                        alt={`Partner Logo ${index + 1}`}
                    />
                ))}
            </div>

            <button className="btn1" onClick={handleButtonClick}>
                Become one of our partners
            </button>
            <ContactBubble />
        </div>
    );
}