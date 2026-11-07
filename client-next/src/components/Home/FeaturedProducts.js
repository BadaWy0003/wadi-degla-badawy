'use client';
import React, { useState, useEffect, useRef } from "react";
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import "./FeaturedProducts.css"
import { useTranslation } from 'react-i18next';
import { getApiClient } from "../../util/api-lazy.js";
import { useNearScreen, useLazyComponent } from '../../util/near-screen';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";
import { productSlug } from '../../util/product-slugs';
import LangLink from '../LangLink';



const loadFeaturedCube = () => import('./FeaturedCube');

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
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

  // The products and the slider code load only when the section comes near the screen.
  const sectionRef = useRef(null);
  const near = useNearScreen(sectionRef);
  const FeaturedCube = useLazyComponent(near, loadFeaturedCube);

  useEffect(() => {
    if (near) fetchFeaturedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near]);

  const fetchFeaturedProducts = async () => {
    try {
      const apiClient = await getApiClient();
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
              img.src = selected.thumb || selected.link;
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
    <section className="featured-products-section" ref={sectionRef}>
      <h2>{t('home.featuredProducts')}</h2>
      <p>{t('home.featuredProductsDesc')}</p>
      <div className="featured-content-wrapper">
        {loading || !FeaturedCube ? ( <LoadingSpinner />
        ):(
        <FeaturedCube featuredProducts={featuredProducts} setActiveProduct={setActiveProduct} />
        )}
        <div className="product-info-panel">
          {activeProduct && (
            <>
              <h3>{activeProduct.name}</h3>
              <p>{activeProduct.type}</p>
              <LangLink href={`/products/${productSlug(activeProduct.name)}`} className="btn-link">
                <button type="button" className="btn2">
                  {t('home.moreDetails')}
                </button>
              </LangLink>
            </>
          )}
        </div>
      </div>

      <div className="swiper-custom-navigation">
        <div className="swiper-custom-button-prev">‹</div>
        <div className="swiper-custom-pagination"></div>
        <div className="swiper-custom-button-next">›</div>
      </div>  
      
      <LangLink href="/products" className="btn-link">
        <button type="button" className="btn1" style={{marginTop: "2rem"}}>
          {t('home.exploreAllProducts')}
        </button>
      </LangLink>                     
    </section>
  );
}