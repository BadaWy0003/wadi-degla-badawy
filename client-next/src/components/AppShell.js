'use client';

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { LangContext } from '../context/LangContext';
import { GlobalStateProvider } from './GlobalStateContext';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ScrollToTop from './ScrollToTop';

export default function AppShell({ children, lang }) {
  // Initialize i18n language from URL param
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    // Persist to localStorage for non-SSG pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, [lang]);

  // Set html lang + dir
  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Initialise i18n synchronously for the current page
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <LangContext.Provider value={lang}>
      <I18nextProvider i18n={i18n}>
        <GlobalStateProvider>
          <ScrollToTop />
          <div className="main">
            <Navbar />
            <ToastContainer autoClose={5000} hideProgressBar />
            <div id="main-content" className="main-content">
              <div className="route-wrapper">
                {children}
              </div>
            </div>
            <Footer />
          </div>
        </GlobalStateProvider>
      </I18nextProvider>
    </LangContext.Provider>
  );
}
