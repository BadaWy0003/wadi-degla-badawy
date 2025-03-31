import React from "react";
import './Kerbstone.css';
import Section from "../Section/Section";
import { str,
        full_batter,
        bullnose,
        roundtop,
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
                    <h2>Kerbstone – Egyptian Granite</h2>
                    <img className="kerb-intro-img-mobile" src={kerb_intro_img} alt="kerb intro img" />
                    <p>Wadi Degla offers premium-quality kerbstones crafted from authentic Egyptian granite, renowned 
                        for its exceptional durability, strength, and natural beauty. Our kerbstones are ideal for 
                        infrastructure, urban planning, landscaping, and luxury developments, providing both 
                        functionality and a sophisticated aesthetic.
                        <br/><br/>
                        Manufactured in Wadi Degla’s advanced factories, our granite kerbstones are available in a 
                        variety of surface finishes such as polished ,flamed, honed and sandblasted  can be customized 
                        to meet any required size or project specification. With high resistance to 
                        wear, weathering, and heavy traffic, they are the perfect choice for city streets, public 
                        walkways, hotel driveways, and premium residential projects.

                        <br/><br/>
                        With over 45 years of expertise and a global export presence, Wadi Degla guarantees reliable 
                        supply capacity, competitive pricing, and professional logistics support for projects across 
                        Europe, the Caribbean, and beyond.

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
                    text="Wadi Degla's round top garden edging is the perfect finishing 
                    touch to any garden or pathway, helping to create distinct areas and 
                    guiding visitors in the direction you choose. Available in many 
                    neutral colours, this edging will suit any paving from our 
                    collection." 
                    images={roundtop} 
                    imagePosition="right" 
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
                    imagePosition="left" 
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
                    imagePosition="right" 
                />
                <section className="kerb-final"> 
                    <h2>Kerbstone/Curbstone Sizes, Finishes & Materials</h2>
                    <p>To create a boundary and maintain a clean edge for your driveway, kerb stones add both 
                        functionality and visual appeal to your outdoor space. Beyond providing a stylish finishing 
                        touch, kerb stones and block paving edging play a vital role in the overall design of your 
                        driveway.
                        <br/><br/>
                        At WADI DEGLA, we offer a wide range of high-quality kerb stones, crafted for 
                        strength, durability, and elegance. Available in various colors, textures, sizes, and 
                        designs, our kerb stones seamlessly complement any driveway project—whether in a modern or 
                        traditional setting.
                        <br/><br/>
                        We provide standard sizes, but our factory is fully equipped to produce custom dimensions to 
                        meet your specific requirements. As showcased above, we manufacture diverse product models and 
                        are ready to deliver bespoke designs with the necessary dimensions, finishes, and materials.
                    </p>

                        <Table />
                    </section>

            </div>
            <ContactBubble />
            </div>    
            )
}