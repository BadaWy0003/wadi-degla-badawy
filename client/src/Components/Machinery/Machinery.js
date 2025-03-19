import React from "react";
import './Machinery.css';
import { generalUseData, mngBlocksData, mngSlabsData, mngTilesData } from "./MachineryData";
import MachinerySwiper from "./MachinerySwiper";
import ContactBubble from "../Contact/ContactBubble";


export default function Machinery(){
    
    return(
        <div className='machinery-container'>
                    {/* 🌟 Hero Section */}
                    <div className="quarries-hero">
                        <h1>OUR MACHINERY</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Machinery</p>
                        </div>
                </div>  
                <div className="machinery-intro">
                    <p>At Wadi Degla Marble & Granite, we believe that exceptional craftsmanship begins with 
                      cutting-edge technology. Our state-of-the-art machinery is the backbone of our 
                      operations, enabling us to deliver unparalleled precision, efficiency, and quality in everything
                       we produce.</p>    
                </div>   

                {/*GENERAL USE SECTION*/}  
                <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>GENERAL USE</h2>
                        <hr/>
                    </div>
                    <div className="machinery-grid">
                    {generalUseData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={item.title} />
                        ))}
                    </div>
                    </div>
                    
                    {/*BLOCKS SECTION*/}
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE BLOCKS</h2>
                        <hr/>
                    </div>
                    <div className="machinery-grid">
                    {mngBlocksData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={item.title} />
                        ))}
                    </div>
                    </div>

                    {/*SLABS SECTION*/}  
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE SLABS</h2>
                        <hr/>
                    </div>                    
                    <div className="machinery-grid">
                    {mngSlabsData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={item.title} />
                        ))}
                    </div>
                    </div>

                    {/*TILES SECTION*/} 
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE TILES</h2>
                        <hr/>
                    </div>
                    <div className="machinery-grid">
                    {mngTilesData.map((item, index) => (
                        <MachinerySwiper key={index} images={item.images} title={item.title} />
                        ))}
                    </div>
                    </div>

                    <ContactBubble />
            </div>    
            )
}