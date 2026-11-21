'use client';
// Cookie banner (2026-11-21): asks European visitors before Google Analytics stores its
// cookies (see src/util/consent.js). Shown after the page has loaded, so the built HTML (and
// Google) never contains it; "Cookie settings" in the footer opens it again for anyone.
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';
import { readConsent, saveConsent, inEurope, OPEN_SETTINGS_EVENT } from '../../util/consent';
import './CookieBanner.css';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent() && inEurope()) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, show);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, show);
  }, []);

  if (!open) return null;
  const choose = (value) => {
    saveConsent(value);
    setOpen(false);
  };
  return (
    <section className="ck" role="dialog" aria-live="polite" aria-label={t('cookies.title')}>
      <div className="ck-text">
        <p className="ck-title">{t('cookies.title')}</p>
        <p>
          {t('cookies.text')}{' '}
          <LangLink href="/privacy" className="ck-link">
            {t('cookies.privacy')}
          </LangLink>
        </p>
      </div>
      <div className="ck-actions">
        <button type="button" className="ck-btn ck-btn-line" onClick={() => choose('denied')}>
          {t('cookies.decline')}
        </button>
        <button type="button" className="ck-btn ck-btn-gold" onClick={() => choose('granted')}>
          {t('cookies.accept')}
        </button>
      </div>
    </section>
  );
}
