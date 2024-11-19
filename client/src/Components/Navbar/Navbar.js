import './Navbar.css'
import { Link } from "react-router-dom";
import wadi_degla_logo_login from '../Assets/wadi-degla-logo-login.svg'

// import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
// import wadi_degla_logo_color from '../Assets/wadi-degla-logo-color.svg'
// import wadi_degla_logo_color_stroke from '../Assets/wadi-degla-logo-color-stroke.svg'
// import wadi_degla_logo_gold from '../Assets/wadi-degla-logo-gold.svg'
// import wadi_degla_logo_white from '../Assets/wadi-degla-logo-white.svg'
// import wadi_degla_logo_white_gradient from '../Assets/wadi-degla-logo-white-gradient.svg'
//import facebook_logo_white from '../Assets/Icons/facebook-logo-white.svg'
//import instagram_logo_white from '../Assets/Icons/instagram-logo-white.svg'
//import linkedin_logo_white from '../Assets/Icons/linkedin-logo-white.svg'
import account_icon from '../Assets/Icons/account-icon.svg'
// import user_icon from '../Assets/Icons/user-icon.svg';
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from '../GlobalStateContext.js';
import {FaBars, FaTimes} from "react-icons/fa";




export default function Navbar(){
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }

    const [scrolled, setScrolled] = useState(false);

    const { globalState } = useGlobalState(); // to see if user is logged in

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
           <Link to='/' onClick={() => {window.scrollTo(0, 0);}}><img src={wadi_degla_logo_login} className='logo'/></Link>
			<nav ref={navRef}>
				<Link to='/' onClick={() => {window.scrollTo(0, 0);}}><a>Home</a></Link>
                <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}><a>About</a></Link>
                <div className="nav-item-with-submenu">
                    <a>Explore</a>
                    
                    {/* Submenu */}
                    <div className="submenu">
                    <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}><a>Products</a></Link>
                    <Link to='/visualizer' onClick={() => {window.scrollTo(0, 0);}}><a>Visualizer</a></Link>
                    </div>
                </div>
                  <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}><a>Gallery</a></Link>
                <Link to='/contact' onClick={() => {window.scrollTo(0, 0);}}><a>Contact</a></Link>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
            <div className="nav-item-with-submenu">
                {globalState.isLoggedIn ? (
                    <>
                       
                        <img src={account_icon} alt="Account Icon" />
                        
                        
                        {/* Submenu */}
                        <div className="submenu">
                            <Link to='/my account' onClick={() => { window.scrollTo(0, 0); }}>
                                My Account
                            </Link>
                            <button>Logout</button>
                        </div>
                    </>
                ) : (
                    <Link to='/login' onClick={() => { window.scrollTo(0, 0); }}>
                        Login
                    </Link>
                )}
            
                </div>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
            
        </header>
    )
}


