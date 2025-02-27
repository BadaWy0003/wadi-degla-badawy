import React from "react";
import './Packing.css';
// import Carousel from 'react-multi-carousel';
import MasonryGrid from "../MasonryGrid/MasonryGrid";
import ContactBubble from "../Contact/ContactBubble";
import 'react-multi-carousel/lib/styles.css';
import image3 from '../../Public/Assets/Media/3.jpg';
import image21 from '../../Public/Assets/Media/21.jpg';
// import image24 from '../../Public/Assets/Media/24.jpg';
import packing1 from '../../Public/Assets/Media/Packing/packing1.jpeg';
import packing2 from '../../Public/Assets/Media/Packing/packing2.jpeg';
import packing3 from '../../Public/Assets/Media/Packing/packing3.jpeg';
import packing4 from '../../Public/Assets/Media/Packing/packing4.jpeg';
import packing5 from '../../Public/Assets/Media/Packing/packing5.jpeg';
import packing6 from '../../Public/Assets/Media/Packing/packing6.jpeg';
import packing7 from '../../Public/Assets/Media/Packing/packing7.jpeg';


export default function Packing(){

    const images = [
        packing1,
        packing2,
        packing3,
        packing4,
        packing5,
        packing6,
        packing7
    ];

    
    
    return(
        <div className='packing-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>PACKING</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Packing</p>
                        </div>
                </div>  
     
                <div className="packing-slabs">
                    <div className="packing-slabs-content">
                        <h1>PACKING MARBLE AND GRANITE SLABS</h1>

                        <h3>Wooden bundle From Wadi Degla</h3>
                        <p>The slabs are gathered in groups each group contains form 8 to 15 slabs according to their thickness packed in wooded 
                            bundles & Loaded either in 20 feet box container using the boom crane or in open container using the over head crane 
                            according to the request of our customer as well as the availability of the open top containers.
                            N.B. Polished Slabs are separated by Plastic sheets to be protected against scratches.</p>

                        <h3>Slabs Normal Packing From Wadi Degla</h3>
                        <p>The slabs are manually placed directly on the ground of the container lashed on two wooden bars (Coverlets) on the inner 
                            long sides of 20 feet dry Box container, if the slabs are long in length so the container take only two groups one to 
                            the right and the other to the left, if the slabs are short in length so the container take four group of slabs two to 
                            the right and two to the left. N.B. Polished Slabs are separated by Plastic sheets to be protected against scratches.</p> 

                    </div>
                    <img src={image3} alt=""/>
                </div>  

                <div className="packing-tiles">
                    <img src={image21} alt=""/>
                    <div className="packing-tiles-content">
                    <h1>PACKING MARBLE AND GRANITE TILES</h1>

                    <h3>Wooden cerates From Wadi Degla</h3>
                    <p>Tiles are packed after being highly selected according to the approved samples in wooden crates (Boxes) lined by foam for better protection.<br/>
                    Each Wooden crate contains certain Number of tiles according to the thickness, All the crate content details are mentioned in the label paper fixed on out side of the crate.<br/>
                    Only 12"x12" tiles (10mm +/- 0.5 thick) are packed in Styrofoam boxes before being packed inside the wooden creates, thin Plastic sheets are added between polished faces of the tiles 
                    to avoid surface scratching.</p>

                    <h3>Wooden pallet From Wadi Degla</h3>
                    <p>Tiles are packed after being highly selected according to the approved samples on wooden pallets surrounded by foam for better protection, and 
                        fasten with plastic belts with rubber pieces on the edges to avoid any damages that might happen
                    According to the size & thickness of the tiles each Wooden pallet contains certain number of tiles, All details of the pallet contents are mentioned 
                    in the label paper fixed on the lateral side of the pallet.</p> 
                    </div>
                </div> 
            {/* Image Grid Section */}

            <div className="image-grid">
            <MasonryGrid props={images}/>

            </div>
            <ContactBubble />

            </div>    
            )
}