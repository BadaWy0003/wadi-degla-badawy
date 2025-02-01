import React from "react";
import './Partners.css';
import { useNavigate } from "react-router-dom";
import otrovato from '../../Public/Assets/Icons/partners/otrovato.png';
import orascom from '../../Public/Assets/Icons/partners/orascom.png';
import mivida from '../../Public/Assets/Icons/partners/mivida.png';
import hydepark from '../../Public/Assets/Icons/partners/hydepark.png';
import wyndham from '../../Public/Assets/Icons/partners/wyndham.png';
import cfc from '../../Public/Assets/Icons/partners/cfc.webp';
import trade_logistics from '../../Public/Assets/Icons/partners/trade-logistics.png';


export default function Partners() {
    const navigate = useNavigate();

    // Array of partner logo image URLs
    const partnerLogos = [
        otrovato,
        orascom,
        mivida,
        hydepark,
        wyndham,
        cfc,
        trade_logistics
    ];

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
        </div>
    );
}