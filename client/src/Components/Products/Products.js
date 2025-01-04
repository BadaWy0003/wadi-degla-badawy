import React, { useState, useEffect } from 'react';
import './Products.css';
import hero_bg from '../../Public/Assets/Media/hero-bg.jpg';
import Product from './Product'; // Updated Product component
// Remove Modal import

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState('Egyptian Marble');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/storage/all");
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category and search query
  const filteredProducts = data.filter(item => {
    const isCategoryMatch = item.type === selectedCategory;
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <div className='products-container-2'>
      {/* Hero Section */}
      <div className="products-hero-2">
        <div
          className="products-hero-bg-2"
          style={{ backgroundImage: `url(${hero_bg})` }}
        ></div>
        <h1>Products</h1>
        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p className='sub-breadcrumb'>{'>'} Explore</p>
                        <p>{'>'} Products </p>
                    </div>

        <p className='hero-hint-2'>Select a product from below to view its details.</p>
      </div>

      {/* Categories and Search */}
      <div className='products-categories-and-title-2'>
        <div className="products-categories-2">
          {['Egyptian Marble', 'Imported Marble', 'Egyptian Granite', 'Imported Granite'].map(category => (
            <button
              key={category}
              className={`btn2 ${selectedCategory === category ? 'active-2' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <h1>{selectedCategory}</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder={`Search inside ${selectedCategory} ...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-bar-2"
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="product-cards-container-2">
              <div className="product-cards-2">
                {filteredProducts.map(item => (
                  <Product 
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-products-message-2">
              <p>No products available for your search in {selectedCategory}.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
