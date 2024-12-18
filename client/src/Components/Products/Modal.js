import React, { useState } from 'react';
import './Visualizer.css';

export default function Modal({ product, onClose }) {
  // Set "Polished" as the default finish
  const [selectedFinish, setSelectedFinish] = useState(
    product.finish.find(finish => finish.finishName === 'Polished') || product.finish[0]
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        
        {/* Product Image */}
        <div className='modal-image-div'>
        <img src={selectedFinish.imageUrl} alt={product.name} className="modal-image" />
        </div>

        {/* Product Details */}
        <h2>{product.name}</h2>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Finish:</strong> {selectedFinish.finishName}</p>

        {/* Finish Selector */}
        <div className="finish-selector">
          <p>Select Finish:</p>
          <div className="finish-buttons">
            {product.finish.map(finish => (
              <button
                key={finish.finishName}
                className={`finish-btn ${selectedFinish.finishName === finish.finishName ? 'active' : ''}`}
                onClick={() => setSelectedFinish(finish)}
              >
                {finish.finishName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
