import React, { useState } from 'react';
import '../Home/Home.css';
import Galala from '../Assets/Media/Products/Galala.png'
import Sunny_Menia from '../Assets/Media/Products/Sunny-Menia.png'
import Selvia_Menia from '../Assets/Media/Products/Selvia-Menia.png'
import Felitto from '../Assets/Media/Products/Felitto.png'


export default function ProductForVisualizer({ item, onClick }) {
  // Find the "Polished" finish to display by default
  const polishedFinish = item.finish.find(finish => finish.finishName === 'Polished');
  
    return (
      <div className="product-card" onClick={onClick}>
        <div className='img-div'>
        <img src={polishedFinish.imageUrl} alt={item.name} />
        </div>
        <h3>{item.name}</h3>
        
      </div>
    );
  }
  