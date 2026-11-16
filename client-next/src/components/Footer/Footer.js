'use client';
import './Footer.css';
import '../Contact/Contact.css';

const wadi_degla_logo_color = '/Assets/Logo-Identity/wadi-degla-logo-color.svg';
const facebook_circle_white_icon = '/Assets/Icons/Social/facebook-circle-white-icon.svg';
const instagram_circle_white_icon = '/Assets/Icons/Social/instagram-circle-white-icon.svg';
// const x_circle_white_icon = '/Assets/Icons/Social/x-circle-white-icon.svg'
const linkedin_circle_white_icon = '/Assets/Icons/Social/linkedin-circle-white-icon.svg';
const whatsapp_circle_white_icon = '/Assets/Icons/Social/whatsapp-circle-white-icon.svg';

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import LangLink from '../LangLink';
import { useLang } from '../../context/LangContext';
import { COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU, menuLinks } from '../../util/site-menu';

// Footer columns: the 3 menus; Projects and Fairs (top-level links in the menu) are listed under Resources.
const FOOTER_COLUMNS = [
  { menu: COMPANY_MENU, extra: [] },
  { menu: PRODUCTS_MENU, extra: [] },
  {
    menu: RESOURCES_MENU,
    extra: [
      { href: '/projects', label: 'navigation.projects' },
      { href: '/fairs', label: 'navigation.fairs' },
    ],
  },
];

function Footer() {
  const router = useRouter();
  const lang = useLang();
  const { t } = useTranslation();
  const footerMainRef = useRef(null);
  const footerRightRef = useRef(null);

  // Dynamically set CSS variable for footer height ratio
  useEffect(() => {
    const updateFooterHeight = () => {
      if (footerRightRef.current && footerMainRef.current) {
        const footerRightHeight = footerRightRef.current.offsetHeight;
        if (footerMainRef.current) {
          footerMainRef.current.style.setProperty(
            '--footer-right-height',
            `${footerRightHeight}px`,
          );
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

  // The pattern behind "Get in touch" (86 KB) is only loaded when the footer comes near the
  // screen (class footer-bg-ready, see Footer.css), not on every page load.
  useEffect(() => {
    const el = footerMainRef.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('footer-bg-ready');
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add('footer-bg-ready');
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function OnClick() {
    router.push(`/${lang}/contact`);
    window.scrollTo({ top: 0 });
  }

  return (
    <footer className="footer-main" ref={footerMainRef}>
      <div className="footer-left">
        <div className="footer-left-bg">
          <h2>{t('footer.getInTouch')}</h2>
          <p>{t('footer.footerParagraph')}</p>

          <button className="btn1" onClick={OnClick}>
            {t('footer.contactUs')}
          </button>
        </div>
      </div>

      <div className="footer-right" ref={footerRightRef}>
        <div className="footer-right-content">
          <div className="footer-about">
            <LangLink
              href="/"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <img loading="lazy" alt="" src={wadi_degla_logo_color} className="logo-color" />
            </LangLink>

            <p>
              {t('footer.welcomePrefix')} <span>{t('footer.companyName')}</span>{' '}
              {t('footer.welcomeSuffix')}
            </p>
          </div>

          <div className="footer-nav">
            {/* Same lists as the top menu (src/util/site-menu.js) */}
            {FOOTER_COLUMNS.map(({ menu, extra }) => (
              <div className="col" key={menu.label}>
                <h4>{t(menu.label)}</h4>
                {[...menuLinks(menu), ...extra].map((item) => (
                  <LangLink key={item.href} href={item.href} onClick={() => window.scrollTo(0, 0)}>
                    {t(item.label)}
                  </LangLink>
                ))}
              </div>
            ))}
            <div className="col">
              <h4>{t('footer.contactHeading')}</h4>
              <LangLink
                href="/contact"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                {t('navigation.contact')}
              </LangLink>
              <div className="social">
                <a
                  href="https://www.facebook.com/wadideglaco"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    alt=""
                    src={facebook_circle_white_icon}
                    className="social-icons-footer"
                  />
                </a>
                <a
                  href="https://instagram.com/wadideglaco"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    alt=""
                    src={instagram_circle_white_icon}
                    className="social-icons-footer"
                  />
                </a>
                {/* <a href='https://twitter.com/wadideglaaco' target="_blank" rel="noopener noreferrer"><img loading="lazy" alt='' src={x_circle_white_icon} className='social-icons-footer'/></a> */}
                <a
                  href="https://www.linkedin.com/company/wadi-degla-co-for-marble-and-granite/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    alt=""
                    src={linkedin_circle_white_icon}
                    className="social-icons-footer"
                  />
                </a>
                <a
                  href="https://wa.me/message/LAQ57AMNJ5ZON1?src=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    loading="lazy"
                    alt=""
                    src={whatsapp_circle_white_icon}
                    className="social-icons-footer"
                  />
                </a>
                {/* social icons placeholder - additional channels can be added here */}
              </div>
            </div>
          </div>
        </div>

        <div className="copy-rights">
          <p>{t('footer.copyRights', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
