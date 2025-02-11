import React from "react";
import './Machinery.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


import image3 from '../../Public/Assets/Media/3.jpg';
import image21 from '../../Public/Assets/Media/21.jpg';
import image24 from '../../Public/Assets/Media/24.jpg';
// import layer2svg from '../../Public/Assets/Media/Layer-2.svg';
// import layer2png from '../../Public/Assets/Media/Layer-2.png';



export default function Machinery(){

    const generalUseData = [
        {
          title: "3 Water treatment plants",
          images: [image3, image21, image24],
        },
        {
          title: "2 Forklifts",
          images: [ image21,image3,image24],
        },
        {
          title: "3 Air compressors",
          images: [image24,image21,image3],
        }

      ];
      const mngBlocksData = [
        {
          title: "9 Gangsaws",
          images: [ image21,image3,image24],
        },
        {
          title: "4 Big bridge cutters",
          images: [image3, image21, image24],
        },
        {
          title: "6 Monofilos",
          images: [image24,image21,image3],
        }

      ];
      const mngSlabsData = [
        {
          title: "3 polishing lines",
          images: [image24,image21,image3],
        },
        {
          title: "1 risin treating line",
          images: [ image21,image3,image24],
        }
      ];

      const mngTilesData = [
        {
          title: "5 Slabs bridge cutters",
          images: [image3, image21, image24],
        },
        {
          title: "1 Tumbling machine",
          images: [image24,image21,image3],
        },
        {
          title: "3 Splitting strips machines",
          images: [ image21,image3,image24],
        }

      ];
    
    
    
    return(
        <div className='machinery-container'>
            <div className="machinery-hero">
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
                        navigation
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
                        navigation
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
                        navigation
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
                        navigation
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