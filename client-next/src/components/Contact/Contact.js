'use client';
import './Contact.css';
import '../LoginSignup/Signup.css';
import './ContactPage.css';

import ContactForm from './ContactForm.js';
import ContactInfo from './ContactInfo.js';
import ContactQuick from './ContactQuick.js';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

// Contact page: short hero, quick contact buttons, then the form and the company's details.
// Styles: ContactPage.css (everything is scoped under .cx-page; Contact.css is still used by
// the footer, login/signup and the sample-request form).
export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="contact-container cx-page">
      <section className="cx-hero">
        <div className="cx-hero-inner">
          <nav className="cx-crumbs" aria-label={t('contact.breadcrumbContact')}>
            <LangLink href="/">{t('contact.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t('contact.breadcrumbContact')}</span>
          </nav>
          <p className="cx-eyebrow">{t('contact.heroEyebrow')}</p>
          <h1>{t('contact.heroHeading')}</h1>
          <p className="cx-hero-sub">{t('contact.heroSubtitle')}</p>
        </div>
      </section>

      <ContactQuick />

      <div className="cx-main">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}
