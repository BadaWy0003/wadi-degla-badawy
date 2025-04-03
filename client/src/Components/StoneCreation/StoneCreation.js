import React from "react";
import './StoneCreation.css';
import "../Inspiration/Inspiration.css";
// import Section from "../Section/Section";
import { architectureData, mosaicsData } from "./StoneCreationData";
import ContactBubble from "../Contact/ContactBubble";
import ImageSection from "../Section/ImageSection";

export default function StoneCreation(){
    return(
        <div className='stone-creation-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>Stone Creations</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Stone Creations</p>
                        </div>
                </div>  

            <div className="stone-creation-section">
            <div className="inspo-section-title">
                        <h2>Landscaping & architecture elements</h2>
                        <hr/>
                    </div>
            <ImageSection sectionData={architectureData} />
            </div>
            
            <div className="stone-creation-section">

            <div className="inspo-section-title">
                        <h2>Mosaics</h2>
                        <hr/>
                    </div>
            <ImageSection sectionData={mosaicsData} />

            </div>
            <ContactBubble />
            </div>    
            )
}