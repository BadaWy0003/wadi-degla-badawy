'use client';
// Cookie banner (2026-11-21; for every visitor since 2026-11-27, owner). Shown after the page
// has loaded, so the built HTML (and Google) never contains it (see src/util/consent.js).
// - Europe/UK (by the visitor's clock): Google Analytics stores nothing until "Accept".
// - Everywhere else: a short notice; statistics are on unless the visitor presses "Decline".
// Once a choice is made, a small round cookie button stays in the bottom-left corner of every
// page to open the banner again (the footer's "Cookie settings" does the same).
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCookieBite } from 'react-icons/fa';
import LangLink from '../LangLink';
import { readConsent, saveConsent, inEurope, OPEN_SETTINGS_EVENT } from '../../util/consent';
import './CookieBanner.css';

export default function CookieBanner() {
  const { t } = useTranslation();
  // null until the page has loaded (nothing is shown in the built HTML)
  const [state, setState] = useState(null);

  useEffect(() => {
    setState({ open: !readConsent(), europe: inEurope() });
    const show = () => setState((s) => ({ ...(s || { europe: inEurope() }), open: true }));
    window.addEventListener(OPEN_SETTINGS_EVENT, show);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, show);
  }, []);

  if (!state) return null;
  if (!state.open) {
    return (
      <button
        type="button"
        className="ck-fab"
        onClick={() => setState({ ...state, open: true })}
        aria-label={t('footer.cookieSettings')}
        title={t('footer.cookieSettings')}
      >
        <FaCookieBite aria-hidden="true" />
      </button>
    );
  }
  const choose = (value) => {
    saveConsent(value);
    setState({ ...state, open: false });
  };
  return (
    <section className="ck" role="dialog" aria-live="polite" aria-label={t('cookies.title')}>
      <div className="ck-text">
        <p className="ck-title">
          <FaCookieBite aria-hidden="true" className="ck-icon" /> {t('cookies.title')}
        </p>
        <p>
          {t(state.europe ? 'cookies.text' : 'cookies.textWorld')}{' '}
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
          {t(state.europe ? 'cookies.accept' : 'cookies.ok')}
        </button>
      </div>
    </section>
  );
}
