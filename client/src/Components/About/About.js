import React from "react";
import './About.css';
import CountUp from 'react-countup';
import bullseye_gold from '../../Public/Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../../Public/Assets/Icons/paper-plane-gold.svg'
// import logo_color_notext from '../../Public/Assets/Media/logo-color-notext.svg'
import logo_color_stroke_notext from '../../Public/Assets/Media/logo-color-stroke-notext.svg'
import expertise_square_image from '../../Public/Assets/Media/expertise-square-image.jpg'
import tiles from '../../Public/Assets/Icons/tiles.svg'
import projects from '../../Public/Assets/Icons/projects.svg'
import manpower from '../../Public/Assets/Icons/manpower-stroke.svg'
import technology from '../../Public/Assets/Icons/technology.svg'
import craftsmanship from '../../Public/Assets/Icons/craftsmanship.png'
import global_supply_chain from '../../Public/Assets/Icons/global-supply-chain.svg'


import 'react-multi-carousel/lib/styles.css';



export default function About(){


    return(
        <div className='about-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>WHY CHOOSE US</h1>
                <div className="breadcrumb">
                <a href="/">Home</a>
                <p>{'>'} Why Choose Us</p>
                </div>
            </div>  
            {/* Intro Section */}
            <div className="about-intro-section">
                <div className="about-intro-section-content">
                    <h2>Title</h2>
                    <p> At <strong>Wadi Degla</strong> Marble & Granite, three
                        generations of <strong>passion</strong> and <strong>expertise</strong> converge to bring
                        you the <strong>finest</strong> natural stone products. We are delighted
                        to introduce you to our legacy, our values, and our
                        commitment to <strong>excellence</strong> in every project we
                        undertake. 
                        <br/><br/>
                        Our family-owned business has been a <strong>cornerstone</strong> in
                        the marble and granite industry for over <strong>four decades</strong>,
                        and we invite you to discover how our heritage and
                        innovation can contribute to the <strong>success</strong> of your next
                        grand vision.
                        </p>
                </div>

                <div className="about-intro-section-image">
                    <img src={logo_color_stroke_notext} alt="logo-notext"/>
                </div>
            </div>

            <div className="mission-vision-section">

                <div className="vision-card" >
                    <img src={paper_plane_gold} alt="vision-icon"/>
                    <h2>Our Vision</h2>
                    <p> To be a global leader in the natural stone industry,
                        recognized for our exceptional products, sustainable
                        practices, and dedication to transforming architectural
                        visions into timeless realities.</p>
                </div>
                <div className="mission-card">
                    <img src={bullseye_gold} alt="mission-icon"/>
                    <h2>Our Mission</h2>
                    <p> To deliver unparalleled quality in marble and granite
                        products, exceeding our clients' expectations through
                        innovation, expertise, and a commitment to excellence,
                        while upholding the rich heritage of our family legacy.
                        </p>
                </div>

            </div> 

            <div className="our-expertise-section">
                <div className="our-expertise-title">
                    <hr/>
                    <h2>Our Expertise</h2>
                    <p>Partnering in Grand Visions</p>
                </div>
                <div className="our-expertise-section-content">
                    <div className="our-expertise-section-content-image">
                        <img src={expertise_square_image} alt="expertise-image"/>
                    </div>
                    <div className="our-expertise-section-content-text">
                        <p>At Wadi Degla Marble & Granite, we specialize in supplying high-quality marble and
                            granite for large-scale construction projects, including hotels, resorts, compounds,
                            and commercial developments. We are the trusted partner for large marble and
                            granite companies worldwide, capable of managing projects of any scale.</p>
                        <li><strong>Global Reach:</strong> <br/>We have successfully executed monumental projects and export
                            to America, Europe, Africa, and other regions. With our branch in Gambia and
                            the upcoming Cleopatra by Wadi Degla in South America, we are strategically
                            positioned to serve clients worldwide.</li>
                        <li><strong>Extensive Resources:</strong> <br/>With multiple factories under our name and partnerships
                            with numerous others, we have the capacity to meet the most demanding
                            requirements.</li>
                        <li><strong>Granite Excellence:</strong> <br/>We are partners in a multitude of granite factories, enabling
                            us to provide a diverse range of products and be ready for any project.</li>
                        <li><strong>International Partnerships:</strong> <br/>Our collaborations extend to quarries in Italy and
                            Turkey, enhancing our product offerings with premium international stones.</li>
                        <li><strong>Customized Solutions:</strong> <br/>Our team works closely with clients to tailor our
                            offerings to their unique specifications, timelines, and budgets—delivering
                            solutions that surpass expectations.
                            </li>

                    </div>
                </div>
            </div>

            <div className="about-counters-section">
                <div className="counter-card">
                    <img src={manpower} alt="manpower-icon"/>
                    <h2>MANPOWER</h2>
                    <CountUp start={0}
                            end={500}
                            duration={3}
                            enableScrollSpy={true}
                            separator=""
                            suffix=" +"
                            style={{ fontSize: '40px', fontWeight: 900}} />
                </div>
                <div className="counter-card">
                    <img src={tiles} alt="manpower-icon"/>
                    <h2>M<sup>2</sup> PRODUCED/DAY</h2>
                    <CountUp start={0}
                            end={3000}
                            duration={3}
                            enableScrollSpy={true}
                            separator=""
                            suffix=" +"
                            style={{ fontSize: '40px', fontWeight: 900 }} />
                </div>

                <div className="counter-card">
                    <img src={projects} alt="manpower-icon"/>
                    <h2>COMPLETED PROJECTS</h2>
                    <CountUp start={0}
                            end={300}
                            duration={3}
                            enableScrollSpy={true}
                            separator=""
                            suffix=" +"
                            style={{ fontSize: '40px', fontWeight: 900 }} />
                </div>

                <div className="counter-card">
                    <img src={technology} alt="technology-icon"/>
                    <h2>ADVANCED TECHNOLOGY</h2>
                    <p>Our factories are equipped with 
                        state-of-the-art machinery, allowing for precision
                        and efficiency in extracting and processing
                        our premium stones.</p>
                </div>
                <div className="counter-card">
                    <img src={craftsmanship} alt="craftsmanship-icon"/>
                    <h2>SKILLED CRAFTSMANSHIP</h2>
                    <p>Our artisans carry forward generations of
                        knowledge, ensuring that every product
                        meets the highest standards of quality and
                        artistry.</p>
                </div>

                <div className="counter-card">
                    <img src={global_supply_chain} alt="global-supply-chain-icon"/>
                    <h2>GLOBAL SUPPLY CHAIN</h2>
                    <p>Our partnerships with quarries and
                        factories domestically and internationally
                        ensure a steady supply of high-quality
                        materials.</p>
                </div>

            </div>

            <div className="thanks-section">
                <h1>Elevate Your Vision with Wadi Degla</h1>
                <h4>Wadi Degla Marble & Granite is synonymous with grandeur,
                    quality, and a relentless pursuit of perfection. <br/>Our
                    commitment to excellence is unrivaled, and our legacy is built
                    on delivering unmatched value to our clients. <br/>
                    When you choose Wadi Degla, you're not just selecting a supplier you're
                    partnering with a family dedicated to turning your
                    architectural dreams into timeless realities.</h4>
            </div>
        </div>    
            )
}