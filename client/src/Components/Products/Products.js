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
import Product from '../Home/Product.js';
import { productData } from './productData.js'; // Import the product data
import bullseye_gold from '../Assets/Icons/bullseye-gold.svg'
import paper_plane_gold from '../Assets/Icons/paper-plane-gold.svg'




export default function Products () {

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null); // To track the selected product
    const [isModalOpen, setIsModalOpen] = useState(false); // To track modal visibility



    

            // Filter products based on selected category
        const filteredProducts = selectedCategory === 'All'
        ? productData
        : productData.filter(item => item.category === selectedCategory);

       

          // Function to handle opening the modal
        const openModal = (product) => {
          setSelectedProduct(product);
          setIsModalOpen(true);
        };

        // Function to close the modal
        const closeModal = () => {
          setSelectedProduct(null);
          setIsModalOpen(false);
        };
        function Modal({ product, onClose }) {
          // Set "Polished" as the default finish to display
          const [selectedFinish, setSelectedFinish] = useState(
            product.finish.find(finish => finish.finishName === 'Polished')
          );
        
          return (
            <div className="modal-overlay" onClick={onClose}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="modal-close" onClick={onClose}>&times;</span>
                
                {/* Display the image and details of the selected finish */}
                <img src={selectedFinish.imageUrl} alt={product.name} />
                <h2>{product.name}</h2>
                <p>Category: {product.category}</p>
                <p>Finish: {selectedFinish.finishName}</p>
        
                {/* Allow the user to switch between available finishes */}
                <div className="finish-selector">
                  {product.finish.map(finish => (
                    <button 
                      key={finish.finishName} 
                      className={finish.finishName === selectedFinish.finishName ? 'active' : ''}
                      onClick={() => setSelectedFinish(finish)}
                    >
                      {finish.finishName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        }


    return(
        <div className='products-container'>
                <div className="products-hero">
                        <div className="products-hero-bg"></div>
                            <h1>products</h1>
                    </div>
                    <div className="products-categories">
                    <button className="btn2" onClick={() => setSelectedCategory('All')}>All</button>    
                    <button className="btn2" onClick={() => setSelectedCategory('Imported Marble')}>Imported Marble</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Egyptian Marble')}>Egyptian Marble</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Imported Granite')}>Imported Granite</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Egyptian Granite')}>Egyptian Granite</button>
                    </div>      

                    <div className="category-title-and-product-cards">
                        <div className="category-title">
                            <p>Select from the categories above to change the products showing on page</p>
                            <h1>{selectedCategory}</h1>
                        </div>
                        <div className="product-cards">
                        {filteredProducts.length > 0 ? (
            filteredProducts.map(item => (
              <Product 
                key={item.id}
                item={item}
                openModal={openModal}
              />
            ))
          ) : (
            <div className="no-products-message">
              <p>No products available in this category.</p>
            </div>
          )}
                        </div>
                    </div>          

                    {/* Modal for showing product details */}
      {isModalOpen && selectedProduct && (
        <Modal product={selectedProduct} onClose={closeModal} />
      )}
            <div className="products-categories">
                    <button className="btn2" onClick={() => setSelectedCategory('All')}>All</button>    
                    <button className="btn2" onClick={() => setSelectedCategory('Imported Marble')}>Imported Marble</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Egyptian Marble')}>Egyptian Marble</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Imported Granite')}>Imported Granite</button>
                    <button className="btn2" onClick={() => setSelectedCategory('Egyptian Granite')}>Egyptian Granite</button>
                    </div>   
            </div>  
                
    )
}

