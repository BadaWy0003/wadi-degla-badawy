import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productData } from './productData';
import block from '../../Public/Assets/Icons/product-icons/block.svg';
import exterior_cladding from '../../Public/Assets/Icons/product-icons/exterior-cladding.svg';
import landscaping from '../../Public/Assets/Icons/product-icons/landscaping.svg';
import slabs from '../../Public/Assets/Icons/product-icons/slabs.svg';
import staircase from '../../Public/Assets/Icons/product-icons/staircase.svg';
import wall_cladding from '../../Public/Assets/Icons/product-icons/wall-cladding.svg';
import windowsills from '../../Public/Assets/Icons/product-icons/windowsills.svg';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // Find the product from productData
  const product = productData.find(p => p.id === parseInt(productId));
  
  // Set default finish
  const [selectedFinish, setSelectedFinish] = useState(
    product?.finish.find(finish => finish.finishName === 'Polished') || product?.finish[0]
  );

  const applicationIcons = [
    { src: block, name: "Block" },
    { src: exterior_cladding, name: "Exterior Cladding" },
    { src: landscaping, name: "Landscaping" },
    { src: slabs, name: "Slabs" },
    { src: staircase, name: "Staircase" },
    { src: wall_cladding, name: "Wall Cladding" },
    { src: windowsills, name: "Window Sills" },
  ];

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <p>{'>'} Explore</p>
        <a href="/products">{'>'} Products</a>
        <p>{'>'} {product.name}</p>
      </div>

      <div className="product-details-container">
        <div className="details-left">
          <img
            src={selectedFinish.imageUrl}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="details-right">
          <h1 className="details-title">{product.name}</h1>
          
          <div className="info-grid">
            <div className="info-label">Category:</div>
            <div className="info-value" style={{color: 'var(--blueColor)'}}>
              {product.category}
            </div>
            
            <div className="info-label">Finish:</div>
            <div className="info-value">
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
          </div>

          <div className="applications-section">
            <h3>Applications</h3>
            <div className="applications-grid">
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

          <button 
            className="btn1" 
            onClick={() => navigate('/contact')}
            style={{width: '100%', marginTop: '2rem'}}
          >
            Request a Sample
          </button>
        </div>
      </div>
    </div>
  );
}
