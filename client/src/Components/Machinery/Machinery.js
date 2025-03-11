import React from "react";
import './Machinery.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ContactBubble from "../Contact/ContactBubble";

import water_treatment from '../../Public/Assets/Media/Machinery/water-treatment.jpg';
import water_treatment_2 from '../../Public/Assets/Media/Machinery/water-treatment-2.jpg';
import slabs_bridge_cutter from '../../Public/Assets/Media/Machinery/slabs-bridge-cutter-1.jpg';
import slabs_bridge_cutter_2 from '../../Public/Assets/Media/Machinery/slabs-bridge-cutter-2.jpg';
import slabs_bridge_cutter_3 from '../../Public/Assets/Media/Machinery/slabs-bridge-cutter-3.jpeg';
import slabs_bridge_cutter_4 from '../../Public/Assets/Media/Machinery/slabs-bridge-cutter-4.jpeg';
import polishing_line from '../../Public/Assets/Media/Machinery/polishing-line.jpg';
import polishing_line_1 from '../../Public/Assets/Media/Machinery/polishing-line-1.jpg';
import polishing_line_2 from '../../Public/Assets/Media/Machinery/polishing-line-2.jpg';
import polishing_line_3 from '../../Public/Assets/Media/Machinery/polishing-line-3.jpg';
import gangsaws from '../../Public/Assets/Media/Machinery/gangsaws.jpg';
import gangsaws_2 from '../../Public/Assets/Media/Machinery/gangsaws-2.jpeg';
import gangsaws_3 from '../../Public/Assets/Media/Machinery/gangsaws-3.jpeg';
import gangsaws_4 from '../../Public/Assets/Media/Machinery/gangsaws-4.jpeg';
import gangsaws_5 from '../../Public/Assets/Media/Machinery/gangsaws-5.jpeg';
import gangsaws_6 from '../../Public/Assets/Media/Machinery/gangsaws-6.jpeg';

import big_bridge_cutter_1 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-1.jpeg';
import big_bridge_cutter_2 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-2.jpeg';
import big_bridge_cutter_3 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-3.jpeg';
import big_bridge_cutter_4 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-4.jpeg';
import monofilos from '../../Public/Assets/Media/Machinery/monofilos.jpeg';
import monofilos_2 from '../../Public/Assets/Media/Machinery/monofilos-2.jpg';
import slabs_bridge_cutter_5 from '../../Public/Assets/Media/Machinery/slabs-bridge-cutter-5.jpeg';
import risin_line from '../../Public/Assets/Media/Machinery/risin-line.jpeg';
import risin_line_2 from '../../Public/Assets/Media/Machinery/risin-line-2.jpeg';
import risin_line_3 from '../../Public/Assets/Media/Machinery/risin-line-3.jpeg';
import splitting_strips_1 from '../../Public/Assets/Media/Machinery/splitting-strips-1.jpg';
import splitting_strips_2 from '../../Public/Assets/Media/Machinery/splitting-strips-2.jpg';
import tumble_machine from '../../Public/Assets/Media/Machinery/tumble-machine.jpeg';
import fork_lift from '../../Public/Assets/Media/Machinery/fork-lift.jpg';



