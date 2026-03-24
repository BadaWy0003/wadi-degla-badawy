'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // keep language value normalized to base code (e.g. 'en' from 'en-US')
  const currentLang = (i18n.language || 'en').split('-')[0];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'ro', label: 'RO' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' },
    { code: 'it', label: 'IT' },
    { code: 'ko', label: 'KO' },
    { code: 'sq', label: 'SQ' },
    { code: 'ru', label: 'RU' },
    { code: 'ja', label: 'JA' },
    { code: 'zh', label: 'ZH' },
    { code: 'ar', label: 'عر' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
    // Navigate to same page with new language prefix (e.g. /en/products → /fr/products)
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = lng;
    }
    router.push(segments.join('/') || `/${lng}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = languages.find(lang => lang.code === currentLang)?.label || 'EN';

  return (
    <div className="language-selector" ref={dropdownRef}>
      <div className="language-selector-header" onClick={() => setIsOpen(!isOpen)}>
        <FaGlobe className="globe-icon" />
      </div>
      {isOpen && (
        <div className="language-selector-dropdown">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${lang.code === currentLang ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;