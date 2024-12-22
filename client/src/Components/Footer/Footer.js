import './Footer.css'
import { Link } from "react-router-dom";
//import wadi_degla_icon from '../Assets/Icons/wadi-degla-logo-icon.svg'
import wadi_degla_logo_color from '../Assets/Media/Logo-Identity/Logo-Color.svg'
import facebook_circle_white_icon from '../Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../Assets/Icons/Social/instagram-circle-white-icon.svg'
import x_circle_white_icon from '../Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../Assets/Icons/Social/whatsapp-circle-white-icon.svg'
// import telegram_circle_white_icon from '../Assets/Icons/Social/telegram-circle-white-icon.svg';
// import tiktok_circle_white_icon from '../Assets/Icons/Social/tiktok-circle-white-icon.svg';


//import facebook_white_icon from '../Assets/Icons/Social/facebook-white-icon.svg'
//import instagram_white_icon from '../Assets/Icons/Social/instagram-white-icon.svg'
//import x_white_icon from '../Assets/Icons/Social/x-white-icon.svg'
//import linkedin_white_icon from '../Assets/Icons/Social/linkedin-white-icon.svg'
//import whatsapp_white_icon from '../Assets/Icons/Social/whatsapp-white-icon.svg'

import React from 'react';
import { useNavigate } from 'react-router-dom';

//import {FaBars, FaTimes} from "react-icons/fa";



function Footer() {
  const navigate = useNavigate();
    
    return (
      <footer className='footer-main'>
        <div className='footer-left'>
          <div className='footer-left-bg'>
            <h1>GET IN TOUCH</h1>
            <p>At Wadi Degla for Marble & Granite, we value our customers' inquiries and feedback. Our dedicated team is here to assist you and provide the information you need.</p>
            
            <button 
            className='btn1'
            onClick={() => {
                             navigate('/contact'); // Redirect to the homepage
                                window.scrollTo({top: 0})
                             }}> 
              CONTACT US</button>

          </div>
        </div>
        <div className='footer-right'>
          <div className='footer-right-content'>
            <div className='footer-about'>
              <img alt='' src={wadi_degla_logo_color} className='logo-color'/>
              <p>Welcome to <span>Wadi Degla</span> for Marble & Granite, your trusted partner in the marble business since 1980.</p>
            </div>
            <div className='footer-nav'>
              <div className="col">
                <h4>Company</h4>
                <ul className="list-unstyled">
                <Link to='/' onClick={() => {window.scrollTo(0, 0);}}>Home</Link>
                  <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}>About</Link>
                  <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}>Products</Link>
                  <Link to='/visualizer' onClick={() => {window.scrollTo(0, 0);}}>Visualizer</Link>
                  <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}>Gallery</Link>
                  <Link to='/contact' onClick={() => {window.scrollTo(0, 0);}}>Contact</Link>
                </ul>
                </div>
                <div className="col">
                <h4>Social</h4>
                <div className='social'>
                  <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={facebook_circle_white_icon} className='social-icons-footer'/></a>
                  <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={instagram_circle_white_icon} className='social-icons-footer'/></a>
                  <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img alt='' src={x_circle_white_icon} className='social-icons-footer'/></a>
                  <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank" rel="noopener noreferrer"><img alt='' src={linkedin_circle_white_icon} className='social-icons-footer'/></a>
                  <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank" rel="noopener noreferrer"><img alt='' src={whatsapp_circle_white_icon} className='social-icons-footer'/></a>
                  {/* <a href='https://t.me/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={telegram_circle_white_icon} className='social-icons-footer' /></a>
                  <a href='https://www.tiktok.com/@wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={tiktok_circle_white_icon} className='social-icons-footer' /></a> */}
                  

                  </div>
                </div>
            </div>
          </div>
          <div className='copy-rights'>
            <p> &copy;{new Date().getFullYear()} Wadi Degla All Rights Reserved</p>
            
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer;

  