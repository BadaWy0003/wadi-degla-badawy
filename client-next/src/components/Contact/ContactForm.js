'use client';
import React, { useEffect, useState } from 'react';
import './Contact.css';
import '../LoginSignup/Signup.css';

import 'react-multi-carousel/lib/styles.css';
import 'react-phone-input-2/lib/style.css';

import countryList from 'react-select-country-list'; // Optional helper for countries

import { useGlobalState } from '../GlobalStateContext.js';

import PhoneInput from 'react-phone-input-2'; // Import PhoneInput component

import Select from 'react-select'; // Import react-select
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
  const { t } = useTranslation();

  const { globalState, loading } = useGlobalState(); // Access global state for user data and loading status

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [errors, setErrors] = useState({});

  const countryOptions = countryList().getData(); // Get country list

  const [formData, setFormData] = useState({
    fname: '',
    cname: '',
    rnc: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: null,
    address: '',
    port: '',
    message: '',
    attachment: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  // Pre-fill form for logged-in users
  useEffect(() => {
    if (!loading && globalState.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        fname: globalState.fullName || '',
        cname: globalState.companyName || '',
        rnc: globalState.rnc || '',
        email: globalState.email || '',
        phone: globalState.phone || '',
        whatsapp: globalState.whatsapp || '',
        country: countryOptions.find((option) => option.label === globalState.country) || null,
        address: globalState.address || '',
        port: globalState.port || '',
      }));
    }
  }, [globalState, loading, countryOptions]);

  // Validation for phone number
  const validateFields = () => {
    const newErrors = {};
    const phoneRegex = /^\d{8,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = t('contactForm.errorPhone');
    }

    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = t('contactForm.errorWhatsapp');
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t('contactForm.errorEmail');
    }

    if (!formData.country) newErrors.country = t('contactForm.errorCountry');

    return newErrors;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes

    const payload = new FormData();
    payload.append('name', formData.fname);
    payload.append('email', formData.email);
    payload.append('subject', `Contact Form Submission from ${formData.fname}`);
    payload.append('message', formData.message);
    payload.append(
      'extraFields',
      `
      <p><strong>Company/Project:</strong> ${formData.cname}</p>
      <p><strong>Tax ID (RNC):</strong> ${formData.rnc}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>WhatsApp:</strong> ${formData.whatsapp}</p>
      <p><strong>Country:</strong> ${formData.country?.label}</p>
      <p><strong>Address:</strong> ${formData.address}</p>
      <p><strong>Port of Destination:</strong> ${formData.port}</p>
    `,
    );
    if (formData.attachment) {
      payload.append('attachment', formData.attachment);
    }

    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/send-email`, {
      method: 'POST',
      body: payload,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowSuccessPopup(true);
          setFormData({
            fname: '',
            cname: '',
            rnc: '',
            email: '',
            phone: '',
            whatsapp: '',
            country: null,
            address: '',
            port: '',
            message: '',
            attachment: null,
          });
          // Reset the file input element
          const fileInput = document.getElementById('attachment');
          if (fileInput) fileInput.value = '';
        } else {
          alert(t('contactForm.errorGeneric'));
        }
      })
      .catch(() => {
        alert(t('contactForm.errorConnection'));
      });
  };

  return (
    <div className="contact-inner-left">
      {showSuccessPopup && (
        <div className="success-popup">
          <p>{t('contactForm.successMessage')}</p>
          <button onClick={() => setShowSuccessPopup(false)} className="btn1">
            Close
          </button>
        </div>
      )}
      <div className="contact-form-title">
        <h2>{t('contactForm.title')}</h2>
        <p>{t('contactForm.subtitle')}</p>
      </div>
      <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
        <div className="double-inputs">
          <div className="input-field">
            <label htmlFor="fname">{t('contactForm.fullName')}</label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={(e) => handleInputChange('fname', e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="cname">{t('contactForm.companyProject')}</label>
            <input
              type="text"
              id="cname"
              name="cname"
              value={formData.cname}
              onChange={(e) => handleInputChange('cname', e.target.value)}
              required
            />
          </div>
        </div>
        <div className="double-inputs">
          <div className="input-field">
            <label htmlFor="rnc">{t('contactForm.taxId')}</label>
            <input
              type="text"
              id="rnc"
              name="rnc"
              value={formData.rnc}
              onChange={(e) => handleInputChange('rnc', e.target.value)}
            />
          </div>
          <div className="input-field">
            <label htmlFor="email">{t('contactForm.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </div>
        <div className="double-inputs">
          <div className="input-field country-phone">
            <label htmlFor="phone">{t('contactForm.phone')}</label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              placeholder={t('signup.phonePlaceholder')}
              inputProps={{
                name: 'phone',
                required: true,
              }}
            />
          </div>
          <div className="input-field country-phone">
            <label htmlFor="whatsapp">{t('contactForm.whatsapp')}</label>
            <PhoneInput
              value={formData.whatsapp}
              onChange={(value) => handleInputChange('whatsapp', value)}
              placeholder={t('signup.phonePlaceholder')}
            />
          </div>
        </div>
        <div className="double-inputs">
          <div className="input-field" id="input-country">
            <label htmlFor="country">{t('contactForm.country')}</label>
            <Select
              options={countryOptions}
              value={formData.country}
              classNamePrefix="react-select"
              onChange={(value) => handleInputChange('country', value)}
              placeholder="Search for a country"
            />
          </div>
          <div className="input-field" id="input-address">
            <label htmlFor="address">{t('contactForm.address')}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </div>
        <div className="input-field">
          <label htmlFor="port">{t('contactForm.port')}</label>
          <input
            type="text"
            id="port"
            name="port"
            value={formData.port}
            onChange={(e) => handleInputChange('port', e.target.value)}
            required
          />
        </div>
        <div className="input-field-message">
          <label htmlFor="message">{t('contactForm.message')}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            required
          />
        </div>
        <div className="input-field input-field-file">
          <label htmlFor="attachment">{t('contactForm.attachFile')}</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
            />
            {formData.attachment && (
              <span className="file-name-display">{formData.attachment.name}</span>
            )}
          </div>
        </div>
        {errors.email && <p className="error">{errors.email}</p>}
        {errors.country && <p className="error">{errors.country}</p>}
        {errors.phone && <p className="error">{errors.phone}</p>}
        {errors.whatsapp && <p className="error">{errors.whatsapp}</p>}
        <button type="submit" className="btn1">
          {' '}
          {t('contactForm.send')}{' '}
        </button>
      </form>
    </div>
  );
}
