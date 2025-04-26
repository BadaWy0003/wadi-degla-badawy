import React, { useEffect, useState } from 'react';
import './SampleRequestForm.css';
import "./Products.css";
import { useGlobalState } from '../GlobalStateContext.js';

export default function SampleRequestForm({ isOpen, onClose, productName, productFinish }) {
    const { globalState, loading } = useGlobalState(); // Access global state for user data and loading status 
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  // Pre-fill form for logged-in users
  useEffect(() => {
    if (!loading && globalState.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        name: globalState.fullName || '',
        email: globalState.email || '',
      }));
    }
  }, [globalState, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      ...formData,
      productName,
      productFinish,
    });
    setFormData({ name: '', email: '' });
    setShowSuccessPopup(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sample-request-overlay">
                  {showSuccessPopup && (
            <div className="success-popup">
              <p>Message sent successfully!</p>
              <button onClick={() => setShowSuccessPopup(false)} className='btn1'>Close</button>
            </div>
          )}
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