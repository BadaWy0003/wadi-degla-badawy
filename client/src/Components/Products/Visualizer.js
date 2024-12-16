import React, { useState, useRef  } from 'react';
import './Products.css';
import { Link } from "react-router-dom";
import hero_bg from '../Assets/Media/hero-bg.jpg';
import ProductForVisualizer from './ProductForVisualizer.js';
import { productData } from './productData.js'; // Import the product data

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState('Imported Marble');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const indoorRef = useRef(null); // Ref for the indoor section
  const outdoorRef = useRef(null); // Ref for the outdoor section
 


  // Filter products based on selected category and search query
  const filteredProducts = productData.filter(item => {
    const isCategoryMatch = item.category === selectedCategory || selectedCategory === 'All';
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

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

  // Scroll to the outdoor section
  const scrollToindoor = () => {
    if (indoorRef.current) {
      indoorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

   // Scroll to the outdoor section
   const scrollToOutdoor = () => {
    if (outdoorRef.current) {
      outdoorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
 // Check if there are outdoor products for the selected category
 const hasOutdoorProducts = outdoorProducts.length > 0;
 const hasIndoorProducts = indoorProducts.length > 0;
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
                  <button 
                  className={`btn2 ${selectedCategory === 'Imported Marble' ? 'active' : ''}`} 
                  onClick={() => setSelectedCategory('Imported Marble')}>
                      Imported Marble
                  </button>
                  <button 
                  className={`btn2 ${selectedCategory === 'Egyptian Marble' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('Egyptian Marble')}>
                      Egyptian Marble
                  </button>
                  <button 
                  className={`btn2 ${selectedCategory === 'Imported Granite' ? 'active' : ''}`} 
                  onClick={() => setSelectedCategory('Imported Granite')}>
                      Imported Granite
                  </button>
                  <button 
                  className={`btn2 ${selectedCategory === 'Egyptian Granite' ? 'active' : ''}`} 
                  onClick={() => setSelectedCategory('Egyptian Granite')}>
                      Egyptian Granite
                  </button>
              </div>
                  

              <h1>{selectedCategory}</h1>
              
              <input 
                  type="text" 
                  placeholder={`Search inside ${selectedCategory} ...`} 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="search-bar"
              />
              {/* Scroll to Outdoor category link */}
              {window.innerWidth < 768 && hasOutdoorProducts && (
                <a onClick={scrollToOutdoor} className="scroll-to-outdoor-btn">
                    Scroll to Outdoor ↓
                </a>
              )}
          </div>

          {filteredProducts.length > 0 ? (
              <>
                  {/* Check if the category has outdoor products */}
                  {outdoorProducts.length > 0 ? (
                      <div className='products-page'>
                          <div className="category-title-and-product-cards" ref={indoorRef}>
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
                                  {/* Scroll to Outdoor category link */}
                                    {window.innerWidth < 768 && hasIndoorProducts && (
                                        <a onClick={scrollToindoor} className="scroll-to-outdoor-btn">
                                            Scroll to Indoor ↑
                                        </a>
                                    )}
                          <div className="category-title-and-product-cards" ref={outdoorRef}>
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
                      <div className="category-title-and-product-cards-2">
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
          ) : selectedCategory === "Imported Granite"?(<div className="no-products-message">
            <p>{selectedCategory} Coming soon.</p>
        </div>):(
              <div className="no-products-message">
                  <p>No products available for your search in {selectedCategory}.</p>
              </div>
          )}
      </div>
  );
}
