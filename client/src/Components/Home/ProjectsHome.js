import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";


export default function ProjectsHome() {
      const navigate = useNavigate();

    return(
        <section className="projects-home-section">
            <h2>Experience Our Work in Action</h2>
            <p>Explore our completed <strong>projects</strong> across stunning locations and 
                see our materials in real-world applications.
                </p>
                <button
                className="btn2"
                style={{marginTop: "2rem"}}
                onClick={() => {
                    navigate('/projects');
                    window.scrollTo({top: 0});
                }}>VIEW PROJECTS</button>                     


        </section>
    );
}