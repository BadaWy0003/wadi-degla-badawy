import React, { useState } from 'react';
import './SampleRequestForm.css';

export default function SampleRequestForm({ isOpen, onClose, productName, productFinish }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      ...formData,
      productName,
      productFinish,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sample-request-overlay">
      <div className="sample-request-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Request a Sample</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" value={productName} disabled />
          </div>
          <div className="form-group">
            <label>Product Finish</label>
            <input type="text" value={productFinish} disabled />
          </div>
          <div className="form-group">
            <label>Your Name*</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Your Email*</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <button type="submit" className="btn1">Submit Request</button>
        </form>
      </div>
    </div>
  );
}