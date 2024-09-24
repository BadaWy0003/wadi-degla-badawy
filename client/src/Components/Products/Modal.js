import React, { useState } from 'react';
import './Products.css';
import Product from '../Home/Product.js';
import { productData } from './productData.js'; // Import the product data

export default function Modal({ product, onClose }) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <span className="modal-close" onClick={onClose}>&times;</span>
          <img src={product.finish.imageUrl} alt={product.name} />
          <h2>{product.name}</h2>
          <p>Category: {product.category}</p>
          <p>Finish: {product.finish.finishName}</p>
          <p>Description: {product.description}</p>
        </div>
      </div>
    );
  }