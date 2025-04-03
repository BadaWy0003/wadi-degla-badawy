import "./Navbar.css";
import { Link } from "react-router-dom";
import wadi_degla_logo_color from "../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg";
import wadi_degla_logo_white from "../../Public/Assets/Logo-Identity/wadi-degla-logo-white.svg";
import React, { useState, useEffect, useRef } from "react";
import { useGlobalState } from "../GlobalStateContext.js";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../util/client.js";
import arrow_down from "../../Public/Assets/Icons/arrow-down.svg";

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
        <img loading="lazy"
          alt=""
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
          alt="Logo"
          src={wadi_degla_logo_color}
          className="nav-item-mobile"
          id="logo-nav-mobile"
        />
      </Link>
        {/* Navigation Links */}
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>Wadi Degla</p>
          <img loading="lazy" src={arrow_down} alt=""/>
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
                History
              </Link>
              <Link
                to="/machinery"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Machinery
              </Link>
              <Link
                to="/certificates"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Certificates
              </Link>
              <Link
                to="/exports"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Exports
              </Link>
              <Link
                to="/packing"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Packing
              </Link>
              <Link
                to="/about"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Why Choose Us?
              </Link>

            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>Products</p>
          <img loading="lazy" src={arrow_down} alt=""/>
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
                Explore Our Products
              </Link>
              <Link
                to="/visualizer"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Material Visualizer
              </Link>
              <Link
                to="/patterns"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Patterns / Pavers
              </Link>
              <Link
                to="/kerbstone"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Kerbstone
              </Link>
              <Link
                to="/Cobbles"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Cobbles
              </Link>
              <Link
                to="/Stone Creations"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Stone Creations
              </Link>
            </div>
          </div>
        </div>
        <div className="nav-item-with-submenu">
          <div className="nav-item-with-submenu-title">
          <p>Resources</p>
          <img loading="lazy" src={arrow_down} alt=""/>
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
                Quarries & Factories
              </Link>
              <Link
                to="/inspiration"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Inspiration
              </Link>
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
                to="/news"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                News
              </Link>
              <Link
                to="/partners"
                onClick={() => {
                  closeNavbar();
                  window.scrollTo(0, 0);
                }}
              >
                Our Partners & Clients
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
          Projects
        </Link>
        <Link
          to="/fairs"
          onClick={() => {
            closeNavbar();
            window.scrollTo(0, 0);
          }}
        >
          Fairs
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
