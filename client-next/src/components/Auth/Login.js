'use client';
// Login (redesigned 2026-11, concept "From our quarry to your port"). Styles: Auth.css (.au).
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
import { useGlobalState } from '../GlobalStateContext.js';
import { useLang } from '../../context/LangContext';
import { getApiClient } from '../../util/api-lazy';
import { WHATSAPP_URL } from '../Contact/contactData';
import LangLink from '../LangLink';
import PasswordField from './PasswordField';
import { isEmail } from './auth-util';
import './Auth.css';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  const { globalState, setGlobalState, loading } = useGlobalState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  // Already signed in: straight to the account
  useEffect(() => {
    if (!loading && globalState.isLoggedIn) router.replace(`/${lang}/my-account`);
  }, [loading, globalState.isLoggedIn, lang, router]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!isEmail(email)) errs.email = t('auth.errEmail');
    if (!password) errs.password = t('auth.errPasswordEmpty');
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const api = await getApiClient();
      const { data } = await api.post(
        '/api/auth/customer/login',
        { email: email.trim(), password },
        { quiet: true },
      );
      localStorage.setItem('auth_token', data.token);
      setGlobalState({ isLoggedIn: true, ...data });
      router.push(`/${lang}/my-account`);
    } catch (err) {
      const status = err.response?.status;
      setErrors({
        general: !status
          ? t('auth.errNetwork')
          : status === 429
            ? t('auth.errTooMany')
            : t('auth.errLogin'),
      });
      setBusy(false);
    }
  };

  return (
    <div className="au au-login">
      <aside className="au-story au-photo">
        <span className="au-eyebrow">{t('auth.brandLine')}</span>
        <h2>{t('auth.storyTitle')}</h2>
      </aside>
      <section className="au-pane">
        <form className="au-card" onSubmit={submit} noValidate>
          <span className="au-eyebrow">{t('auth.welcomeBack')}</span>
          <h1>{t('auth.loginTitle')}</h1>
          <div className="au-field">
            <label htmlFor="au-email">{t('auth.email')}</label>
            <input
              id="au-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="au-error">{errors.email}</p>}
          </div>
          <PasswordField
            id="au-password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors({});
            }}
            error={errors.password}
            autoComplete="current-password"
          />
          {errors.general && (
            <p className="au-error au-error-box" role="alert">
              {errors.general}
            </p>
          )}
          <button className="au-btn" type="submit" disabled={busy}>
            {busy ? t('auth.signingIn') : t('auth.signIn')}
          </button>
          <p className="au-muted">
            {t('auth.noAccount')}{' '}
            <LangLink href="/signup" className="au-link">
              {t('auth.createAccount')} <span className="au-arrow">→</span>
            </LangLink>
          </p>
          <p className="au-wa">
            <i aria-hidden="true" /> {t('auth.preferTalk')}{' '}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="au-link">
              <FaWhatsapp aria-hidden="true" /> {t('auth.chatWhatsapp')}
            </a>
          </p>
        </form>
      </section>
    </div>
  );
}
