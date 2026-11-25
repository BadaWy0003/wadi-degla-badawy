'use client';
import { useTranslation } from 'react-i18next';
import AddressMap from './AddressMap.js';
import Icon from './ContactIcons';
import { EMAILS, PHONES, DOWNLOADS, SOCIALS, QR, MAPS_URL } from './contactData';

const external = { target: '_blank', rel: 'noopener noreferrer' };

// The company's details next to the form (under it on phones): one card per topic.
export default function ContactInfo() {
  const { t } = useTranslation();
  return (
    <aside className="cx-info" aria-labelledby="cx-info-title">
      <div className="cx-section-head">
        <p className="cx-eyebrow">{t('contactInfo.eyebrow')}</p>
        <h2 id="cx-info-title">{t('contactInfo.title')}</h2>
      </div>

      <div className="cx-card">
        <h3 className="cx-card-title">
          <Icon name="mail" />
          {t('contactInfo.email')}
        </h3>
        <ul className="cx-list">
          {EMAILS.map(({ key, email }) => (
            <li key={email}>
              <span className="cx-list-label">{t(key)}</span>
              <a className="cx-list-value" href={`mailto:${email}`} dir="ltr">
                {email}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="cx-card">
        <h3 className="cx-card-title">
          <Icon name="phone" />
          {t('contactInfo.phone')}
        </h3>
        <ul className="cx-list">
          {PHONES.map(({ key, numbers }) => (
            <li key={key}>
              <span className="cx-list-label">{t(key)}</span>
              {numbers.map((n) => (
                <a key={n.tel} className="cx-list-value" href={`tel:${n.tel}`} dir="ltr">
                  {n.label}
                </a>
              ))}
            </li>
          ))}
        </ul>
      </div>

      <div className="cx-card cx-card-visit">
        <h3 className="cx-card-title">
          <Icon name="pin" />
          {t('contactInfo.address')}
        </h3>
        <address className="cx-address">{t('contactInfo.addressLine')}</address>
        <AddressMap title={t('contactInfo.mapTitle')} />
        <a className="cx-btn cx-btn-ghost" href={MAPS_URL} {...external}>
          {t('contact.directions')}
          <Icon name="arrow" />
        </a>
      </div>

      <div className="cx-card">
        <h3 className="cx-card-title">
          <Icon name="file" />
          {t('contactInfo.downloads')}
        </h3>
        <ul className="cx-downloads">
          {DOWNLOADS.map(({ key, href }) => (
            <li key={key}>
              <a href={href} {...external}>
                <span className="cx-file-badge">PDF</span>
                <span className="cx-download-name">{t(key)}</span>
                <Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="cx-card cx-card-social">
        <div>
          <h3 className="cx-card-title">{t('contactInfo.social')}</h3>
          <ul className="cx-social">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a href={s.href} {...external} aria-label={s.name} title={s.name}>
                  <img loading="lazy" alt={s.name} src={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a className="cx-qr" href={QR.href} {...external}>
          <img loading="lazy" src={QR.img} alt="" width="88" height="88" />
          <span>{t('contactInfo.qrInstruction')}</span>
        </a>
      </div>
    </aside>
  );
}
