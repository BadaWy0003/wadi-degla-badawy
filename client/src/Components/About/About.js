import React from "react";
import './About.css';
// import logo_color_notext from '../../Public/Assets/Media/logo-color-notext.svg'
import logo_color_stroke_notext from '../../Public/Assets/Media/logo-color-stroke-notext.svg'
import expertise_square_image from '../../Public/Assets/Media/about-expertise-2.jpeg'
import MissionVisionSection from "./MissionVisionSection";
import CounterSection from "./CounterSection";
import ContactBubble from "../Contact/ContactBubble";

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
                    <h2>A Legacy of Excellence</h2>
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

            < MissionVisionSection />
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

            <CounterSection />

            <div className="thanks-section">
                <h2>Elevate Your Vision with Wadi Degla</h2>
                <h4>Wadi Degla Marble & Granite is synonymous with grandeur,
                    quality, and a relentless pursuit of perfection. <br/>Our
                    commitment to excellence is unrivaled, and our legacy is built
                    on delivering unmatched value to our clients. <br/>
                    When you choose Wadi Degla, you're not just selecting a supplier you're
                    partnering with a family dedicated to turning your
                    architectural dreams into timeless realities.</h4>
            </div>
            <ContactBubble />

        </div>    
            )
}