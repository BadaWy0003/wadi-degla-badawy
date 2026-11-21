'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { I18nextProvider } from 'react-i18next';
import i18n, { setLanguageMessages } from '../../i18n';
import { LangContext } from '../context/LangContext';
import { GlobalStateProvider } from './GlobalStateContext';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ScrollToTop from './ScrollToTop';
import { startEnquiryTracking } from '../util/analytics';
import { captureSource } from '../util/visit-source';
import { SHOW_TOASTS_EVENT } from '../util/toast';

const ToastHost = dynamic(() => import('./ToastHost'), { ssr: false });
const CookieBanner = dynamic(() => import('./CookieBanner/CookieBanner'), { ssr: false });

export default function AppShell({ children, lang, messages }) {
  // Initialize i18n language from URL param
  useEffect(() => {
    setLanguageMessages(lang, messages);
    // Persist to localStorage for non-SSG pages
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, [lang, messages]);

  // Pop-up messages: the toast code is only loaded the first time a message is sent
  const [showToasts, setShowToasts] = useState(false);
  useEffect(() => {
    const show = () => setShowToasts(true);
    window.addEventListener(SHOW_TOASTS_EVENT, show);
    return () => window.removeEventListener(SHOW_TOASTS_EVENT, show);
  }, []);

  // Count WhatsApp / call / email / directions taps in Google Analytics
  useEffect(() => startEnquiryTracking(), []);

  // Where this visitor came from (Google, LinkedIn, a campaign link...), sent with enquiries
  useEffect(() => captureSource(), []);

  // Set html lang + dir
  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Initialise i18n synchronously for the current page
  // (messages = this language's texts, passed from the [lang] root layout)
  setLanguageMessages(lang, messages);

  return (
    <LangContext.Provider value={lang}>
      <I18nextProvider i18n={i18n}>
        <GlobalStateProvider>
          <ScrollToTop />
          <div className="main">
            <Navbar />
            {showToasts && <ToastHost />}
            <div id="main-content" className="main-content">
              <div className="route-wrapper">{children}</div>
            </div>
            <Footer />
            <CookieBanner />
          </div>
        </GlobalStateProvider>
      </I18nextProvider>
    </LangContext.Provider>
  );
}
