'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Contact.css';
import '../LoginSignup/Signup.css';

import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import PhoneInput from 'react-phone-input-2';
import { sourceForForm } from '../../util/visit-source';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import { useGlobalState } from '../GlobalStateContext.js';
import { trackEvent } from '../../util/analytics';
import { useLang } from '../../context/LangContext';
import Icon from './ContactIcons';
import { WHATSAPP_URL } from './contactData';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // same limit as the server (routes/sendEmail.js)
const PHONE_RE = /^\d{8,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  fname: '',
  cname: '',
  email: '',
  phone: '',
  whatsapp: '',
  country: null,
  address: '',
  port: '',
  message: '',
  attachment: null,
};

// Order used to move the cursor to the first field with a problem.
const FIELD_ORDER = ['fname', 'email', 'phone', 'country', 'message', 'whatsapp', 'attachment'];

// `quote` (the quote page, src/components/Quote/Quote.js): { items, onSent }. The form then
// sends the chosen stones with the message (kind "quote"), the message becomes optional and the
// title and button change. Everything else (fields, checks, file, emails) is the same.
export default function ContactForm({ quote = null }) {
  const { t } = useTranslation();
  const { globalState, loading } = useGlobalState();
  const lang = useLang();
  const countryOptions = useMemo(() => countryList().getData(), []);

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [failMessage, setFailMessage] = useState('');
  // Phones: the optional fields are folded away until asked for (always shown on desktop).
  const [moreOpen, setMoreOpen] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  // The phone fields' country-flag buttons (react-phone-input-2) have no name of their own;
  // give them one for screen readers.
  useEffect(() => {
    formRef.current
      ?.querySelectorAll('.selected-flag')
      .forEach((el) => el.setAttribute('aria-label', t('contactForm.phoneCountry')));
  });

  // Pre-fill for logged-in customers
  useEffect(() => {
    if (!loading && globalState.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        fname: globalState.fullName || '',
        cname: globalState.companyName || '',
        email: globalState.email || '',
        phone: globalState.phone || '',
        whatsapp: globalState.whatsapp || '',
        country: countryOptions.find((o) => o.label === globalState.country) || null,
        address: globalState.address || '',
        port: globalState.port || '',
      }));
    }
  }, [globalState, loading, countryOptions]);

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as it is edited.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    const required = t('contactForm.errorRequired');
    if (!formData.fname.trim()) e.fname = required;
    if (!formData.email.trim()) e.email = required;
    else if (!EMAIL_RE.test(formData.email.trim())) e.email = t('contactForm.errorEmail');
    if (!formData.phone) e.phone = required;
    else if (!PHONE_RE.test(formData.phone)) e.phone = t('contactForm.errorPhone');
    if (!formData.country) e.country = t('contactForm.errorCountry');
    if (!quote && !formData.message.trim()) e.message = required;
    if (formData.whatsapp && !PHONE_RE.test(formData.whatsapp)) {
      e.whatsapp = t('contactForm.errorWhatsapp');
    }
    if (formData.attachment && formData.attachment.size > MAX_FILE_BYTES) {
      e.attachment = t('contactForm.errorFileSize');
    }
    return e;
  };

  const focusFirstError = (e) => {
    const first = FIELD_ORDER.find((f) => e[f]);
    if (!first) return;
    if (first === 'whatsapp') setMoreOpen(true);
    const el = formRef.current?.querySelector(
      `[data-field="${first}"] input, [data-field="${first}"] textarea`,
    );
    el?.focus({ preventScroll: true });
    el?.closest('[data-field]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const clearFile = () => {
    setField('attachment', null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'sending') return;
    const e = validate();
    if (Object.keys(e).some((k) => e[k])) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    setErrors({});
    setStatus('sending');

    const payload = new FormData();
    payload.append('name', formData.fname.trim());
    payload.append('email', formData.email.trim());
    const items = quote?.items || [];
    payload.append(
      'subject',
      quote
        ? `Quote request from ${formData.fname.trim()} (${items.length} stone${items.length === 1 ? '' : 's'})`
        : `Contact Form Submission from ${formData.fname.trim()}`,
    );
    payload.append('message', formData.message);
    // Spam trap: hidden field that only bots fill in
    payload.append('website', ev.target.elements.website?.value || '');
    payload.append(
      'extraFields',
      `
      <p><strong>Company/Project:</strong> ${formData.cname}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>WhatsApp:</strong> ${formData.whatsapp}</p>
      <p><strong>Country:</strong> ${formData.country?.label}</p>
      <p><strong>Address:</strong> ${formData.address}</p>
      <p><strong>Port of Destination:</strong> ${formData.port}</p>
      ${
        quote
          ? `<p><strong>Stones:</strong></p><ul>${items
              .map((i) => `<li>${[i.name, i.finish, i.quantity].filter(Boolean).join(' – ')}</li>`)
              .join('')}</ul>`
          : ''
      }
    `,
    );
    // The same details as separate fields, for the admin panel's Enquiries inbox
    const fields = {
      kind: quote ? 'quote' : 'contact',
      company: formData.cname,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      country: formData.country?.label || '',
      address: formData.address,
      port: formData.port,
      page: window.location.pathname,
      lang: document.documentElement.lang || '',
      source: sourceForForm(),
    };
    Object.entries(fields).forEach(([k, v]) => payload.append(k, v || ''));
    if (quote) {
      payload.append(
        'items',
        JSON.stringify(items.map(({ name, finish, quantity }) => ({ name, finish, quantity }))),
      );
    }
    if (formData.attachment) payload.append('attachment', formData.attachment);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/send-email`, {
        method: 'POST',
        body: payload,
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setStatus('sent');
        if (quote) {
          trackEvent('quote_request_sent', { stone_count: items.length });
          quote.onSent?.();
        } else {
          trackEvent('contact_form_sent');
        }
        setFormData(EMPTY);
        if (fileRef.current) fileRef.current.value = '';
        formRef.current
          ?.closest('.cx-form-card')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setFailMessage(t('contactForm.errorGeneric'));
        setStatus('failed');
      }
    } catch {
      setFailMessage(t('contactForm.errorConnection'));
      setStatus('failed');
    }
  };

  // Props shared by every field wrapper: error state + the id of its error text.
  const fieldProps = (name, extra = '') => ({
    className: `cx-field${errors[name] ? ' has-error' : ''}${extra ? ` ${extra}` : ''}`,
    'data-field': name,
  });
  const errorText = (name) =>
    errors[name] ? (
      <p className="cx-field-error" id={`${name}-error`}>
        <Icon name="alert" />
        {errors[name]}
      </p>
    ) : null;
  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);
  const optional = <span className="cx-optional">{t('contactForm.optional')}</span>;

  if (status === 'sent') {
    return (
      <section className="cx-form-card cx-sent" aria-live="polite">
        <span className="cx-sent-icon">
          <Icon name="check" />
        </span>
        <h2>{t('contactForm.successMessage')}</h2>
        <p>{t('contactForm.subtitle')}</p>
        <div className="cx-sent-actions">
          <a
            className="cx-btn cx-btn-ghost"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" />
            {t('contactForm.fasterReply')}
          </a>
          <button type="button" className="cx-btn cx-btn-link" onClick={() => setStatus('idle')}>
            {t('contactForm.sendAnother')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="cx-form-card" aria-labelledby="cx-form-title">
      <div className="cx-section-head">
        <p className="cx-eyebrow">{t(quote ? 'quote.eyebrow' : 'contactForm.eyebrow')}</p>
        <h2 id="cx-form-title">{t(quote ? 'quote.formTitle' : 'contactForm.title')}</h2>
        <p className="cx-section-sub">{t(quote ? 'quote.formSubtitle' : 'contactForm.subtitle')}</p>
      </div>

      <form ref={formRef} className="cx-form" onSubmit={handleSubmit} noValidate>
        {/* Spam trap: hidden from people, bots tend to fill it in */}
        <input
          type="text"
          name="website"
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
        />

        <div className="cx-grid">
          <div {...fieldProps('fname')}>
            <label htmlFor="fname">{t('contactForm.fullName')}</label>
            <input
              type="text"
              id="fname"
              name="fname"
              autoComplete="name"
              value={formData.fname}
              onChange={(e) => setField('fname', e.target.value)}
              aria-invalid={!!errors.fname}
              aria-describedby={describedBy('fname')}
              required
            />
            {errorText('fname')}
          </div>

          <div {...fieldProps('email')}>
            <label htmlFor="email">{t('contactForm.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              dir="ltr"
              autoComplete="email"
              inputMode="email"
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy('email')}
              required
            />
            {errorText('email')}
          </div>

          <div {...fieldProps('phone', 'cx-phone')}>
            <label htmlFor="phone">{t('contactForm.phone')}</label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => setField('phone', value)}
              placeholder="+20 100 000 0000"
              inputProps={{
                id: 'phone',
                name: 'phone',
                required: true,
                autoComplete: 'tel',
                'aria-invalid': !!errors.phone,
                'aria-describedby': describedBy('phone'),
              }}
            />
            {errorText('phone')}
          </div>

          <div {...fieldProps('country')}>
            <label htmlFor="country">{t('contactForm.country')}</label>
            <Select
              inputId="country"
              isRtl={lang === 'ar'}
              options={countryOptions}
              value={formData.country}
              classNamePrefix="react-select"
              onChange={(value) => setField('country', value)}
              placeholder={t('contactForm.searchCountry')}
              aria-invalid={!!errors.country}
              aria-describedby={describedBy('country')}
            />
            {errorText('country')}
          </div>

          <div {...fieldProps('message', 'cx-span-2')}>
            <label htmlFor="message">
              {t('contactForm.message')} {quote && optional}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t('contactForm.messagePlaceholder')}
              value={formData.message}
              onChange={(e) => setField('message', e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy('message')}
              required={!quote}
            />
            {errorText('message')}
          </div>
        </div>

        <div
          className={`cx-more${moreOpen ? ' is-open' : ''}`}
          role="group"
          aria-labelledby="cx-more-label"
        >
          <button
            type="button"
            className="cx-more-toggle"
            aria-expanded={moreOpen}
            aria-controls="cx-more-fields"
            onClick={() => setMoreOpen((v) => !v)}
          >
            <span id="cx-more-label">{t('contactForm.moreDetails')}</span>
            {optional}
            <Icon name="chevron" />
          </button>
          <div className="cx-grid" id="cx-more-fields">
            <div {...fieldProps('cname')}>
              <label htmlFor="cname">{t('contactForm.companyProject')}</label>
              <input
                type="text"
                id="cname"
                name="cname"
                autoComplete="organization"
                value={formData.cname}
                onChange={(e) => setField('cname', e.target.value)}
              />
            </div>

            <div {...fieldProps('whatsapp', 'cx-phone')}>
              <label htmlFor="whatsapp">{t('contactForm.whatsapp')}</label>
              <PhoneInput
                value={formData.whatsapp}
                onChange={(value) => setField('whatsapp', value)}
                placeholder="+20 100 000 0000"
                inputProps={{
                  id: 'whatsapp',
                  name: 'whatsapp',
                  'aria-invalid': !!errors.whatsapp,
                  'aria-describedby': describedBy('whatsapp'),
                }}
              />
              {errorText('whatsapp')}
            </div>

            <div {...fieldProps('address')}>
              <label htmlFor="address">{t('contactForm.address')}</label>
              <input
                type="text"
                id="address"
                name="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={(e) => setField('address', e.target.value)}
              />
            </div>

            <div {...fieldProps('port')}>
              <label htmlFor="port">{t('contactForm.port')}</label>
              <input
                type="text"
                id="port"
                name="port"
                value={formData.port}
                onChange={(e) => setField('port', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div {...fieldProps('attachment', 'cx-file')}>
          <span className="cx-label">
            {t('contactForm.attachFile')} {optional}
          </span>
          {formData.attachment ? (
            <div className="cx-file-chosen">
              <Icon name="file" />
              <span className="cx-file-name" dir="auto">
                {formData.attachment.name}
              </span>
              <button
                type="button"
                className="cx-file-remove"
                onClick={clearFile}
                aria-label={t('contactForm.removeFile')}
                title={t('contactForm.removeFile')}
              >
                <Icon name="close" />
              </button>
            </div>
          ) : (
            <label htmlFor="attachment" className="cx-file-drop">
              <Icon name="clip" />
              <span>
                <strong>{t('contactForm.chooseFile')}</strong>
                <small>{t('contactForm.fileHint')}</small>
              </span>
            </label>
          )}
          <input
            ref={fileRef}
            type="file"
            id="attachment"
            name="attachment"
            className="sr-only"
            onChange={(e) => setField('attachment', e.target.files[0] || null)}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
            aria-describedby={describedBy('attachment')}
          />
          {errorText('attachment')}
        </div>

        {status === 'failed' && (
          <div className="cx-alert" role="alert">
            <Icon name="alert" />
            <span>{failMessage}</span>
          </div>
        )}

        <div className="cx-submit-row">
          <button type="submit" className="cx-btn cx-btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <span className="cx-spinner" aria-hidden="true" />
                {t('contactForm.sending')}
              </>
            ) : (
              <>
                {t(quote ? 'quote.send' : 'contactForm.sendMessage')}
                <Icon name="send" />
              </>
            )}
          </button>
          <p className="cx-privacy">{t('contactForm.privacyNote')}</p>
        </div>
      </form>
    </section>
  );
}
