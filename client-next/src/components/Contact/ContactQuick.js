'use client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './ContactIcons';
import { WHATSAPP_URL, MAPS_URL, MAIN_EMAIL, MAIN_PHONE, isOpenNow } from './contactData';

// The 4 quick ways to reach the company, right under the hero (big tap targets on phones),
// with the opening hours and a live "Open now / Closed now" badge (Cairo time).
export default function ContactQuick() {
  const { t } = useTranslation();
  // Worked out in the browser only (the page HTML is built in advance).
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const timer = setInterval(update, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    {
      icon: 'whatsapp',
      title: t('contact.quickWhatsapp'),
      hint: t('contact.quickWhatsappHint'),
      href: WHATSAPP_URL,
      external: true,
      primary: true,
    },
    {
      icon: 'phone',
      title: t('contact.quickCall'),
      hint: MAIN_PHONE.label,
      ltr: true,
      href: `tel:${MAIN_PHONE.tel}`,
    },
    {
      icon: 'mail',
      title: t('contact.quickEmail'),
      hint: MAIN_EMAIL,
      ltr: true,
      href: `mailto:${MAIN_EMAIL}`,
    },
    {
      icon: 'pin',
      title: t('contact.quickVisit'),
      hint: t('contact.directions'),
      href: MAPS_URL,
      external: true,
    },
  ];

  return (
    <section className="cx-quick" aria-label={t('contact.quickLabel')}>
      <ul className="cx-quick-grid">
        {items.map((item) => (
          <li key={item.icon}>
            <a
              className={`cx-quick-card${item.primary ? ' is-primary' : ''}`}
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="cx-quick-icon">
                <Icon name={item.icon} />
              </span>
              <span className="cx-quick-text">
                <span className="cx-quick-title">{item.title}</span>
                <span className="cx-quick-hint" dir={item.ltr ? 'ltr' : undefined}>
                  {item.hint}
                </span>
              </span>
              <Icon name="arrow" className="cx-quick-arrow" />
            </a>
          </li>
        ))}
      </ul>
      <p className="cx-hours">
        <Icon name="clock" />
        <span>{t('contact.hours')}</span>
        {open !== null && (
          <span className={`cx-status ${open ? 'is-open' : 'is-closed'}`}>
            {open ? t('contact.openNow') : t('contact.closedNow')}
          </span>
        )}
      </p>
    </section>
  );
}
