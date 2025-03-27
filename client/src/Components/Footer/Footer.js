import './Footer.css'
import { Link } from "react-router-dom";
import wadi_degla_logo_color from '../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg'
import facebook_circle_white_icon from '../../Public/Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../../Public/Assets/Icons/Social/instagram-circle-white-icon.svg'
// import x_circle_white_icon from '../../Public/Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../../Public/Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../../Public/Assets/Icons/Social/whatsapp-circle-white-icon.svg'

import React from 'react';
import { useNavigate } from 'react-router-dom';

//import {FaBars, FaTimes} from "react-icons/fa";



function Footer() {
  const navigate = useNavigate();
  function OnClick(){
     navigate('/contact'); 
     window.scrollTo({top: 0});
    }

    return (
      <footer className='footer-main'>
        <div className='footer-left'>
          <div className='footer-left-bg'>
            <h2>GET IN TOUCH</h2>
            <p>At Wadi Degla for Marble & Granite, we value our customers' inquiries and feedback. Our dedicated team is here to assist you and provide the information you need.</p>
            
            <button 
            className='btn1'
            onClick={OnClick}> 
              CONTACT US</button>

          </div>
        </div>
        <div className='footer-right'>
          <div className='footer-right-content'>
            <div className='footer-about'>
            <Link to='/' onClick={() => {window.scrollTo(0, 0);}}><img alt='' src={wadi_degla_logo_color} className='logo-color'/></Link>
            
              <p>Welcome to <span>Wadi Degla</span> for Marble & Granite, your trusted partner in the marble business since 1980.</p>
            </div>
            <div className='footer-nav'>
              <div className="col">
                <h4>WADI DEGLA</h4>
                <Link to='/history' onClick={() => {window.scrollTo(0, 0);}}>Our History</Link>
                <Link to='/machinery' onClick={() => {window.scrollTo(0, 0);}}>Our Machinery</Link>
                <Link to='/certificates' onClick={() => {window.scrollTo(0, 0);}}>Certificates</Link>
                <Link to='/exports' onClick={() => {window.scrollTo(0, 0);}}>Exports</Link>
                  <Link to='/packing' onClick={() => {window.scrollTo(0, 0);}}>Packing</Link>
                  <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}>Why Choose Us</Link>
                </div>

                <div className="col">
                <h4>EXPLORE</h4>
                <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}>Our Products</Link>
                <Link to='/visualizer' onClick={() => {window.scrollTo(0, 0);}}>Material Visualizer</Link>
                <Link to='/patterns' onClick={() => {window.scrollTo(0, 0);}}>Patterns / Pavers</Link>
                <Link to='/kerbstone & cobbles' onClick={() => {window.scrollTo(0, 0);}}>Kerbstone & Cobbles</Link>
                </div>

                <div className="col">
                <h4>RESOURCES</h4>
                <Link to='/quarries' onClick={() => {window.scrollTo(0, 0);}}>Quarries & Factories</Link>
                <Link to='/inspiration' onClick={() => {window.scrollTo(0, 0);}}>Inspiration</Link>
                  <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}>Gallery</Link>
                  <Link to='/partners' onClick={() => {window.scrollTo(0, 0);}}>Our Partners & Clients</Link>
                  <Link to='/projects' onClick={() => {window.scrollTo(0, 0);}}>Projects</Link>
                  <Link to='/fairs' onClick={() => {window.scrollTo(0, 0);}}>Fairs</Link>
                  <Link to='/news' onClick={() => {window.scrollTo(0, 0);}}>News</Link>

                </div>

                <div className="col">
                <h4>CONTACT US</h4>
                <Link to='/contact' onClick={() => {window.scrollTo(0, 0);}}>Contact</Link>
                <div className='social'>
                  <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={facebook_circle_white_icon} className='social-icons-footer'/></a>
                  <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img alt='' src={instagram_circle_white_icon} className='social-icons-footer'/></a>
                  {/* <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img alt='' src={x_circle_white_icon} className='social-icons-footer'/></a> */}
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

  