'use client';
import './Contact.css';
import '../LoginSignup/Signup.css'

import ContactForm from './ContactForm.js';
import ContactInfo from './ContactInfo.js';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <>

      <div className='contact-container'>
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
          <h1>{t('contact.heroHeading')}</h1>
          <div className="breadcrumb">
            <a href="/">{t('contact.breadcrumbHome')}</a>
            <p>{'>'} {t('contact.breadcrumbContact')}</p>
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
