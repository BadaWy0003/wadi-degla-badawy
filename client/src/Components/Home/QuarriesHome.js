import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


export default function QuarriesHome() {
      const navigate = useNavigate();

    return(
        <section className="quarries-home-section">
            <h2>Global Quarries</h2>
            <h4>The Heart of the Natural Stone Industry</h4>
            <p>Quarries worldwide are the foundation of the marble and 
                granite industry, supplying the world with high-quality 
                natural stone used in luxury construction, hotels, and 
                architectural masterpieces. From the legendary Carrara 
                quarries in Italy, famous for their pristine white 
                marble, to the rich quarries of Egypt, Brazil, India, and 
                Turkey, these sites produce some of the finest materials 
                used in global projects.
                </p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/quarries');
                    window.scrollTo({top: 0});
                }}>LEARN MORE</button>                     

        </section>
    );
}