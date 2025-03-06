import React, { useState, useEffect } from "react";
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import "./Home.css"
import { useNavigate } from "react-router-dom";
import apiClient from "../../util/client.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Autoplay, Pagination, Navigation } from 'swiper/modules';



export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  const featuredNames = [
    "Creamy White Pearl",
    "Pietra Grey",
    "Sunny Light",
    "Calacatta Italy",
    "Arabescato",
    "Triesta Beige",
    "New Halayeb",
    "Red Aswan"
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await apiClient.get('/api/storage/all');
      if (data.data) {
        const featured = data.data.filter(product => 
          featuredNames.includes(product.name)
        );
        setFeaturedProducts(featured);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

    return(
        <section className="featured-products-section">
            <h2>Featured Products</h2>
            <p>Discover our most popular selections</p>
            <Swiper
            effect={'cube'}
            grabCursor={true}
            loop={true}
            cubeEffect={{
                shadow: true,
                slideShadows: true,
                shadowOffset: 20,
                shadowScale: 0.94,
            }}
            pagination={{
                clickable: true,
                el: '.swiper-custom-pagination'
            }}
            navigation={{
                nextEl: '.swiper-custom-button-next',
                prevEl: '.swiper-custom-button-prev'
            }}
            modules={[EffectCube, Pagination, Navigation, Autoplay]}
                autoplay={{
                delay: 5000,
                disableOnInteraction: true,
                }}
            className="featured-cube-swiper"
            >
            {featuredProducts.map((item) => (
                <SwiperSlide key={item.id}>
                <div className="featured-cube-slide">
                    {item.finishes.find(finish => finish.finish === 'Polished') && (
                    <img 
                        src={item.finishes.find(finish => finish.finish === 'Polished').link} 
                        alt={item.name} 
                    />
                    )}
                    <div className="slide-overlay">
                    <h3>{item.name}</h3>
                    <p>{item.type}</p>
                    <button 
                        className="btn2"
                        onClick={() => {
                        navigate(`/products/${item.id}`);
                        window.scrollTo({top: 0});
                        }}
                    >
                        More Details
                    </button>
                    </div>
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
            <div className="swiper-custom-navigation">
            <div className="swiper-custom-button-prev">‹</div>
            <div className="swiper-custom-pagination"></div>
            <div className="swiper-custom-button-next">›</div>
            </div>  
            <button
            className="btn1"
            style={{marginTop: "5rem"}}
            onClick={() => {
                navigate('/products');
                window.scrollTo({top: 0});
            }}>EXPLORE ALL OUR PRODUCTS</button>                     
        </section>
        
    );
}