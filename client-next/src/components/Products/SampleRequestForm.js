'use client';
import React, { useEffect, useState } from 'react';
import './SampleRequestForm.css';
import './Products.css';
import { useGlobalState } from '../GlobalStateContext.js';
import { useTranslation } from 'react-i18next';

export default function SampleRequestForm({ isOpen, onClose, productName, productFinish }) {
  const { globalState, loading } = useGlobalState(); // Access global state for user data and loading status
  const { t } = useTranslation();
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

    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: `Sample Request from ${formData.name}`,
        message: `
        <p>Requesting a sample for:</p>
        <ul>
          <li>Product: <strong>${productName}</strong></li>
          <li>Finish: <strong>${productFinish}</strong></li>
        </ul>
      `,
        extraFields: '',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFormData({ name: '', email: '' });
          setShowSuccessPopup(true);
        } else {
          alert('Failed to send request. Please try again.');
        }
      })
      .catch(() => {
        alert('Network error. Try again later.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="sample-request-overlay">
      {showSuccessPopup && (
        <div className="success-popup">
          <p>{t('sampleRequestForm.successMessage')}</p>
          <button onClick={() => setShowSuccessPopup(false)} className="btn1">
            {t('sampleRequestForm.close')}
          </button>
        </div>
      )}
      <div className="sample-request-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{t('sampleRequestForm.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('sampleRequestForm.productName')}</label>
            <input type="text" value={productName} disabled />
          </div>
          <div className="form-group">
            <label>{t('sampleRequestForm.productFinish')}</label>
            <input type="text" value={productFinish} disabled />
          </div>
          <div className="form-group">
            <label>{t('sampleRequestForm.yourName')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>{t('sampleRequestForm.yourEmail')}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <button type="submit" className="btn1">
            {t('sampleRequestForm.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
