'use client';
// Signup (redesigned 2026-11, concept "From our quarry to your port"): four short steps drawn
// as the trip of an order. Only step 1 and 2 are required by the server; stones (3) and
// port/address/tax ID (4) are optional and can be filled in later on the account page.
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useGlobalState } from '../GlobalStateContext.js';
import { useLang } from '../../context/LangContext';
import { getApiClient } from '../../util/api-lazy';
import { trackEvent } from '../../util/analytics';
import LangLink from '../LangLink';
import Journey, { STEPS } from './Journey';
import RouteMap from './RouteMap';
import StonePicker from './StonePicker';
import PasswordField from './PasswordField';
import { getCountries, isEmail, passwordOk, phoneOk } from './auth-util';
import './Auth.css';

const EMPTY = {
  fullName: '',
  email: '',
  password: '',
  companyName: '',
  countryCode: '',
  phone: '',
  whatsapp: '',
  sameWhatsapp: true,
  savedStones: [],
  port: '',
  address: '',
  rnc: '',
};

function Field({ id, label, error, children }) {
  return (
    <div className="au-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="au-error">{error}</p>}
    </div>
  );
}

export default function Signup() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  const { globalState, setGlobalState, loading } = useGlobalState();
  const [step, setStep] = useState(0);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const countries = useMemo(() => getCountries(lang), [lang]);
  const country = countries.find((c) => c.code === f.countryCode) || null;

  useEffect(() => {
    if (!loading && globalState.isLoggedIn && !busy) router.replace(`/${lang}/my-account`);
  }, [loading, globalState.isLoggedIn, busy, lang, router]);

  // Each new step: focus its title (screen readers) and show it
  useEffect(() => {
    const title = document.getElementById('au-step-title');
    if (!title || step === 0) return;
    title.focus({ preventScroll: true });
    // phones: the form is under the story panel, so bring the new step into view
    if (
      title.getBoundingClientRect().top < 0 ||
      title.getBoundingClientRect().top > window.innerHeight * 0.6
    )
      title.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [step]);

  const ERROR_OF = { countryCode: 'country' };
  const set = (key) => (value) => {
    setF((prev) => ({ ...prev, [key]: value }));
    // the field's own error goes away as soon as it's changed
    setErrors((prev) => {
      const k = ERROR_OF[key] || key;
      if (!prev[k] && !prev.general) return prev;
      const { [k]: _gone, general: _g, ...rest } = prev;
      return rest;
    });
  };
  const input = (key) => (e) => set(key)(e.target.value);

  const check = (s) => {
    const errs = {};
    if (s === 0) {
      if (f.fullName.trim().length < 2) errs.fullName = t('auth.errName');
      if (!isEmail(f.email)) errs.email = t('auth.errEmail');
      if (!passwordOk(f.password)) errs.password = t('auth.errPassword');
    }
    if (s === 1) {
      if (!f.companyName.trim()) errs.companyName = t('auth.errCompany');
      if (!f.countryCode) errs.country = t('auth.errCountry');
      if (!phoneOk(f.phone)) errs.phone = t('auth.errPhone');
      if (!f.sameWhatsapp && f.whatsapp && !phoneOk(f.whatsapp)) errs.whatsapp = t('auth.errPhone');
    }
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const next = (e) => {
    e?.preventDefault();
    if (!check(step)) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else create();
  };

  const create = async () => {
    setBusy(true);
    const body = {
      fullName: f.fullName.trim(),
      email: f.email.trim(),
      password: f.password,
      companyName: f.companyName.trim(),
      country: country?.english || '',
      countryCode: f.countryCode,
      phone: f.phone,
      whatsapp: f.sameWhatsapp ? f.phone : f.whatsapp,
      savedStones: f.savedStones,
      port: f.port.trim(),
      address: f.address.trim(),
      rnc: f.rnc.trim(),
    };
    try {
      const api = await getApiClient();
      const { data } = await api.post('/api/auth/customer/register', body, { quiet: true });
      localStorage.setItem('auth_token', data.token);
      setGlobalState({ isLoggedIn: true, ...data });
      trackEvent('sign_up', { method: 'email' });
      router.push(`/${lang}/my-account`);
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setStep(0);
        setErrors({ email: t('auth.errEmailTaken') });
      } else {
        setErrors({ general: status ? t('auth.errSignup') : t('auth.errNetwork') });
      }
      setBusy(false);
    }
  };

  const titles = ['s1', 's2', 's3', 's4'][step];
  const last = step === STEPS.length - 1;

  return (
    <div className="au au-signup">
      <aside className="au-story">
        <span className="au-eyebrow">{t('auth.stepOf', { n: step + 1, total: STEPS.length })}</span>
        <h2>{t('auth.storyTitle')}</h2>
        <p className="au-story-text">{t('auth.storyText')}</p>
        <Journey step={step} />
        <RouteMap country={country} />
      </aside>

      <section className="au-pane">
        <form className="au-card" onSubmit={next} noValidate>
          <h1 id="au-step-title" tabIndex={-1}>
            {t(`auth.${titles}Title`)}
          </h1>
          <p className="au-muted">{t(`auth.${titles}Text`)}</p>

          {step === 0 && (
            <>
              <Field id="au-name" label={t('auth.fullName')} error={errors.fullName}>
                <input
                  id="au-name"
                  autoComplete="name"
                  maxLength={60}
                  value={f.fullName}
                  onChange={input('fullName')}
                  aria-invalid={!!errors.fullName}
                />
              </Field>
              <Field id="au-email" label={t('auth.email')} error={errors.email}>
                <input
                  id="au-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={120}
                  value={f.email}
                  onChange={input('email')}
                  aria-invalid={!!errors.email}
                />
              </Field>
              {errors.email === t('auth.errEmailTaken') && (
                <LangLink href="/login" className="au-link">
                  {t('auth.signIn')} <span className="au-arrow">→</span>
                </LangLink>
              )}
              <PasswordField
                id="au-password"
                value={f.password}
                onChange={set('password')}
                error={errors.password}
                showRules
                autoComplete="new-password"
              />
            </>
          )}

          {step === 1 && (
            <>
              <Field id="au-company" label={t('auth.company')} error={errors.companyName}>
                <input
                  id="au-company"
                  autoComplete="organization"
                  maxLength={80}
                  value={f.companyName}
                  onChange={input('companyName')}
                  aria-invalid={!!errors.companyName}
                />
              </Field>
              <Field id="au-country" label={t('auth.country')} error={errors.country}>
                <select
                  id="au-country"
                  value={f.countryCode}
                  onChange={input('countryCode')}
                  aria-invalid={!!errors.country}
                >
                  <option value="">{t('auth.chooseCountry')}</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="au-phone" label={t('auth.phone')} error={errors.phone}>
                <PhoneInput
                  key={`p-${f.countryCode}`}
                  country={(f.countryCode || 'eg').toLowerCase()}
                  value={f.phone}
                  onChange={set('phone')}
                  inputProps={{ id: 'au-phone', autoComplete: 'tel' }}
                  containerClass="au-phone"
                />
              </Field>
              <label className="au-check">
                <input
                  type="checkbox"
                  checked={f.sameWhatsapp}
                  onChange={(e) => set('sameWhatsapp')(e.target.checked)}
                />
                {t('auth.sameWhatsapp')}
              </label>
              {!f.sameWhatsapp && (
                <Field id="au-wa" label={t('auth.whatsappOptional')} error={errors.whatsapp}>
                  <PhoneInput
                    country={(f.countryCode || 'eg').toLowerCase()}
                    value={f.whatsapp}
                    onChange={set('whatsapp')}
                    inputProps={{ id: 'au-wa' }}
                    containerClass="au-phone"
                  />
                </Field>
              )}
            </>
          )}

          {step === 2 && <StonePicker selected={f.savedStones} onChange={set('savedStones')} />}

          {step === 3 && (
            <>
              <Field id="au-port" label={t('auth.port')}>
                <input
                  id="au-port"
                  maxLength={80}
                  value={f.port}
                  onChange={input('port')}
                  placeholder={t('auth.portExample')}
                />
              </Field>
              <Field id="au-address" label={t('auth.address')}>
                <input
                  id="au-address"
                  autoComplete="street-address"
                  maxLength={200}
                  value={f.address}
                  onChange={input('address')}
                />
              </Field>
              <Field id="au-rnc" label={t('auth.taxId')}>
                <input id="au-rnc" maxLength={40} value={f.rnc} onChange={input('rnc')} />
              </Field>
            </>
          )}

          {errors.general && (
            <p className="au-error au-error-box" role="alert">
              {errors.general}
            </p>
          )}

          <div className={step ? 'au-actions' : 'au-actions is-single'}>
            {step > 0 && (
              <button
                type="button"
                className="au-btn au-btn-ghost"
                onClick={() => {
                  setErrors({});
                  setStep(step - 1);
                }}
                disabled={busy}
              >
                {t('auth.back')}
              </button>
            )}
            <button type="submit" className="au-btn" disabled={busy}>
              {busy
                ? t('auth.creating')
                : last
                  ? t('auth.createAccount')
                  : step === 2 && !f.savedStones.length
                    ? t('auth.skip')
                    : t('auth.continue')}
            </button>
          </div>
          {step === 0 && (
            <p className="au-muted">
              {t('auth.haveAccount')}{' '}
              <LangLink href="/login" className="au-link">
                {t('auth.signIn')}
              </LangLink>
            </p>
          )}
          {last && <p className="au-muted au-small">{t('auth.laterNote')}</p>}
        </form>
      </section>
    </div>
  );
}
