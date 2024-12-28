import React, { useState } from 'react';
import './Products.css'; // Updated CSS for styling the modal
import { useNavigate } from 'react-router-dom';

import block from '../../Public/Assets/Icons/product-icons/block.svg';
import exterior_cladding from '../../Public/Assets/Icons/product-icons/exterior-cladding.svg';
import landscaping from '../../Public/Assets/Icons/product-icons/landscaping.svg';
import slabs from '../../Public/Assets/Icons/product-icons/slabs.svg';
import staircase from '../../Public/Assets/Icons/product-icons/staircase.svg';
import wall_cladding from '../../Public/Assets/Icons/product-icons/wall-cladding.svg';
import windowsills from '../../Public/Assets/Icons/product-icons/windowsills.svg';



export default function Modal({ product, onClose }) {
  // Set "Polished" as the default finish
  const [selectedFinish, setSelectedFinish] = useState(
    product.finish.find(finish => finish.finishName === 'Polished') || product.finish[0]
  );
    const navigate = useNavigate();
    const applicationIcons = [
      { src: block, name: "Block" },
      { src: exterior_cladding, name: "Exterior Cladding" },
      { src: landscaping, name: "Landscaping" },
      { src: slabs, name: "Slabs" },
      { src: staircase, name: "Staircase" },
      { src: wall_cladding, name: "Wall Cladding" },
      { src: windowsills, name: "Window Sills" },
    ];
    
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
              {applicationIcons.map((app, index) => (
                <div key={index} className="application-icon-wrapper">
                  <img
                    src={app.src}
                    alt={app.name}
                    className="application-icon"
                  />
                  <div className="hover-name">{app.name}</div>
                </div>
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
