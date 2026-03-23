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
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function ContactInfo() {
  const { t } = useTranslation();
  return (
    <div className="contact-inner-right">
      <h2>{t('contactInfo.title')}</h2>
      <div className="contact-info">
        <div className="email-address">
          <h4>{t('contactInfo.email')}</h4>
          <p>{t('contactInfo.emailHomes')}</p>
          <a href="mailto:sales@wadidegla-eg.com">sales@wadidegla-eg.com</a>
          <p>{t('contactInfo.emailProjects')}</p>
          <a href="mailto:projects@wadidegla-eg.com">projects@wadidegla-eg.com</a>
          <p>{t('contactInfo.emailExport')}</p>
          <a href="mailto:export@wadidegla-eg.com">export@wadidegla-eg.com</a>
          <p>{t('contactInfo.emailInfo')}</p>
          <a href="mailto:info@wadidegla-eg.com">info@wadidegla-eg.com</a>
        </div>

        <div className="phone-numbers">
          <h4>{t('contactInfo.phone')}</h4>
          <p>{t('contactInfo.phoneHeadOffice')}</p>
          <a href="tel:+201067260314">(+20) 10-6726-0314</a>
          <a href="tel:+201155559896">(+20) 11-5555-9896</a>
          <p>{t('contactInfo.phoneSupport')}</p>
          <a href="tel:+201016667890">(+20) 101-666-7890</a>
        </div>
        <div className="location">
          <h4>{t('contactInfo.address')}</h4>
          <a href='https://maps.app.goo.gl/bM4qT3UBLVt3r7tN7' target="_blank" rel="noopener noreferrer">
            36, 241D Shaq Althoaban Industrial
            Area for Marble & Granite, Tourrah,
            Cairo, Egypt
          </a>
          <AddressMap />
        </div>
        <div className="social">
          <h4>{t('contactInfo.social')}</h4>
          <div className='social-icons'>
            <a href='https://www.facebook.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={facebook_circle_white_icon} className='social-icons-footer' /></a>
            <a href='https://instagram.com/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={instagram_circle_white_icon} className='social-icons-footer' /></a>
            {/* <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={x_circle_white_icon} className='social-icons-footer' /></a> */}
            <a href='https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={linkedin_circle_white_icon} className='social-icons-footer' /></a>
            <a href='https://wa.me/message/LAQ57AMNJ5ZON1?src=qr' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={whatsapp_circle_white_icon} className='social-icons-footer' /></a>
            <a href='https://t.me/wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={telegram_circle_white_icon} className='social-icons-footer' /></a>
            <a href='https://www.tiktok.com/@wadideglaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={tiktok_circle_white_icon} className='social-icons-footer' /></a>
          </div>
          <a href='https://drive.google.com/file/d/1cr1xARl2DO_dmVo2NUaZrP6mJ0FyNHUa/view' target="_blank" rel="noopener noreferrer"> <button className='btn2'>
            {t('contactInfo.companyProfile')}</button> </a>
          <a href='https://drive.google.com/file/d/17sczDrWJN8pWQ4EPHMdIeh30TLbXYh-l/view?usp=sharing' target="_blank" rel="noopener noreferrer"> <button className='btn1'>
            {t('contactInfo.specialCatalogue')}</button> </a>
          <h4>{t('contactInfo.qrInstruction')}</h4>
          <div>
            <a id="qr-code" href='https://wadideg.social/' target="_blank" rel="noopener noreferrer"> <img loading="lazy" alt='' src={qr} /> </a>
          </div>
        </div>
      </div>
    </div>
  )
}