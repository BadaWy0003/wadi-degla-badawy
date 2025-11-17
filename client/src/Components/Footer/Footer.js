import './Footer.css'
import "../Contact/Contact.css";

import { Link } from "react-router-dom";
import wadi_degla_logo_color from '../../Public/Assets/Logo-Identity/wadi-degla-logo-color.svg'
import facebook_circle_white_icon from '../../Public/Assets/Icons/Social/facebook-circle-white-icon.svg'
import instagram_circle_white_icon from '../../Public/Assets/Icons/Social/instagram-circle-white-icon.svg'
// import x_circle_white_icon from '../../Public/Assets/Icons/Social/x-circle-white-icon.svg'
import linkedin_circle_white_icon from '../../Public/Assets/Icons/Social/linkedin-circle-white-icon.svg'
import whatsapp_circle_white_icon from '../../Public/Assets/Icons/Social/whatsapp-circle-white-icon.svg'

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../i18n';

function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const footerMainRef = useRef(null);
  const footerRightRef = useRef(null);

  // Dynamically set CSS variable for footer height ratio
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRightRef.current && footerMainRef.current) {
        const footerRightHeight = footerRightRef.current.offsetHeight;
        if (footerMainRef.current) {
          footerMainRef.current.style.setProperty('--footer-right-height', `${footerRightHeight}px`);
        }
      }
    };

    // Update on mount
    updateFooterHeight();

    // Update on window resize
    window.addEventListener('resize', updateFooterHeight);

    // Update on content change (with a small delay to ensure DOM is updated)
    const observer = new MutationObserver(updateFooterHeight);
    if (footerMainRef.current) {
      observer.observe(footerMainRef.current, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', updateFooterHeight);
      observer.disconnect();
    };
  }, []);

  function OnClick(){
    navigate('/contact'); 
    window.scrollTo({top: 0});
  }

  return (
    <footer className='footer-main' ref={footerMainRef}>
      <div className='footer-left'>
        <div className='footer-left-bg'>
          <h2>{t('footer.getInTouch')}</h2>
          <p>{t('footer.footerParagraph')}</p>

          <button 
            className='btn1'
            onClick={OnClick}> 
            {t('footer.contactUs')}
          </button>

        </div>
      </div>

      <div className='footer-right' ref={footerRightRef}>
        <div className='footer-right-content'>
          <div className='footer-about'>
            <Link to='/' onClick={() => {window.scrollTo(0, 0);}}>
              <img loading="lazy" alt='' src={wadi_degla_logo_color} className='logo-color'/>
            </Link>

            <p>
              {t('footer.welcomePrefix')} <span>{t('footer.companyName')}</span> {t('footer.welcomeSuffix')}
            </p>
          </div>

          <div className='footer-nav'>
            <div className="col">
              <h4>{t('navigation.wadiDegla')}</h4>
              <Link to='/history' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.history')}</Link>
              <Link to='/machinery' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.machinery')}</Link>
              <Link to='/certificates' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.certificates')}</Link>
              <Link to='/exports' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.exports')}</Link>
              <Link to='/packing' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.packing')}</Link>
              <Link to='/about' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.whyChooseUs')}</Link>
            </div>

            <div className="col">
              <h4>{t('footer.explore')}</h4>
              <Link to='/products' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.exploreProducts')}</Link>
              <Link to='/visualizer' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.materialVisualizer')}</Link>
              <Link to='/patterns' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.patterns')}</Link>
              <Link to='/kerbstone' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.kerbstone')}</Link>
              <Link to='/Cobbles' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.cobbles')}</Link>
              <Link to='/Stone Creations' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.stoneCreations')}</Link>
            </div>

            <div className="col">
              <h4>{t('navigation.resources')}</h4>
              <Link to='/quarries' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.quarries')}</Link>
              <Link to='/inspiration' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.inspiration')}</Link>
              <Link to='/gallery' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.gallery')}</Link>
              <Link to='/partners' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.partners')}</Link>
              <Link to='/projects' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.projects')}</Link>
              <Link to='/fairs' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.fairs')}</Link>
              <Link to='/news' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.news')}</Link>
            </div>

            <div className="col">
              <h4>{t('footer.contactHeading')}</h4>
              <Link to='/contact' onClick={() => {window.scrollTo(0, 0);}}>{t('navigation.contact')}</Link>
              <div className='social'>
                <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={facebook_circle_white_icon} className='social-icons-footer'/></a>
                <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={instagram_circle_white_icon} className='social-icons-footer'/></a>
                {/* <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={x_circle_white_icon} className='social-icons-footer'/></a> */}
                <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={linkedin_circle_white_icon} className='social-icons-footer'/></a>
                <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={whatsapp_circle_white_icon} className='social-icons-footer'/></a>
                {/* social icons placeholder - additional channels can be added here */}
              </div>
            </div>

          </div>
        </div>

        <div className='copy-rights'>
          <p>{t('footer.copyRights', { year: new Date().getFullYear() })}</p>
        </div>

      </div>

    </footer>
  )
}


export default Footer;



