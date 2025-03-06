import React from "react";
import './Partners.css';
import { useNavigate } from "react-router-dom";
import ContactBubble from "../Contact/ContactBubble";
import otrovato from '../../Public/Assets/Icons/partners/otrovato.png';
import orascom from '../../Public/Assets/Icons/partners/orascom.png';
import mivida from '../../Public/Assets/Icons/partners/mivida.png';
import hydepark from '../../Public/Assets/Icons/partners/hydepark.png';
import wyndham from '../../Public/Assets/Icons/partners/wyndham.png';
import cfc from '../../Public/Assets/Icons/partners/cfc.svg';
import trade_logistics from '../../Public/Assets/Icons/partners/trade-logistics.png';
import egy_consulate_kuwait from '../../Public/Assets/Icons/partners/egy-consulate-kuwait.jpeg';

    // Array of partner logo image URLs
    export const partnerLogos = [
        otrovato,
        orascom,
        mivida,
        egy_consulate_kuwait,
        wyndham,
        hydepark,
        cfc,
        trade_logistics
    ];

export default function Partners() {
    const navigate = useNavigate();

    
    const handleButtonClick = () => {
        navigate("/contact"); // Navigate to the contact page
    };

    return (
        <div className='partners-container'>
            <h1>OUR PARTNERS</h1>
            <div className="partners">
                {partnerLogos.map((logo, index) => (
                    <img
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