export default function Machinery(){

    const generalUseData = [
        {
          title: "3 Water treatment plants",
          images: [water_treatment_2, water_treatment],
        },
        {
          title: "2 Forklifts",
          images: [fork_lift],
        }
        // ,
        // {
        //   title: "3 Air compressors",
        //   images: [fork_lift,fork_lift,fork_lift],
        // }

      ];
      const mngBlocksData = [
        {
          title: "9 Gangsaws",
          images: [gangsaws_6, gangsaws, gangsaws_5, gangsaws_2, gangsaws_3, gangsaws_4],
        },
        {
          title: "4 Big bridge cutters",
          images: [big_bridge_cutter_4, big_bridge_cutter_1, big_bridge_cutter_2, big_bridge_cutter_3],
        },
        {
          title: "6 Monofilos",
          images: [monofilos_2, monofilos],
        }

      ];
      const mngSlabsData = [
        {
          title: "3 polishing lines",
          images: [polishing_line_1, polishing_line_3, polishing_line, polishing_line_2],
        },
        {
          title: "1 risin treating line",
          images: [ risin_line, risin_line_2, risin_line_3],
        }
      ];

      const mngTilesData = [
        {
          title: "5 Slabs bridge cutters",
          images: [slabs_bridge_cutter_2, slabs_bridge_cutter, slabs_bridge_cutter_3, slabs_bridge_cutter_4, slabs_bridge_cutter_5],
        },
        {
          title: "1 Tumbling machine",
          images: [tumble_machine],
        },
        {
          title: "3 Splitting strips machines",
          images: [splitting_strips_1, splitting_strips_2],
        }

      ];
    
    
    
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
                    <p>Our advanced machinery ensures precision cutting and squaring of blocks.</p>
                    
                    <div className="machinery-grid">
                    {generalUseData.map((item, index) => (
                        <div key={index} className="machinery-item">
                        <h2>{item.title}</h2>
                        <Swiper
                        loop={true} // Enable infinite loop
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        
                        modules={[Pagination]}
                        className="machinery-slider"
                        lazy={true}
                        >
                        {item.images.map((image, i) => (
                            <SwiperSlide key={i}>
                            <img src={image} alt={`${item.title} ${i + 1}`} className="swiper-lazy"/>
                            <div className="swiper-lazy-preloader"></div>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                        </div>

                        ))}
                    </div>
                    </div>
                    {/*BLOCKS SECTION*/}
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE BLOCKS</h2>
                        <hr/>
                    </div>

                    <p>Our advanced machinery ensures precision cutting and squaring of blocks.</p>
                    
                    <div className="machinery-grid">
                    {mngBlocksData.map((item, index) => (
                        <div key={index} className="machinery-item">
                        <h2>{item.title}</h2>
                        <Swiper
                        loop={true} // Enable infinite loop
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        
                        modules={[Pagination]}
                        className="machinery-slider"
                        lazy={true}
                        >
                        {item.images.map((image, i) => (
                            <SwiperSlide key={i}>
                            <img src={image} alt={`${item.title} ${i + 1}`} className="swiper-lazy"/>
                            <div className="swiper-lazy-preloader"></div>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                        </div>

                        ))}
                    </div>
                    </div>
                    {/*SLABS SECTION*/}  
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE SLABS</h2>
                        <hr/>
                    </div>
                    <p>Our advanced machinery ensures precision cutting and squaring of blocks.</p>
                    
                    <div className="machinery-grid">
                    {mngSlabsData.map((item, index) => (
                        <div key={index} className="machinery-item">
                        <h2>{item.title}</h2>
                        <Swiper
                        loop={true} // Enable infinite loop
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        
                        modules={[Pagination]}
                        className="machinery-slider"
                        lazy={true}
                        >
                        {item.images.map((image, i) => (
                            <SwiperSlide key={i}>
                            <img src={image} alt={`${item.title} ${i + 1}`} className="swiper-lazy"/>
                            <div className="swiper-lazy-preloader"></div>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                        </div>

                        ))}
                    </div>
                    </div>
                    {/*TILES SECTION*/} 
                    <div className="machinery-section">
                    <div className="machinery-section-title">
                        <h2>MARBLE & GRANITE TILES</h2>
                        <hr/>
                    </div>

                    <p>Our advanced machinery ensures precision cutting and squaring of blocks.</p>
                    
                    <div className="machinery-grid">
                    {mngTilesData.map((item, index) => (
                        <div key={index} className="machinery-item">
                        <h2>{item.title}</h2>
                        <Swiper
                        loop={true} // Enable infinite loop
                        pagination={{ clickable: true }}
                        slidesPerView={1}
                        
                        modules={[Pagination]}
                        className="machinery-slider"
                        lazy={true}
                        >
                        {item.images.map((image, i) => (
                            <SwiperSlide key={i}>
                            <img src={image} alt={`${item.title} ${i + 1}`} className="swiper-lazy"/>
                            <div className="swiper-lazy-preloader"></div>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                        </div>

                        ))}
                    </div>
                    </div>
                    <ContactBubble />

            </div>    
            )
}