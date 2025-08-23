import './Contact.css';
import '../LoginSignup/Signup.css'

import ContactForm from './ContactForm.js';
import ContactInfo from './ContactInfo.js';
import { Helmet } from 'react-helmet-async';

export default function Contact() {

  return (
    <>
    <Helmet>
        <title>Contact | Wadidegla</title>
        <meta name="description" content="Contact Description" />
        <link rel="canonical" href="https://www.wadidegla-eg.com/contact" />
    </Helmet>
    
    <div className='contact-container'>
      {/* 🌟 Hero Section */}
      <div className="quarries-hero">
          <h1>CONTACT US</h1>
          <div className="breadcrumb">
          <a href="/">Home</a>
          <p>{'>'} Contact</p>
          </div>
      </div>  

      <div className="contact-inner">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
    </>
  );
}
