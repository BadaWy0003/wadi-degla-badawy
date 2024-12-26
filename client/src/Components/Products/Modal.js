import React, { useState } from 'react';
import './Products.css'; // Updated CSS for styling the modal
import { useNavigate } from 'react-router-dom';


export default function Modal({ product, onClose }) {
  // Set "Polished" as the default finish
  const [selectedFinish, setSelectedFinish] = useState(
    product.finish.find(finish => finish.finishName === 'Polished') || product.finish[0]
  );
    const navigate = useNavigate();
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-custom" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <span className="modal-close" onClick={onClose}>&times;</span>

        {/* Left Section - Image */}
        <div className="modal-left">
          <img
            src={selectedFinish.imageUrl}
            alt={product.name}
            className="modal-product-image"
          />
        </div>

        {/* Right Section - Information */}
        <div className="modal-right">
          <h3 className="modal-title">Product Information</h3>
          <div className='div-flex'>
          <div className="modal-info-grid">
            <div className="modal-info-label">Name:</div>
            <div className="modal-info-value">{product.name}</div>
            
            <div className="modal-info-label">Finish:</div>
            <div className="modal-info-value">
              <select
                className="modal-select"
                value={selectedFinish.finishName}
                onChange={(e) =>
                  setSelectedFinish(
                    product.finish.find(finish => finish.finishName === e.target.value)
                  )
                }
              >
                {product.finish.map(finish => (
                  <option key={finish.finishName} value={finish.finishName}>
                    {finish.finishName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="modal-info-label">Category:</div>
            <div className="modal-info-value" id='modal-info-category-value'>{product.category}</div>
          </div>
          
          <div>
            <p>Application:</p>
            <div className="modal-applications">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="application-icon"></div>
              ))}
            </div>
          </div>
          </div>
          <button className="btn1" onClick={() => {
                             navigate('/contact'); // Redirect to the homepage
                                window.scrollTo({top: 0})
                             }}>Request a Sample</button>
        </div>
      </div>
    </div>
  );
}
