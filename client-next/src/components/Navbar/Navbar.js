'use client';
import "./Navbar.css";
import { usePathname, useRouter } from "next/navigation";
import LangLink from "../LangLink";
import wadi_degla_logo_color from "../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg";
import wadi_degla_logo_white from "../../Public/Assets/Logo-Identity/wadi-degla-logo-white.svg";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useGlobalState } from "../GlobalStateContext.js";
import { useLang } from "../../context/LangContext";
import { FaBars, FaTimes } from "react-icons/fa";
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

      router.push(`/${lang}/login`);
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
      <LangLink
        href="/"
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <img loading="lazy"
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
            <img loading="lazy"
          alt={t('navigation.wadiDegla')}
          src={wadi_degla_logo_color}
          className="nav-item-mobile"
          id="logo-nav-mobile"
        />
      </LangLink>
        {/* Navigation Links */}
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.wadiDegla')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
              <LangLink
                href="/history"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.history')}
              </LangLink>
              <LangLink
                href="/machinery"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.machinery')}
              </LangLink>
              <LangLink
                href="/certificates"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.certificates')}
              </LangLink>
              <LangLink
                href="/exports"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.exports')}
              </LangLink>
              <LangLink
                href="/packing"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.packing')}
              </LangLink>
              <LangLink
                href="/about"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.whyChooseUs')}
              </LangLink>

            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.products')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
              <LangLink
                href="/products"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.exploreProducts')}
              </LangLink>
              <LangLink
                href="/visualizer"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.materialVisualizer')}
              </LangLink>
              <LangLink
                href="/patterns"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.patterns')}
              </LangLink>
              <LangLink
                href="/kerbstone"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.kerbstone')}
              </LangLink>
              <LangLink
                href="/cobbles"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.cobbles')}
              </LangLink>
              <LangLink
                href="/stone-creations"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.stoneCreations')}
              </LangLink>
            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>{t('navigation.resources')}</p>
          </div>
          <div className="submenu-bg">
            <div className="submenu">
            <LangLink
                href="/quarries"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.quarries')}
              </LangLink>
              <LangLink
                href="/inspiration"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.inspiration')}
              </LangLink>
              <LangLink
                href="/gallery"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.gallery')}
              </LangLink>
              <LangLink
                href="/news"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.news')}
              </LangLink>
              <LangLink
                href="/partners"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.partners')}
              </LangLink>
            </div>
          </div>
        </div>
        <LangLink
          href="/projects"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.projects')}
        </LangLink>
        <LangLink
          href="/fairs"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          {t('navigation.fairs')}
        </LangLink>
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
