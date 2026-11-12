'use client';
// Account page (redesigned 2026-11 with the login/signup): saved stones (pick, remove, open
// the stone's page to request a sample), company details (port/address/tax ID are optional
// at signup and can be completed here), WhatsApp, log out. Styles: Auth/Auth.css (.au).
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useGlobalState } from '../GlobalStateContext.js';
import { useLang } from '../../context/LangContext';
import { getApiClient } from '../../util/api-lazy';
import { productSlug } from '../../util/product-slugs';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { WHATSAPP_URL } from '../Contact/contactData';
import LangLink from '../LangLink';
import StonePicker from '../Auth/StonePicker';
import { flagUrl, getCountries, loadStones, phoneOk } from '../Auth/auth-util';
import '../Auth/Auth.css';

const PROFILE_KEYS = ['companyName', 'countryCode', 'whatsapp', 'port', 'address', 'rnc'];

export default function MyAccount() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  const { globalState: me, setGlobalState, loading } = useGlobalState();
  const [stones, setStones] = useState([]);
  const [picking, setPicking] = useState(false);
  const [saved, setSaved] = useState(null); // ids while editing
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({}); // { stones|profile: 'saving' | 'saved' | 'error' }
  const countries = useMemo(() => getCountries(lang), [lang]);

  useEffect(() => {
    if (!loading && !me.isLoggedIn) router.replace(`/${lang}/login`);
  }, [loading, me.isLoggedIn, lang, router]);

  useEffect(() => {
    loadStones()
      .then(setStones)
      .catch(() => setStones([]));
  }, []);

  useEffect(() => {
    if (!me.isLoggedIn) return;
    setSaved(me.savedStones || []);
    setProfile(Object.fromEntries(PROFILE_KEYS.map((k) => [k, me[k] || ''])));
  }, [me]);

  if (loading || !me.isLoggedIn || !profile) {
    return <div className="au au-account is-loading" aria-busy="true" />;
  }

  const update = async (part, body) => {
    setStatus((s) => ({ ...s, [part]: 'saving' }));
    try {
      const api = await getApiClient();
      const { data } = await api.put('/api/customer/me/edit', body, { quiet: true });
      setGlobalState((prev) => ({ ...prev, ...data, isLoggedIn: true }));
      setStatus((s) => ({ ...s, [part]: 'saved' }));
      return true;
    } catch {
      setStatus((s) => ({ ...s, [part]: 'error' }));
      return false;
    }
  };

  const saveStones = (ids) => {
    setSaved(ids);
    update('stones', { savedStones: ids });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (!profile.companyName.trim()) return setStatus((s) => ({ ...s, profile: 'company' }));
    if (profile.whatsapp && !phoneOk(profile.whatsapp))
      return setStatus((s) => ({ ...s, profile: 'whatsapp' }));
    const c = countries.find((x) => x.code === profile.countryCode);
    update('profile', {
      companyName: profile.companyName.trim(),
      ...(c ? { country: c.english, countryCode: c.code } : {}),
      whatsapp: profile.whatsapp,
      port: profile.port.trim(),
      address: profile.address.trim(),
      rnc: profile.rnc.trim(),
    });
  };

  const logout = async () => {
    try {
      const api = await getApiClient();
      await api.post('/api/auth/logout');
    } catch {
      // the token is removed below either way
    }
    localStorage.removeItem('auth_token');
    setGlobalState({ isLoggedIn: false });
    router.push(`/${lang}/login`);
  };

  const byId = Object.fromEntries(stones.map((s) => [s.id, s]));
  const mine = saved.map((id) => byId[id]).filter(Boolean);
  const country = countries.find((c) => c.code === (me.countryCode || '').toUpperCase());
  const done = ['port', 'address', 'rnc', 'whatsapp'].filter((k) => me[k]).length;
  const input = (key) => ({
    value: profile[key],
    onChange: (e) => {
      setProfile((p) => ({ ...p, [key]: e.target.value }));
      setStatus((s) => ({ ...s, profile: undefined }));
    },
  });
  const note = (part) =>
    status[part] === 'saved' ? (
      <span className="au-ok">{t('auth.savedOk')}</span>
    ) : status[part] === 'error' ? (
      <span className="au-error">{t('auth.saveError')}</span>
    ) : null;

  return (
    <div className="au au-account">
      <div className="au-hello">
        <div>
          <span className="au-eyebrow">{t('auth.yourAccount')}</span>
          <h1>{t('auth.hello', { name: me.fullName?.split(' ')[0] || '' })}</h1>
          <p className="au-muted">
            {me.companyName}
            {country && (
              <>
                {' · '}
                <img src={flagUrl(country.code)} alt="" width="18" height="13" /> {country.name}
              </>
            )}
          </p>
        </div>
        <div className="au-hello-actions">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="au-btn">
            <FaWhatsapp aria-hidden="true" /> {t('auth.chatWhatsapp')}
          </a>
          <button type="button" className="au-btn au-btn-ghost" onClick={logout}>
            {t('auth.logout')}
          </button>
        </div>
      </div>

      <section className="au-panel">
        <div className="au-panel-head">
          <div>
            <h2>{t('auth.savedTitle')}</h2>
            <p className="au-muted">{t('auth.savedText')}</p>
          </div>
          <div className="au-panel-tools">
            {note('stones')}
            <button
              type="button"
              className="au-btn au-btn-ghost"
              onClick={() => setPicking((v) => !v)}
            >
              {picking ? t('auth.done') : t('auth.addStones')}
            </button>
          </div>
        </div>
        {picking ? (
          <StonePicker selected={saved} onChange={saveStones} />
        ) : mine.length ? (
          <ul className="au-saved">
            {mine.map((s) => (
              <li key={s.id}>
                <LangLink href={`/products/${productSlug(s.name)}`} className="au-saved-card">
                  <img src={s.img} alt="" loading="lazy" width="240" height="240" />
                  <span className="au-saved-body">
                    <small>{t(PRODUCT_TYPE_KEYS[s.type])}</small>
                    <b>{s.name}</b>
                    <span className="au-link">
                      {t('auth.requestSample')} <span className="au-arrow">→</span>
                    </span>
                  </span>
                </LangLink>
                <button
                  type="button"
                  className="au-remove"
                  aria-label={`${t('auth.remove')} ${s.name}`}
                  onClick={() => saveStones(saved.filter((x) => x !== s.id))}
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="au-empty">{t('auth.savedEmpty')}</p>
        )}
      </section>

      <section className="au-panel">
        <div className="au-panel-head">
          <div>
            <h2>{t('auth.companyTitle')}</h2>
            <p className="au-muted">{t('auth.companyText')}</p>
          </div>
          <span className="au-meter" style={{ '--au-meter': done / 4 }}>
            {t('auth.profileDone', { done, total: 4 })}
          </span>
        </div>
        <form className="au-grid" onSubmit={saveProfile} noValidate>
          <div className="au-field">
            <label htmlFor="ac-company">{t('auth.company')}</label>
            <input id="ac-company" maxLength={80} {...input('companyName')} />
            {status.profile === 'company' && <p className="au-error">{t('auth.errCompany')}</p>}
          </div>
          <div className="au-field">
            <label htmlFor="ac-country">{t('auth.country')}</label>
            <select id="ac-country" {...input('countryCode')}>
              <option value="">{t('auth.chooseCountry')}</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="au-field">
            <label htmlFor="ac-wa">{t('auth.whatsappDigits')}</label>
            <input id="ac-wa" inputMode="numeric" maxLength={15} {...input('whatsapp')} />
            {status.profile === 'whatsapp' && <p className="au-error">{t('auth.errPhone')}</p>}
          </div>
          <div className="au-field">
            <label htmlFor="ac-port">{t('auth.port')}</label>
            <input
              id="ac-port"
              maxLength={80}
              placeholder={t('auth.portExample')}
              {...input('port')}
            />
          </div>
          <div className="au-field">
            <label htmlFor="ac-address">{t('auth.address')}</label>
            <input id="ac-address" maxLength={200} {...input('address')} />
          </div>
          <div className="au-field">
            <label htmlFor="ac-rnc">{t('auth.taxId')}</label>
            <input id="ac-rnc" maxLength={40} {...input('rnc')} />
          </div>
          <dl className="au-fixed">
            <div>
              <dt>{t('auth.email')}</dt>
              <dd>{me.email}</dd>
            </div>
            <div>
              <dt>{t('auth.phone')}</dt>
              <dd dir="ltr">+{me.phone}</dd>
            </div>
          </dl>
          <div className="au-grid-actions">
            {note('profile')}
            <button type="submit" className="au-btn" disabled={status.profile === 'saving'}>
              {t('auth.save')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
