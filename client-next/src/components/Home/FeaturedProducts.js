'use client';
import React, { useState, useEffect } from "react";
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import "./FeaturedProducts.css"
import { useTranslation } from 'react-i18next';
import { finishLabel } from '../../util/finishes';
import apiClient from "../../util/client.js";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCube, Autoplay, Pagination, Navigation } from 'swiper/modules';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { productSlug } from '../../util/product-slugs';



export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const router = useRouter();
  const lang = useLang();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

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
  
        // Wait for all images to load
        const imageLoadPromises = featured.map((item) => {
          const honed = item.finishes.find(f => f.finish === "Honed");
          const polished = item.finishes.find(f => f.finish === "Polished");
          const selected = honed || polished;
          if (selected?.link) {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = selected.link;
              img.onload = resolve;
              img.onerror = resolve;
            });
          } else {
            return Promise.resolve();
          }
        });
  
        await Promise.all(imageLoadPromises);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return(
    <section className="featured-products-section">
      <h2>{t('home.featuredProducts')}</h2>
      <p>{t('home.featuredProductsDesc')}</p>
      <div className="featured-content-wrapper">
        {loading? ( <LoadingSpinner />
        ):(
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
            delay: 3000,
            disableOnInteraction: true,
          }}
          className="featured-cube-swiper"
          onSlideChange={(swiper) => {
            const realIndex = swiper.realIndex;
            setActiveProduct(featuredProducts[realIndex]);
          }}
          onInit={(swiper) => {
            setActiveProduct(featuredProducts[0]);
          }}
        >
          {featuredProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="featured-cube-slide">
              {(() => {
                const honedFinish = item.finishes.find(finish => finish.finish === 'Honed');
                const polishedFinish = item.finishes.find(finish => finish.finish === 'Polished');
                const selectedFinish = honedFinish || polishedFinish; // Use "Honed" if available, otherwise "Polished"

                return selectedFinish ? (
                  <img loading="lazy" 
                    src={selectedFinish.link} 
                    alt={`${item.name} - ${finishLabel(t, selectedFinish.finish)}`} 
                  />
                ) : null;
              })()}

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        )}
        <div className="product-info-panel">
          {activeProduct && (
            <>
              <h3>{activeProduct.name}</h3>
              <p>{activeProduct.type}</p>
              <button 
                className="btn2"
                onClick={() => {
                  const urlName = productSlug(activeProduct.name);
                  router.push(`/${lang}/products/${urlName}`);
                  window.scrollTo({top: 0});
                }}
              >
                {t('home.moreDetails')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="swiper-custom-navigation">
        <div className="swiper-custom-button-prev">‹</div>
        <div className="swiper-custom-pagination"></div>
        <div className="swiper-custom-button-next">›</div>
      </div>  
      
      <button
        className="btn1"
        style={{marginTop: "2rem"}}
        onClick={() => {
          router.push(`/${lang}/products`);
          window.scrollTo({top: 0});
        }}
      >
        {t('home.exploreAllProducts')}
      </button>                     
    </section>
  );
}