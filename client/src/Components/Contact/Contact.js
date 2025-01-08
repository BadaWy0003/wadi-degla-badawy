import React, { useEffect, useState } from 'react';
import './Contact.css';
import '../LoginSignup/Signup.css'
import 'react-multi-carousel/lib/styles.css';
import { useGlobalState } from '../GlobalStateContext.js';
import PhoneInput from 'react-phone-input-2'; // Import PhoneInput component
import Select from 'react-select'; // Import react-select
import "react-phone-input-2/lib/style.css";
import countryList from 'react-select-country-list'; // Optional helper for countries

import facebook_circle_white_icon from '../../Public/Assets/Icons/Social/facebook-circle-white-icon.svg';
import instagram_circle_white_icon from '../../Public/Assets/Icons/Social/instagram-circle-white-icon.svg';
import x_circle_white_icon from '../../Public/Assets/Icons/Social/x-circle-white-icon.svg';
import linkedin_circle_white_icon from '../../Public/Assets/Icons/Social/linkedin-circle-white-icon.svg';
import whatsapp_circle_white_icon from '../../Public/Assets/Icons/Social/whatsapp-circle-white-icon.svg';
import telegram_circle_white_icon from '../../Public/Assets/Icons/Social/telegram-circle-white-icon.svg';
import tiktok_circle_white_icon from '../../Public/Assets/Icons/Social/tiktok-circle-white-icon.svg';

import qr from '../../Public/Assets/Icons/Social/QR.png';

export default function Contact() {
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
  });

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
        country: countryOptions.find(
          (option) => option.label === globalState.country
        ) || null,
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
      newErrors.phone = 'Phone number must be numeric and between 8 to 15 digits.';
    }

    if (formData.whatsapp && !phoneRegex.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Whatsapp number must be numeric and between 8 to 15 digits.';
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!formData.country) newErrors.country = 'Country selection is required.';

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
    console.log('Form Data Submitted:', formData);

    // Simulate API submission
    setTimeout(() => {
      setShowSuccessPopup(true);

      // Clear the form after submission
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
      });
    }, 500); // Simulate a delay for feedback
  };

  return (
    <div className='contact-container'>
      <div className="gallery-hero">
        <div className="gallery-hero-bg"></div>
        <div className='page-title'>
          <h1>CONTACT US</h1>
          <div className="breadcrumb">
            <a href="/">Home</a>
            <p>{'>'} Contact Us</p>
          </div>
        </div>
      </div>
      <div className="contact-inner">
        <div className="contact-inner-left">
          {showSuccessPopup && (
            <div className="success-popup">
              <p>Message sent successfully!</p>
              <button onClick={() => setShowSuccessPopup(false)} className='btn1'>Close</button>
            </div>
          )}
          <div className='contact-form-title'>
            <h1>Send us a message</h1>
            <p>Our team will get back to you as soon as possible!</p>
          </div>
          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className='double-inputs'>
              <div className='input-field'>
                <label htmlFor="fname">*Full Name</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={(e) => handleInputChange('fname', e.target.value)}
                  required
                />
              </div>
              <div className='input-field'>
                <label htmlFor="cname">*Company/Project</label>
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
            <div className='double-inputs'>
              <div className='input-field'>
                <label htmlFor="rnc">Tax ID/RNC</label>
                <input
                  type="text"
                  id="rnc"
                  name="rnc"
                  value={formData.rnc}
                  onChange={(e) => handleInputChange('rnc', e.target.value)}
                />
              </div>
              <div className='input-field'>
                <label htmlFor="email">*Email Address</label>
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
            <div className='double-inputs'>
              <div className='input-field country-phone'>
                <label htmlFor="phone">*Phone Number</label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="Enter full number with country code"
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                />
              </div>
              <div className='input-field country-phone'>
                <label htmlFor="whatsapp">WhatsApp Number</label>
                <PhoneInput
                  value={formData.whatsapp}
                  onChange={(value) => handleInputChange('whatsapp', value)}
                  placeholder="Enter full number with country code"
                />
              </div>
            </div>
            <div className='double-inputs'>
              <div className='input-field' id='input-country'>
                <label htmlFor="country">*Country</label>
                <Select
                  options={countryOptions}
                  value={formData.country}
                  classNamePrefix="react-select"
                  onChange={(value) => handleInputChange('country', value)}
                  placeholder="Search for a country"
                />
              </div>
              <div className='input-field' id='input-address'>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </div>
            <div className='input-field'>
              <label htmlFor="port">*Port of Destination</label>
              <input
                type="text"
                id="port"
                name="port"
                value={formData.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                required
              />
            </div>
            <div className='input-field-message'>
              <label htmlFor="message">*Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
            {errors.country && <p className="error">{errors.country}</p>}
            {errors.phone && <p className="error">{errors.phone}</p>}
            {errors.whatsapp && <p className="error">{errors.whatsapp}</p>}
            <button type="submit" className='btn1'> SEND </button>
          </form>
        </div>
        <div className="contact-inner-right">
          <h1>Contact information</h1>
          <div className="contact-info">
            <div className="phone-numbers">
              <h4>Phone</h4>
              <a href="tel:+201067260314">(+20) 10-6726-0314</a>
              <a href="tel:+201155559896">(+20) 11-5555-9896</a>
              <a href="tel:+201016667890">(+20) 101-666-7890</a>
            </div>
            <div className="email-address">
              <h4>Email</h4>
              <a href="mailto:info@wadidegla-eg.com">info@wadidegla-eg.com</a>
            </div>
            <div className="location">
              <h4>Address</h4>
              <a href='https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7' target="_blank" rel="noopener noreferrer">
                36, 25A Shaq Althoaban Industrial
                Area for Marble & Granite, Tourrah,
                Cairo, Egypt
              </a>
            </div>
            <div className="social">
              <h4>Social</h4>
              <div className='social-icons'>
                <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={facebook_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={instagram_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img alt='' src={x_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank" rel="noopener noreferrer"><img alt='' src={linkedin_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank" rel="noopener noreferrer"><img alt='' src={whatsapp_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://t.me/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={telegram_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://www.tiktok.com/@wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={tiktok_circle_white_icon} className='social-icons-footer' /></a>
              </div>
              <h4>Or scan the QR code</h4>
              <a href='https://wadideg.social/' target="_blank" rel="noopener noreferrer"> <img alt='' src={qr} /> </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
