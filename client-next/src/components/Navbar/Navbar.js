'use client';
import './Navbar.css';
import { usePathname, useRouter } from 'next/navigation';
import LangLink from '../LangLink';
const wadi_degla_logo_color = '/Assets/Logo-Identity/wadi-degla-logo-color.svg';
const wadi_degla_logo_white = '/Assets/Logo-Identity/wadi-degla-logo-white.svg';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalState } from '../GlobalStateContext.js';
import { useLang } from '../../context/LangContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getApiClient } from '../../util/api-lazy.js';
const arrow_down = '/Assets/Icons/arrow-down.svg';
import SearchBar from '../SearchBar/SearchBar.js.js';
import SearchBarMobile from '../SearchBar/SearchBarMobile.js.js';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU } from '../../util/site-menu';

export default function Navbar() {
  const navRef = useRef();
  const { t } = useTranslation();

  const showNavbar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };
  const closeNavbar = () => {
    navRef.current.classList.remove('responsive_nav');
  };

  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLang();

  const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in

  // Close mobile menu when route changes
  useEffect(() => {
    closeNavbar();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const apiClient = await getApiClient();
      await apiClient.post(`/api/auth/logout`);
    } finally {
      setGlobalState({
        isLoggedIn: false,
        token: null,
        fullName: '',
        companyName: '',
        rnc: '',
        email: '',
        phone: '',
        whatsapp: '',
        country: '',
        countryCode: '',
        address: '',
        port: '',
      });

      router.push(`/${lang}/login`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      localStorage.removeItem('auth_token');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onNavigate = () => {
    closeNavbar();
    window.scrollTo(0, 0);
  };

  // One dropdown: optional group titles (plain text, not links), the links, and an optional
  // "View all" button. The Products menu is "wide": its groups sit side by side on desktop.
  const renderDropdown = (menu) => (
    <div className="nav-item-with-submenu" key={menu.label}>
      <div className="nav-item-with-submenu-title">
        <p>{t(menu.label)}</p>
      </div>
      <div className={`submenu-bg${menu.wide ? ' submenu-bg-wide' : ''}`}>
        <div className={`submenu${menu.wide ? ' submenu-wide' : ''}`}>
          {menu.groups.map((group, gi) => (
            <div className="submenu-group" key={group.title || gi}>
              {group.title && <span className="submenu-group-title">{t(group.title)}</span>}
              {group.items.map((item) => (
                <LangLink key={item.href} href={item.href} onClick={onNavigate}>
                  {t(item.label)}
                </LangLink>
              ))}
            </div>
          ))}
          {menu.all && (
            <LangLink href={menu.all.href} onClick={onNavigate} className="submenu-all">
              {t(menu.all.label)} <span aria-hidden="true">→</span>
            </LangLink>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <LangLink
        href="/"
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <img
          loading="lazy"
          alt={t('navigation.wadiDegla')}
          src={scrolled ? wadi_degla_logo_color : wadi_degla_logo_white}
          className="logo"
        />
      </LangLink>
      <nav ref={navRef}>
        {/* Responsive Logo (only for small screens) */}
        <LangLink
          href="/"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          <img
            loading="lazy"
            alt={t('navigation.wadiDegla')}
            src={wadi_degla_logo_color}
            className="nav-item-mobile"
            id="logo-nav-mobile"
          />
        </LangLink>
        {/* Navigation Links (lists in src/util/site-menu.js) */}
        {renderDropdown(COMPANY_MENU)}
        {renderDropdown(PRODUCTS_MENU)}
        <LangLink href="/projects" onClick={onNavigate}>
          {t('navigation.projects')}
        </LangLink>
        {renderDropdown(RESOURCES_MENU)}
        <LangLink
          href="/contact"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.contact')}
        </LangLink>
        <div className="navbar-search hide-on-mobile">
          <SearchBar />
        </div>
        {/* Responsive Login/My Account Section */}
        <div className="responsive-nav-bottom nav-item-mobile">
          {globalState.isLoggedIn ? (
            <div className="nav-item-with-submenu">
              <p>{t('navigation.account')} ↓</p>
              <div className="submenu">
                <LangLink
                  href="/my-account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  {t('navigation.myAccount')}
                </LangLink>
                <LangLink
                  href="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  {t('navigation.logout')}
                </LangLink>
              </div>
            </div>
          ) : (
            <LangLink
              href="/login"
              onClick={() => {
                closeNavbar();
                window.scrollTo(0, 0);
              }}
            >
              {t('navigation.login')}
            </LangLink>
          )}
        </div>

        {/* Close Button */}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>

        {/* Language Selector - Mobile */}
        <LanguageSelector />
      </nav>

      {/* Desktop Login/My Account Section */}
      <div className="nav-item-desktop">
        {globalState.isLoggedIn ? (
          <div className="nav-item-with-submenu">
            <p className="account-or-login">{t('navigation.account')} ↓</p>
            <div className="submenu-bg">
              <div className="submenu">
                <LangLink
                  href="/my-account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  {t('navigation.myAccount')}
                </LangLink>
                <LangLink
                  href="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  {t('navigation.logout')}
                </LangLink>
              </div>
            </div>
          </div>
        ) : (
          <LangLink
            className="account-or-login"
            href="/login"
            onClick={() => {
              closeNavbar();
              window.scrollTo(0, 0);
            }}
          >
            {t('navigation.loginSignup')}
          </LangLink>
        )}
      </div>

      {/* Desktop Language Selector */}
      <div className="language-selector-desktop">
        <LanguageSelector />
      </div>

      <div className="mob-search-and-nav-btn">
        <div className="navbar-search show-on-mobile">
          <SearchBarMobile />
        </div>
        {/* Hamburger Icon */}
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars />
        </button>
      </div>
    </header>
  );
}
