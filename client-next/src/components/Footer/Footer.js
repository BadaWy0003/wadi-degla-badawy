'use client';
// The site footer (redesigned 2026-11-17, owner chose design A "Directory"), scoped under .wf,
// dark + gold like the header. Left: logo, one line about the company, the contact details
// (phone, WhatsApp, email, address, hours with a live Open/Closed badge: the same details as
// the Contact page and the Organization JSON-LD, all from Contact/contactData.js) and the
// social links. Right: the 3 menus from site-menu.js (on phones they fold, one open at a time;
// the links are always in the HTML for Google). Bottom: ©, ISO badge, language picker and
// "Back to top". It fades in when scrolled to (not with reduced motion).
// The old "Get in touch" box is gone: every page ends with its own WhatsApp band.
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaTiktok,
  FaArrowUp,
} from 'react-icons/fa';
import LangLink from '../LangLink';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import {
  WHATSAPP_URL,
  MAPS_URL,
  MAIN_EMAIL,
  MAIN_PHONE,
  SOCIALS,
  isOpenNow,
} from '../Contact/contactData';
import { COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU, menuLinks } from '../../util/site-menu';
import './Footer.css';

const LOGO = '/Assets/Logo-Identity/wadi-degla-logo-color.svg';

// Projects and Fairs are top-level items in the header; in the footer they sit under Resources.
const COLUMNS = [
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

const SOCIAL_ICONS = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegramPlane,
  TikTok: FaTiktok,
};

export default function Footer() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [openCol, setOpenCol] = useState(-1);
  // worked out in the browser only (the HTML is built in advance)
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const timer = setInterval(update, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // fade in when scrolled to; the hiding class is added only after the page loads
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined;
    el.classList.add('wf-hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.remove('wf-hidden');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const contacts = [
    {
      icon: FaPhoneAlt,
      label: t('contact.quickCall'),
      value: MAIN_PHONE.label,
      href: `tel:${MAIN_PHONE.tel}`,
      ltr: true,
    },
    {
      icon: FaWhatsapp,
      label: t('contact.quickWhatsapp'),
      value: t('contact.quickWhatsappHint'),
      href: WHATSAPP_URL,
      external: true,
    },
    {
      icon: FaEnvelope,
      label: t('contact.quickEmail'),
      value: MAIN_EMAIL,
      href: `mailto:${MAIN_EMAIL}`,
      ltr: true,
    },
    {
      icon: FaMapMarkerAlt,
      label: t('contact.quickVisit'),
      value: t('contactInfo.addressLine'),
      href: MAPS_URL,
      external: true,
    },
  ];

  return (
    <footer className="wf" ref={ref}>
      <div className="wf-wrap wf-main">
        <div className="wf-brand">
          <LangLink href="/" className="wf-logo" aria-label={t('footer.companyName')}>
            <img loading="lazy" src={LOGO} alt="Wadi Degla" width="150" height="42" />
          </LangLink>
          <p className="wf-tagline">{t('footer.tagline')}</p>

          <ul className="wf-contacts">
            {contacts.map(({ icon: Ico, label, value, href, ltr, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="wf-ico" aria-hidden="true">
                    <Ico />
                  </span>
                  <span className="wf-contact-text">
                    <small>{label}</small>
                    <span dir={ltr ? 'ltr' : undefined}>{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="wf-hours">
            <FaClock aria-hidden="true" />
            <span>{t('contact.hours')}</span>
            {open !== null && (
              <span className={`wf-status ${open ? 'is-open' : 'is-closed'}`}>
                {open ? t('contact.openNow') : t('contact.closedNow')}
              </span>
            )}
          </p>

          <ul className="wf-social" aria-label={t('footer.follow')}>
            {SOCIALS.map((s) => {
              const Ico = SOCIAL_ICONS[s.name];
              return (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                    {Ico && <Ico aria-hidden="true" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="wf-cols">
          {COLUMNS.map(({ menu, extra }, i) => {
            const isOpen = openCol === i;
            const id = `wf-col-${i}`;
            return (
              <div className={`wf-col${isOpen ? ' is-open' : ''}`} key={menu.label}>
                <button
                  type="button"
                  className="wf-col-title"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpenCol(isOpen ? -1 : i)}
                >
                  <span>{t(menu.label)}</span>
                  <i className="wf-chev" aria-hidden="true" />
                </button>
                <ul className="wf-links" id={id}>
                  {[...menuLinks(menu), ...extra].map((item) => (
                    <li key={item.href}>
                      <LangLink href={item.href}>{t(item.label)}</LangLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wf-bottom">
        <div className="wf-wrap wf-bottom-in">
          <p className="wf-copy">{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <LangLink href="/certificates" className="wf-iso">
            <span aria-hidden="true">✓</span> {t('footer.iso')}
          </LangLink>
          <div className="wf-tools">
            <LanguageSelector up />
            <button
              type="button"
              className="wf-top"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                })
              }
            >
              <span>{t('footer.backToTop')}</span>
              <FaArrowUp aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
