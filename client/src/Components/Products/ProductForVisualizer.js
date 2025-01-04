import React from 'react';
import '../Home/Home.css';

export default function ProductForVisualizer({ item, onClick }) {
  // Find the "Polished" finish to display by default
  const polishedFinish = item.finishes.find(finish => finish.finish === 'Polished') || item.finishes[0];
  
  return (
    <div className="product-card" onClick={onClick}>
      <div className='img-div'>
        <img src={polishedFinish.link} alt={item.name} />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}
