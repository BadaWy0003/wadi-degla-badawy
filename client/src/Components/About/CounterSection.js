import React from "react";

import CountUp from 'react-countup';
import projects from '../../Public/Assets/Icons/projects.svg'
import manpower from '../../Public/Assets/Icons/manpower-stroke.svg'
import technology from '../../Public/Assets/Icons/technology.svg'
import craftsmanship from '../../Public/Assets/Icons/craftsmanship.png'
import global_supply_chain from '../../Public/Assets/Icons/global-supply-chain.svg'
import tiles from '../../Public/Assets/Icons/tiles.svg'


export default function CounterSection() {

    return(
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

    );
}