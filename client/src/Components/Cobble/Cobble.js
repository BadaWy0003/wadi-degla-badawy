import React from "react";
import './Cobble.css';
import Section from "../Section/Section";
import { cobbleImages } from "./CobbleImageData";
import ContactBubble from "../Contact/ContactBubble";

export default function Cobble(){
    return(
        <div className='cobble-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>COBBLE</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Cobble</p>
                        </div>
                </div>  

            <div className="cobble-section">
            <Section 
                    title="Timeless Elegance and Lasting Durability" 
                    text={
                        <>
                        Egyptian Grey Granite stands as a captivating example of understated 
                    elegance. Originating from Egypt’s geological treasures, this granite showcases a 
                    palette of soft greys and gentle variations that exude sophistication. Its surface 
                    often features subtle veining and intricate patterns, adding depth and texture to its 
                    appearance.
                    <br/><br/>
                    With its neutral yet compelling hues, Egyptian Grey Granite effortlessly complements a 
                    variety of design styles, making it a versatile choice for both classic and contemporary 
                    spaces. Its durability and resilience ensure its suitability for various 
                    applications, from kitchen countertops and bathroom surfaces to interior flooring and 
                    exterior facades.
                    <br/><br/>
                    Beyond its aesthetic appeal, Egyptian Grey Granite boasts inherent strength and 
                    resistance, promising longevity even in high-traffic areas. Its easy maintenance and 
                    timeless charm make it a sought-after material for those who appreciate subdued beauty 
                    and enduring quality. As it graces architectural projects, Egyptian Grey Granite evokes 
                    a sense of quiet sophistication, transforming spaces into havens of understated luxury.
                    </>
                    }
                            images={cobbleImages} 
                    imagePosition="left" 

                />
                <p className="cobble-description">
                Flamed paving is a specialized surface treatment that elevates the aesthetics and durability 
                of various outdoor spaces. This technique involves subjecting natural stone, typically 
                granite or basalt, to intense heat, causing the surface to erupt into a textured, rugged 
                finish. The result is a unique blend of visual appeal and enhanced slip resistance, making it 
                an ideal choice for a wide range of outdoor applications.
                <br/><br/>
                The flamed texture of the stone creates a distinctive appearance characterized by its 
                rough, uneven surface and vibrant color variations. This surface treatment not only brings out 
                the natural beauty of the stone but also adds a sense of dimension and character to outdoor 
                spaces. Whether used in pathways, patios, driveways, or pool decks, flamed paving imparts a 
                rustic charm that complements various architectural styles.
                <br/><br/>
                One of the standout features of flamed paving is its exceptional slip resistance. The rugged 
                surface texture created during the flaming process provides an enhanced grip, particularly 
                beneficial in areas exposed to moisture like pool decks or pathways. This makes flamed paving 
                a practical and safe choice for both residential and commercial spaces, ensuring a secure 
                footing for pedestrians even in wet conditions.
                <br/><br/>
                Furthermore, flamed paving is renowned for its durability and resilience. The process of 
                subjecting the stone to high temperatures makes it less prone to weathering and erosion. This 
                means that flamed paving not only maintains its visual appeal over time but also stands up to 
                the rigors of changing weather patterns, heavy foot traffic, and vehicular loads.
                <br/><br/>
                Maintenance-wise, flamed paving is relatively low-maintenance. Its textured surface helps 
                camouflage dirt and stains, requiring less frequent cleaning compared to smoother 
                surfaces. Regular sweeping and occasional power washing are usually sufficient to keep the 
                paving looking pristine.
                <br/><br/>
                In conclusion, flamed paving is a versatile and functional choice for outdoor spaces. By 
                marrying aesthetic appeal with practical advantages such as slip resistance and 
                durability, it transforms landscapes into both visually captivating and functional 
                areas. Whether enhancing the charm of a residential backyard or adding a touch of elegance 
                to a commercial outdoor space, flamed paving is a testament to the synergy between 
                nature’s raw beauty and human ingenuity.
                </p>
            </div>
            <ContactBubble />
            </div>    
            )
}