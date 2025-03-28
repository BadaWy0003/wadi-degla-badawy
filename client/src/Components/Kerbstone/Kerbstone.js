import React from "react";
import './Kerbstone.css';
import Section from "../Section/Section";
import { str,
        full_batter,
        bullnose,
        roundtop,
        circCorner,
        channel,
        transition } from "./KerbstoneImageData";
import kerb_intro_img from '../../Public/Assets/Media/Kerb-and-Cobbles/kerb/kerb-bg.jpg';
import Table from "./Table";
import ContactBubble from "../Contact/ContactBubble";

export default function Kerbstone(){
    return(
        <div className='kerbstone-container'>
                    {/* 🌟 Hero Section */}
        <div className="quarries-hero">
                        <h1>KERBSTONE</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} kerbstone</p>
                        </div>
                </div>  
            <div className="kerbstone-section">   
                <section className="kerb-intro"> 
                    <h2>Fully Automatic Production Curbstone / Kerbstone Line</h2>
                    <img className="kerb-intro-img-mobile" src={kerb_intro_img} alt="kerb intro img" />
                    <p>We are excited to announce that we are currently establishing 
                        ourselves as the inaugural factory in the Arab Republic of Egypt 
                        and the Middle East, specializing in the production of kerbstones 
                        in a wide array of products and sizes. What sets us apart is our 
                        innovative approach, as we have implemented a fully automated 
                        production line that eliminates the need for manual labor. Our 
                        cutting-edge machinery, sourced from China, plays a pivotal role 
                        in our manufacturing process. These state-of-the-art machines are 
                        designed to precisely cut and shape each kerbstone piece to 
                        perfection. Additionally, we have incorporated a 
                        specialized machine that excels in shaping and profiling 
                        works, further enhancing the quality and precision of our 
                        products. We take immense pride in pioneering this groundbreaking 
                        venture in our region, offering top-notch kerbstones to meet the 
                        diverse needs of our esteemed customers.
                        <br/><br/>
                        Sawn-cut curbstones are available with customizable dimensions and surface 
                        options like sawn-cut, sand-blasted and flamed.
                        <br/><br/>
                        Through our KERB stone production lines, profile machines, and splitting 
                        machines, we managed to produce many carbide products with different 
                        designs, from all granite and Egyptian materials, as well as with 
                        different surface finishes (Cut – Flamed – Sandblast – Splitting)

</p>
                    </section>
            <Section 
                    title="STR KERBSTONE" 
                    text="Identical in design with T-kerb with an integrated drainage 
                    system. The surface water of the road is kept away from the level 
                    crossing and can seep into the ground. Quick installation in 
                    combination with standard foundations from STR." 
                    images={str} 
                    imagePosition="left" 
                />
                <Section 
                    title="FULL BATTER KERBSTONE" 
                    text="Used where a vehicle may need to ride up onto a verge in 
                    an emergency, for safety reasons these are not used when a 
                    footpath is present. Where a crossing is required for access 
                    to a private driveway, access point or pedestrian crossing, the 
                    appropriate tapers and crossing kerbs are used." 
                    images={full_batter} 
                    imagePosition="right" 
                />
                <Section 
                    title="BULLNOSE KERBSTONE" 
                    text="We know that hard landscaping for city developments 
                    and highway projects have to meet certain standards 
                    and provide durable surfaces that can withstand increasing 
                    levels of traffic – that’s where our collection of bullnose 
                    kerbs can help. Precision-manufactured and durable, they are 
                    used for highway schemes up and down the country. These 
                    products meet strict guidelines." 
                    images={bullnose} 
                    imagePosition="left" 
                />
                <Section 
                    title="ROUND TOP GARDEN EDGE" 
                    text="AFRICA GRANITE Round Top garden edging is the perfect finishing 
                    touch to any garden or pathway, helping to create distinct areas and 
                    guiding visitors in the direction you choose. Available in many 
                    neutral colours, this edging will suit any paving from our 
                    collection." 
                    images={roundtop} 
                    imagePosition="right" 
                />
                <Section 
                    title="CIRCULAR CORNER KERBSTONE" 
                    text="A ‘bend’ in a kerb line is more correctly known as 
                    a ‘radius’. all bends, curves and arcs are composed of one 
                    or more radiuses (or radii, if you prefer). While it is 
                    possible to create a radius by using straight kerbs, there 
                    are both road kerbs and block-paving kerb units that are 
                    specially shaped to create true, accurate curves, either 
                    internal (concave) or external (convex)." 
                    images={circCorner} 
                    imagePosition="left" 
                />
    
                <Section 
                    title="CHANNEL KERBSTONE" 
                    text="Stone Drainage Channels are often used to create a 
                    holistic and complete expression when using granite in 
                    outdoor facilities. The gutters are available in the head, middle 
                    and end pieces. we are a great way to help homeowners control their 
                    water flow and water runoff. Before you build a hardscape for your 
                    home, it’s important to think about where your water travels and 
                    where you can incorporate drainage." 
                    images={channel} 
                    imagePosition="right" 
                />

                <Section 
                    title="TRANSITION KERBSTONE" 
                    text="A transition kerb enables vehicles to cross the public 
                    pavement to access a private driveway, which makes it possible 
                    to drive over them, but should clearly indicate to the driver 
                    that they are leaving the lane with a harmless impact. Transition 
                    kerb stones are usually used in urban areas to border traffic islands 
                    and pedestrian crossing aids, which could add value to your property." 
                    images={transition} 
                    imagePosition="left" 
                />
                <section className="kerb-final"> 
                    <h2>Kerbstone/Curbstone Sizes, Finishes & Materials</h2>
                    <p>To create a boundary and keep a clean edge to your driveway, kerb stones can add 
                        great appeal to the outside of your home. As well as offering a stylish finishing 
                        touch to your driveway, kerb stones and block paving edging are an integral part 
                        of its overall design. At AFRICA GRANITE we supply a wide range of kerb 
                        stones, designed with strength, durability and style in mind. With a variety 
                        of different colours and designs, our kerb stones are the ideal complement to 
                        any driveway project – whether in a contemporary or traditional setting. In a 
                        range of textures, sizes and shapes, our kerb stones are the perfect complement 
                        to your project. As with all of our products.
                        <br/><br/>
                        this is an example for regular sizes that we produce, we are ready to produce any 
                        dimensions required. as shown above some models of the products that we 
                        produce, our factory is ready to implement any different designs with the 
                        required dimensions, finishes, and materials.

                    </p>

                        <Table />
                    </section>

            </div>
            <ContactBubble />
            </div>    
            )
}