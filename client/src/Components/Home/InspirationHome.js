import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


export default function InspirationHome() {
      const navigate = useNavigate();

    return(
        <section className="inspiration-home-section">
            <h2>Inspiration</h2>
            <h4>Built to Inspire Across Eras</h4>
            <p>From the grandeur of ancient Egypt to today’s refined 
                interiors and bold exteriors—explore how marble and 
                granite have always shaped beautiful spaces.
                </p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/inspiration');
                    window.scrollTo({top: 0});
                }}>BROWSE INSPIRATION</button>                     

        </section>
    );
}