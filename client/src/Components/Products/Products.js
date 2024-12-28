import React, { useState } from 'react';
import './Products.css';
import hero_bg from '../../Public/Assets/Media/hero-bg.jpg';
import Product from './Product'; // Updated Product component
import Modal from './Modal'; // Existing Modal component
import { productData } from './productData.js'; // Product data

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState('Imported Marble'); // Default to "All"
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the modal product
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open/close

  // Function to open the modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

// Filter products based on selected category and search query
const filteredProducts = productData.filter(item => {
  const isCategoryMatch = item.category === selectedCategory;
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
          <button
            className={`btn2 ${selectedCategory === 'Imported Marble' ? 'active-2' : ''}`}
            onClick={() => setSelectedCategory('Imported Marble')}
          >
            Imported Marble
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Egyptian Marble' ? 'active-2' : ''}`}
            onClick={() => setSelectedCategory('Egyptian Marble')}
          >
            Egyptian Marble
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Imported Granite' ? 'active-2' : ''}`}
            onClick={() => setSelectedCategory('Imported Granite')}
          >
            Imported Granite
          </button>
          <button
            className={`btn2 ${selectedCategory === 'Egyptian Granite' ? 'active-2' : ''}`}
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
          className="search-bar-2"
        />
      </div>

      {/* Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="product-cards-container-2">
          <div className="product-cards-2">
            {filteredProducts.map(item => (
              <Product 
                key={item.id}
                item={item}
                openModal={openModal}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-products-message-2">
          <p>
            {selectedCategory === "Imported Granite"
              ? `${selectedCategory} Coming soon.`
              : `No products available for your search in ${selectedCategory}.`}
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
}
