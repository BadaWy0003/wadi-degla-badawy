'use client';
import React from 'react';
import '../Home/Home.css';

export default function ProductForVisualizer({ item, onClick }) {
  // Prioritize "Honed", fallback to "Polished", and default to the first available finish
  const honedFinish = item.finishes?.find(finish => finish.finish === 'Honed');
  const polishedFinish = item.finishes?.find(finish => finish.finish === 'Polished');
  const selectedFinish = honedFinish || polishedFinish || item.finishes?.[0]; // Default to first available finish if both are missing
    
    // If no finish is available, do not render the product
    if (!selectedFinish) {
      return null;
    }
  
  
  return (
    <div className="product-card" onClick={onClick}>
      <div className='img-div'>
      <img loading="lazy" src={selectedFinish?.link} alt={`${item.name} - ${selectedFinish?.finish || 'Default'}`} />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}
