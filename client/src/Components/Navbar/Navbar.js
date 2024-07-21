import './Navbar.css'
import { Link } from "react-router-dom";
import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
//import facebook_logo_white from '../Assets/Icons/facebook-logo-white.svg'
//import instagram_logo_white from '../Assets/Icons/instagram-logo-white.svg'
//import linkedin_logo_white from '../Assets/Icons/linkedin-logo-white.svg'
import account_icon from '../Assets/Icons/account-icon.svg'
import React, { useState, useEffect, useRef } from 'react';
import {FaBars, FaTimes} from "react-icons/fa";




export default function Navbar(){
    const navRef = useRef();
    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }

    const [scrolled, setScrolled] = useState(false);

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
           <Link to='/'><img src={wadi_degla_icon}/></Link>
			<nav ref={navRef}>
				<Link to='/'><a>Home</a></Link>
                <Link to='/about'><a>About</a></Link>
                <Link to='/'><a>Order</a></Link>
                <Link to='/'><a>Products</a></Link>
                <Link to='/gallery'><a>Gallery</a></Link>
                <Link to='/'><a>Contact</a></Link>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
            <Link to='/Login'><img src={account_icon}/></Link>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
            
        </header>
    )
}


