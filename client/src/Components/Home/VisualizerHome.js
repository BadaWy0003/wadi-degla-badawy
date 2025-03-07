import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


export default function VisualizerHome() {
      const navigate = useNavigate();

    return(
        <section className="visualizer-home-section">
            <div className="visualizer-home-inner">
            <h2>Bring Your Vision to Life</h2>
            <p>View our premium materials in realistic indoor and outdoor 
                settings before making your choice using our <strong>visualizer tool</strong>.
                </p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/visualizer');
                    window.scrollTo({top: 0});
                }}>TRY IT NOW</button>                     

            </div>

        </section>
    );
}