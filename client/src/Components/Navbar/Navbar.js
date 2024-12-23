import './Navbar.css'
import { Link } from "react-router-dom";
// import wadi_degla_logo_login from '../Assets/wadi-degla-logo-login.svg'

// import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
import wadi_degla_logo_color from "../Assets/Icons/apple-logo.svg";
// import wadi_degla_logo_color_stroke from '../Assets/wadi-degla-logo-color-stroke.svg'
// import wadi_degla_logo_gold from '../Assets/wadi-degla-logo-gold.svg'
import wadi_degla_logo_white from "../Assets/Icons/eye-gold.svg";
// import wadi_degla_logo_white_gradient from '../Assets/wadi-degla-logo-white-gradient.svg'
//import facebook_logo_white from '../Assets/Icons/facebook-logo-white.svg'
//import instagram_logo_white from '../Assets/Icons/instagram-logo-white.svg'
//import linkedin_logo_white from '../Assets/Icons/linkedin-logo-white.svg'
// import account_icon from '../Assets/Icons/account-icon.svg'
// import user_icon from '../Assets/Icons/user-icon.svg';
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from '../GlobalStateContext.js';
import {FaBars, FaTimes} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';




export default function Navbar(){
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }
    const closeNavbar = () => {
        navRef.current.classList.remove("responsive_nav");
    };


    const [scrolled, setScrolled] = useState(false);

    const { globalState, setGlobalState } = useGlobalState(); // to see if user is logged in
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Optional: Call a logout API (if required)
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent with the request
            });
    
            if (response.ok) {
                console.log("Logout successful");
    
                // Reset global state
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
    
                // Navigate to the login page
                navigate("/login");
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                console.error("Failed to logout:", response.statusText);
            }
        } catch (error) {
            console.error("Error during logout:", error);
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
    
    return(
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                        <Link to='/' onClick={() => { window.scrollTo(0, 0); }}>
                <img alt='' src={ scrolled? wadi_degla_logo_color : wadi_degla_logo_white} className='logo' />
            </Link>
            <nav ref={navRef}>
                {/* Responsive Logo (only for small screens) */}
                <img alt='Logo' src={wadi_degla_logo_color} className="nav-item-mobile" id='logo-nav-mobile' />

                {/* Navigation Links */}
                <Link to='/' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Home</Link>
                <Link to='/about' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>About</Link>
                <div className="nav-item-with-submenu">
                    <p>Explore ↓</p>
                    <div className="submenu">
                        <Link to='/products' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Products</Link>
                        <Link to='/visualizer' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Visualizer</Link>
                    </div>
                </div>
                <Link to='/gallery' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Gallery</Link>
                <Link to='/contact' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Contact</Link>

                {/* Responsive Login/My Account Section */}
                <div className="responsive-nav-bottom nav-item-mobile">
                {globalState.isLoggedIn ? (
                    <div className="nav-item-with-submenu">
                    <p>Account ↓</p>
                    <div className="submenu">
                    <Link to='/my account' onClick={() => {closeNavbar(); window.scrollTo(0, 0); }}>My Account</Link>
                        <Link to='/login' onClick={() => { closeNavbar(); handleLogout(); }}>Logout</Link>
                    </div>
                </div>
                
                ) : (
                    <div className="nav-item-with-submenu">
                    <p>Login/Signup ↓</p>
                    <div className="submenu">
                    <Link to='/login' onClick={() => {closeNavbar(); window.scrollTo(0, 0); }}>Login</Link>
                        <Link to='/signup' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Signup</Link>
                    </div>
                </div>

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
                    <p className='account-or-login'>Account ↓</p>
                    <div className="submenu">
                    <Link to='/my account' onClick={() => {closeNavbar(); window.scrollTo(0, 0); }}>My Account</Link>
                        <Link to='/login' onClick={() => { closeNavbar(); handleLogout(); }}>Logout</Link>
                    </div>
                </div>
                
                ) : (
                    <div className="nav-item-with-submenu">
                    <p className='account-or-login'>Login/Signup</p>
                    <div className="submenu">
                    <Link to='/login' onClick={() => {closeNavbar(); window.scrollTo(0, 0); }}>Login</Link>
                        <Link to='/signup' onClick={() => { closeNavbar(); window.scrollTo(0, 0); }}>Signup</Link>
                    </div>
                </div>

                )}
            </div>

            {/* Hamburger Icon */}
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars />
            </button>

            
        </header>
    )
}


