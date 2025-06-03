import './Contact.css';
import '../LoginSignup/Signup.css'

import facebook_circle_white_icon from '../../Public/Assets/Icons/Social/facebook-circle-white-icon.svg';
import instagram_circle_white_icon from '../../Public/Assets/Icons/Social/instagram-circle-white-icon.svg';
// import x_circle_white_icon from '../../Public/Assets/Icons/Social/x-circle-white-icon.svg';
import linkedin_circle_white_icon from '../../Public/Assets/Icons/Social/linkedin-circle-white-icon.svg';
import whatsapp_circle_white_icon from '../../Public/Assets/Icons/Social/whatsapp-circle-white-icon.svg';
import telegram_circle_white_icon from '../../Public/Assets/Icons/Social/telegram-circle-white-icon.svg';
import tiktok_circle_white_icon from '../../Public/Assets/Icons/Social/tiktok-circle-white-icon.svg';
import qr from '../../Public/Assets/Icons/Social/QR.png';
import AddressMap from './AddressMap.js';

export default function ContactInfo() {
    return (
        <div className="contact-inner-right">
          <h2>Contact information</h2>
          <div className="contact-info">
          <div className="email-address">
              <h4>Email</h4>
              <p>For homes, retail & sales</p>
              <a href="mailto:sales@wadidegla-eg.com">sales@wadidegla-eg.com</a>
              <p>For projects local & international</p>
              <a href="mailto:projects@wadidegla-eg.com">projects@wadidegla-eg.com</a>
              <p>For international wholesalers, distributors & agents</p>
              <a href="mailto:export@wadidegla-eg.com">export@wadidegla-eg.com</a>
              <p>For more information</p>
              <a href="mailto:info@wadidegla-eg.com">info@wadidegla-eg.com</a>
            </div>

            <div className="phone-numbers">
              <h4>Phone</h4>
              <p>Head Office</p>
              <a href="tel:+201067260314">(+20) 10-6726-0314</a>
              <a href="tel:+201155559896">(+20) 11-5555-9896</a>
              <p>Support</p>
              <a href="tel:+201016667890">(+20) 101-666-7890</a>
            </div>
            <div className="location">
              <h4>Address</h4>
              <a href='https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7' target="_blank" rel="noopener noreferrer">
                36, 241D Shaq Althoaban Industrial
                Area for Marble & Granite, Tourrah,
                Cairo, Egypt
              </a>
              <AddressMap />
            </div>
            <div className="social">
              <h4>Social</h4>
              <div className='social-icons'>
                <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={facebook_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={instagram_circle_white_icon} className='social-icons-footer' /></a>
                {/* <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={x_circle_white_icon} className='social-icons-footer' /></a> */}
                <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={linkedin_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={whatsapp_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://t.me/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={telegram_circle_white_icon} className='social-icons-footer' /></a>
                <a href='https://www.tiktok.com/@wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={tiktok_circle_white_icon} className='social-icons-footer' /></a>
              </div>
              <a href='https://drive.google.com/file/d/1mrKEa0hx4pTVfL062V4Mq2yR6mYo8abZ/view?usp=sharing' target="_blank" rel="noopener noreferrer"> <button className='btn1'>
                OUR COMPANY PROFILE & PRODUCTS</button> </a>
              <h4>Click Or scan the QR code for all links</h4>
              <div>
              <a id="qr-code" href='https://wadideg.social/' target="_blank" rel="noopener noreferrer"> <img loading="lazy" alt='' src={qr} /> </a>
              </div>
            </div>
          </div>
        </div>

    )
}