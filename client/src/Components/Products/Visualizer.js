import React, { useState, useRef } from 'react';
import './Products.css';
import { Link } from "react-router-dom";
import hero_bg from '../Assets/Media/hero-bg.jpg';
import ProductForVisualizer from './ProductForVisualizer.js';
import { productData } from './productData.js'; // Import the product data

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState('Imported Marble');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [showIndoor, setShowIndoor] = useState(true); // Toggle for indoor
  const [showOutdoor, setShowOutdoor] = useState(true); // Toggle for outdoor
  const indoorRef = useRef(null);
  const outdoorRef = useRef(null);

  // Filter products based on selected category and search query
  const filteredProducts = productData.filter(item => {
    const isCategoryMatch = item.category === selectedCategory;
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  // Separate indoor and outdoor products for the selected category
  const indoorProducts = filteredProducts.filter(item => item.mockup);
  const outdoorProducts = filteredProducts.filter(item => item.mockupOutdoor);

  // Apply toggle logic ONLY to the selected category
  const visibleIndoorProducts = showIndoor ? indoorProducts : [];
  const visibleOutdoorProducts = showOutdoor ? outdoorProducts : [];

  // Scroll to the outdoor section
const scrollToOutdoor = () => {
    if (outdoorRef.current) {
      outdoorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to the indoor section
const scrollToIndoor = () => {
    if (indoorRef.current) {
      indoorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };  

  // Check for product availability in current category
  const hasIndoorProducts = indoorProducts.length > 0;
  const hasOutdoorProducts = outdoorProducts.length > 0;

  const handleProductClick = (item, type) => {
    setSelectedProduct({
      ...item,
      currentMockup: type === 'indoor' ? item.mockup : item.mockupOutdoor
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='products-container'>
      <div className="products-hero">
        <div
          className="products-hero-bg"
          style={{
            backgroundImage: selectedProduct
              ? `url(${selectedProduct.currentMockup})`
              : `url(${hero_bg})`
          }}
        ></div>
        <h1>{selectedProduct ? selectedProduct.name : "Visualizer"}</h1>
        {!selectedProduct && <p className='hero-hint'>Select a product from below and it will show here</p>}
      </div>

      <div className='products-categories-and-title'>
        <div className="products-categories">
          <button
            className={`btn2 ${selectedCategory === 'Imported Marble' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Imported Marble')}
          >
            Imported Marble
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Egyptian Marble' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Egyptian Marble')}
          >
            Egyptian Marble
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Imported Granite' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Imported Granite')}
          >
            Imported Granite
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Egyptian Granite' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Egyptian Granite')}
          >
            Egyptian Granite
          </button>
        </div>

        <h1>{selectedCategory}</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder={`Search inside ${selectedCategory} ...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {/* Toggle Buttons */}
        {(hasIndoorProducts || hasOutdoorProducts) && (
          <div className="toggle-buttons">
            {hasIndoorProducts && (
              <button
                className={`btn2 ${showIndoor ? 'active' : ''}`}
                onClick={() => setShowIndoor(!showIndoor)}
              >
                {showIndoor ? 'Hide Indoor' : 'Show Indoor'}
              </button>
            )}
            {hasOutdoorProducts && (
              <button
                className={`btn2 ${showOutdoor ? 'active' : ''}`}
                onClick={() => setShowOutdoor(!showOutdoor)}
              >
                {showOutdoor ? 'Hide Outdoor' : 'Show Outdoor'}
              </button>
            )}
          </div>
        )}
      </div>
            

      {filteredProducts.length > 0 ? (
        <div className="products-page">
            {/*Scroll to outdoor only shows on mobile screens*/}
            {window.innerWidth < 768 && showIndoor && showOutdoor && (
            <a onClick={scrollToOutdoor} className="scroll-to-outdoor-btn">
                Scroll to Outdoor ↓
            </a>
            )}
          {/* Show message if both toggles are off */}
          {!showIndoor && !showOutdoor && (
            <div className="no-sections-message">
              <p>Please select from the buttons above to view the indoor and outdoor sections.</p>
            </div>
          )}

          {/* Indoor Section */}
          {showIndoor && visibleIndoorProducts.length > 0 && (
            <div
              className={
                hasOutdoorProducts
                  ? "category-title-and-product-cards"
                  : "category-title-and-product-cards-2"
              }
              ref={indoorRef}
            >
              {hasOutdoorProducts && <h2>Indoor</h2>}
              <div className="product-cards">
                {visibleIndoorProducts.map(item => (
                  <ProductForVisualizer
                    key={item.id}
                    item={item}
                    onClick={() => handleProductClick(item, 'indoor')}
                  />
                ))}
              </div>
            </div>
          )}
            {/* Scroll to Indoor category link */}
            {window.innerWidth < 768 && showIndoor && showOutdoor && (
            <a onClick={scrollToIndoor} className="scroll-to-indoor-btn">
                Scroll to Indoor ↑
            </a>
            )}

          {/* Outdoor Section */}
          {showOutdoor && visibleOutdoorProducts.length > 0 && (
            <div className="category-title-and-product-cards" ref={outdoorRef}>
              <h2>Outdoor</h2>
              <div className="product-cards">
                {visibleOutdoorProducts.map(item => (
                  <ProductForVisualizer
                    key={item.id}
                    item={item}
                    onClick={() => handleProductClick(item, 'outdoor')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-products-message">
          <p>
            {selectedCategory === "Imported Granite"
              ? `${selectedCategory} Coming soon.`
              : `No products available for your search in ${selectedCategory}.`}
          </p>
        </div>
      )}
    </div>
  );
}
