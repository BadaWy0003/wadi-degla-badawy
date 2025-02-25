import React from "react";
import './Machinery.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


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
import big_bridge_cutter_1 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-1.jpeg';
import big_bridge_cutter_2 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-2.jpeg';
import big_bridge_cutter_3 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-3.jpeg';
import big_bridge_cutter_4 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-4.jpeg';
import big_bridge_cutter_5 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-5.jpeg';
import big_bridge_cutter_6 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-6.jpeg';
import big_bridge_cutter_7 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-7.jpeg';
import big_bridge_cutter_8 from '../../Public/Assets/Media/Machinery/big-bridge-cutter-8.jpeg';
import monofilos from '../../Public/Assets/Media/Machinery/monofilos.jpeg';
import risin_line_1 from '../../Public/Assets/Media/Machinery/risin-line-1.jpeg';
import risin_line_2 from '../../Public/Assets/Media/Machinery/risin-line-2.jpeg';
import risin_line_3 from '../../Public/Assets/Media/Machinery/risin-line-3.jpeg';
import splitting_strips from '../../Public/Assets/Media/Machinery/splitting-strips.jpeg';
import tumble_machine from '../../Public/Assets/Media/Machinery/tumble-machine.jpeg';
import fork_lift from '../../Public/Assets/Media/Machinery/fork-lift.jpg';



export default function Machinery(){

    const generalUseData = [
        {
          title: "3 Water treatment plants",
          images: [water_treatment, water_treatment_2],
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
          images: [gangsaws, gangsaws_2],
        },
        {
          title: "4 Big bridge cutters",
          images: [big_bridge_cutter_1, big_bridge_cutter_2, big_bridge_cutter_3, big_bridge_cutter_4, big_bridge_cutter_5, big_bridge_cutter_6, big_bridge_cutter_7, big_bridge_cutter_8],
        },
        {
          title: "6 Monofilos",
          images: [monofilos],
        }

      ];
      const mngSlabsData = [
        {
          title: "3 polishing lines",
          images: [polishing_line, polishing_line_1, polishing_line_2, polishing_line_3],
        },
        {
          title: "1 risin treating line",
          images: [ risin_line_1, risin_line_2, risin_line_3],
        }
      ];

      const mngTilesData = [
        {
          title: "5 Slabs bridge cutters",
          images: [slabs_bridge_cutter, slabs_bridge_cutter_2, slabs_bridge_cutter_3, slabs_bridge_cutter_4],
        },
        {
          title: "1 Tumbling machine",
          images: [tumble_machine],
        },
        {
          title: "3 Splitting strips machines",
          images: [splitting_strips],
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
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum.</p>    
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
            
            </div>    
            )
}