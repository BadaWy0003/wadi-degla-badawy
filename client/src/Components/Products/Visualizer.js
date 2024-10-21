import React, { useState } from 'react';
import './Products.css';
import { Link } from "react-router-dom";
import hero_bg from '../Assets/Media/hero-bg.jpg';
import home_bg from '../Assets/Media/home-bg2.jpg'
import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import company_logo from '../Assets/Icons/partners/company-logo.png'
// import products_bg from '../Assets/Media/Products/32.jpg'
import ProductForVisualizer from './ProductForVisualizer.js';
import { productData } from './productData.js'; // Import the product data
import bullseye_gold from '../Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../Assets/Icons/paper-plane-gold.svg'


export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState('Imported Marble');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All'
      ? productData
      : productData.filter(item => item.category === selectedCategory);

  // Separate products based on mockup availability for indoor and outdoor
  const indoorProducts = filteredProducts.filter(item => item.mockup);
  const outdoorProducts = filteredProducts.filter(item => item.mockupOutdoor);

  // Function to handle product click and set the correct image
  const handleProductClick = (item, type) => {
      setSelectedProduct({
          ...item,
          currentMockup: type === 'indoor' ? item.mockup : item.mockupOutdoor
      });
      // Scroll back to the top of the page when a product is clicked
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className='products-container'>
          <div className="products-hero">
              <div className="products-hero-bg" 
                  style={{ 
                      backgroundImage: selectedProduct 
                          ? `url(${selectedProduct.currentMockup})`
                          : `url(${hero_bg})`
                  }}
              ></div>
              <h1>{selectedProduct ? selectedProduct.name : "Visualizer"}</h1>
          </div>
         <div className='products-categories-and-title'>
            <div className="products-categories">
                <button className="btn2" onClick={() => setSelectedCategory('Imported Marble')}>Imported Marble</button>
                <button className="btn2" onClick={() => setSelectedCategory('Egyptian Marble')}>Egyptian Marble</button>
                <button className="btn2" onClick={() => setSelectedCategory('Imported Granite')}>Imported Granite</button>
                <button className="btn2" onClick={() => setSelectedCategory('Egyptian Granite')}>Egyptian Granite</button>
            </div> 
            <h1>{selectedCategory}</h1>

          </div>

          {filteredProducts.length > 0 ? (
              <>
                  {/* Check if the category has outdoor products */}
                  {outdoorProducts.length > 0 ? (
                      <div className='products-page'>
                          <div className="category-title-and-product-cards">
                              <h2>Indoor</h2>
                              <div className="product-cards">
                                  {indoorProducts.map(item => (
                                      <ProductForVisualizer 
                                          key={item.id}
                                          item={item}
                                          onClick={() => handleProductClick(item, 'indoor')}
                                      />
                                  ))}
                              </div>
                          </div>

                          <div className="category-title-and-product-cards">
                              <h2>Outdoor</h2>
                              <div className="product-cards">
                                  {outdoorProducts.map(item => (
                                      <ProductForVisualizer 
                                          key={item.id}
                                          item={item}
                                          onClick={() => handleProductClick(item, 'outdoor')}
                                      />
                                  ))}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="category-title-and-product-cards">
                          <div className="product-cards">
                              {indoorProducts.map(item => (
                                  <ProductForVisualizer 
                                      key={item.id}
                                      item={item}
                                      onClick={() => handleProductClick(item, 'indoor')}
                                  />
                              ))}
                          </div>
                      </div>
                  )}
              </>
          ) : (
              <div className="no-products-message">
                  <p>No products available in this category.</p>
              </div>
          )}
      </div>
  );
}