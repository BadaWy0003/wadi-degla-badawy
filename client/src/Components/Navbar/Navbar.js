import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import wadi_degla_logo_color from "../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg";
import wadi_degla_logo_white from "../../Public/Assets/Logo-Identity/wadi-degla-logo-white.svg";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { useGlobalState } from "../GlobalStateContext.js";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../util/client.js";
import arrow_down from "../../Public/Assets/Icons/arrow-down.svg";
import SearchBar from "../SearchBar/SearchBar.js.js";
import SearchBarMobile from "../SearchBar/SearchBarMobile.js.js";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

export default function Navbar() {
  const navRef = useRef();
  const { t } = useTranslation();
  
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  };

  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    closeNavbar();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await apiClient.post(`/api/auth/logout`);
    } finally {
      setGlobalState({
        isLoggedIn: false,
        token: null,
        fullName: "",
        companyName: "",
        rnc: "",
        email: "",
        phone: "",
        whatsapp: "",
        country: "",
        countryCode: "",
        address: "",
        port: "",
      });

      navigate("/login");
      window.scrollTo({ top: 0, behavior: "smooth" });
      localStorage.removeItem("auth_token");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <Link
        to="/"
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <img loading="lazy"
          alt={t('navigation.wadiDegla')}
          src={scrolled ? wadi_degla_logo_color : wadi_degla_logo_white}
          className="logo"
        />
      </Link>
      <nav ref={navRef}>
        {/* Responsive Logo (only for small screens) */}
        <Link
        to="/"
        onClick={() => {
          closeNavbar();
          window.scrollTo(0, 0);
        }}
      >
            <img loading="lazy"
          alt={t('navigation.wadiDegla')}
          src={wadi_degla_logo_color}
          className="nav-item-mobile"
          id="logo-nav-mobile"
        />
      </Link>
        {/* Navigation Links */}
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.wadiDegla')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
              <Link
                to="/history"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.history')}
              </Link>
              <Link
                to="/machinery"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.machinery')}
              </Link>
              <Link
                to="/certificates"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.certificates')}
              </Link>
              <Link
                to="/exports"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.exports')}
              </Link>
              <Link
                to="/packing"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.packing')}
              </Link>
              <Link
                to="/about"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.whyChooseUs')}
              </Link>

            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.products')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
              <Link
                to="/products"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.exploreProducts')}
              </Link>
              <Link
                to="/visualizer"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.materialVisualizer')}
              </Link>
              <Link
                to="/patterns"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.patterns')}
              </Link>
              <Link
                to="/kerbstone"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.kerbstone')}
              </Link>
              <Link
                to="/Cobbles"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.cobbles')}
              </Link>
              <Link
                to="/Stone Creations"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.stoneCreations')}
              </Link>
            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.resources')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
            <Link
                to="/quarries"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.quarries')}
              </Link>
              <Link
                to="/inspiration"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.inspiration')}
              </Link>
              <Link
                to="/gallery"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.gallery')}
              </Link>
              <Link
                to="/news"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.news')}
              </Link>
              <Link
                to="/partners"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.partners')}
              </Link>
            </div>
          </div>
        </div>
        <Link
          to="/projects"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.projects')}
        </Link>
        <Link
          to="/fairs"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.fairs')}
        </Link>
        <Link
          to="/contact"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.contact')}
        </Link>
          <div className="navbar-search hide-on-mobile">
            <SearchBar />
          </div>
        {/* Responsive Login/My Account Section */}
        <div className="responsive-nav-bottom nav-item-mobile">
          {globalState.isLoggedIn ? (
            <div className="nav-item-with-submenu">
              <p>{t('navigation.account')} ↓</p>
              <div className="submenu">
                <Link
                  to="/my account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  {t('navigation.myAccount')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  {t('navigation.logout')}
                </Link>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => {
                closeNavbar();
                window.scrollTo(0, 0);
              }}
            >
              {t('navigation.login')}
            </Link>
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
                <Link
                  to="/my account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  {t('navigation.myAccount')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  {t('navigation.logout')}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Link
            className="account-or-login"
            to="/login"
            onClick={() => {
              closeNavbar();
              window.scrollTo(0, 0);
            }}
          >
            {t('navigation.loginSignup')}
          </Link>
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
