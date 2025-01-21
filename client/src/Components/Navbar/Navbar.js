import "./Navbar.css";
import { Link } from "react-router-dom";
// import wadi_degla_logo_login from '../../Public/Assets/wadi-degla-logo-login.svg'

// import wadi_degla_icon from '../../Public/Assets/Icons/wadi-degla-logo-icon.svg'
import wadi_degla_logo_color from "../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg";
// import wadi_degla_logo_color_stroke from '../../Public/Assets/wadi-degla-logo-color-stroke.svg'
// import wadi_degla_logo_gold from '../../Public/Assets/wadi-degla-logo-gold.svg'
import wadi_degla_logo_white from "../../Public/Assets/Logo-Identity/wadi-degla-logo-white.svg";
// import wadi_degla_logo_white_gradient from '../../Public/Assets/wadi-degla-logo-white-gradient.svg'
//import facebook_logo_white from '../../Public/Assets/Icons/facebook-logo-white.svg'
//import instagram_logo_white from '../../Public/Assets/Icons/instagram-logo-white.svg'
//import linkedin_logo_white from '../../Public/Assets/Icons/linkedin-logo-white.svg'
// import account_icon from '../../Public/Assets/Icons/account-icon.svg'
// import user_icon from '../../Public/Assets/Icons/user-icon.svg';
import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "../GlobalStateContext.js";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../util/client.js";

export default function Navbar() {
  const navRef = useRef();
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  };

  const [scrolled, setScrolled] = useState(false);

  const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
  const navigate = useNavigate();

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
        <img
          alt=""
          src={scrolled ? wadi_degla_logo_color : wadi_degla_logo_white}
          className="logo"
        />
      </Link>
      <nav ref={navRef}>
        {/* Responsive Logo (only for small screens) */}
        <img
          alt="Logo"
          src={wadi_degla_logo_color}
          className="nav-item-mobile"
          id="logo-nav-mobile"
        />

        {/* Navigation Links */}
        <Link
          to="/"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          About
        </Link>
        <div className="nav-item-with-submenu">
          <p>Explore ↓</p>
          <div className="submenu-bg">
            <div className="submenu">
              <Link
                to="/products"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Products
              </Link>
              <Link
                to="/visualizer"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Visualizer
              </Link>
            </div>
          </div>
        </div>
        <Link
          to="/gallery"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          Gallery
        </Link>
        <Link
          to="/contact"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          Contact
        </Link>

        {/* Responsive Login/My Account Section */}
        <div className="responsive-nav-bottom nav-item-mobile">
          {globalState.isLoggedIn ? (
            <div className="nav-item-with-submenu">
              <p>Account ↓</p>
              <div className="submenu">
                <Link
                  to="/my account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  My Account
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  Logout
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
              Login
            </Link>
          )}
        </div>

        {/* Close Button */}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>

      {/* Desktop Login/My Account Section */}
      <div className="nav-item-desktop">
        {globalState.isLoggedIn ? (
          <div className="nav-item-with-submenu">
            <p className="account-or-login">Account ↓</p>
            <div className="submenu-bg">
              <div className="submenu">
                <Link
                  to="/my account"
                  onClick={() => {
                    closeNavbar();
                    window.scrollTo(0, 0);
                  }}
                >
                  My Account
                </Link>
                <Link
                  to="/login"
                  onClick={() => {
                    closeNavbar();
                    handleLogout();
                  }}
                >
                  Logout
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
            Login/Signup
          </Link>
        )}
      </div>

      {/* Hamburger Icon */}
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}
