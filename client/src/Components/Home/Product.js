import React, { useState } from 'react';
import './Home.css';
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'



export default function Product({ item, openModal }) {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div 
        className="product-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openModal && openModal(item)} // Only trigger modal if openModal is passed
        >
        {isHovered ? (
          <div className="hover-content">
            <h3>{item.name}</h3>
            <p>Category: {item.category}</p>
            <p>Finish: {item.finish.finishName}</p>
          </div>
        ) : (
          <img src={item.finish.imageUrl} alt={item.name} />
        )}
      </div>
    );
  }
  