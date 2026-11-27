'use client';
import '../Contact/Contact.css';
import '../LoginSignup/Signup.css';
import '../Contact/ContactPage.css';
import './QuotePage.css';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import LangLink from '../LangLink';
import ContactForm from '../Contact/ContactForm';
import { finishLabel } from '../../util/finishes';
import { useQuoteList, writeQuote } from '../../util/quote-list';
import { sitePhoto } from '../../util/site-content';

// Quote list page (/quote): the stones the visitor added on the stone pages ("Add to quote
// list", kept in this browser), with a finish and a quantity each, then the contact form in
// "quote" mode, which sends everything as one request (server: kind "quote", saved in the
// admin panel's Enquiries inbox and emailed). Looks like the Contact page (.cx-page) + QuotePage.css.
// header photo: the loading yard (same as the buying guide), not the Contact page's telephones
// the buying guide's header photo (Website → Buying guide → Header photo in the admin panel)
const HERO = sitePhoto('topic_buyGuide', 'heroPhoto', '/Assets/Media/Hero/buy-guide-hero.webp');

// The size of one stone: a choice of the stone's own sizes (from its details in the admin panel,
// in cm), "Slabs" when it is sold as slabs, and "Other size" to type one. Stones added before
// the sizes were known (or with none written) get a text box. The chosen size is sent as
// English text (`size`); `sizeOther` keeps the text box open.
const SLABS = 'Slabs';
function SizeField({ item, index: i, t, onChange }) {
  const choices = (item.sizes || []).map((s) => `${s} cm`);
  const hasChoices = choices.length > 0 || item.slabs;
  const typed = !hasChoices || item.sizeOther;
  const value = item.sizeOther ? '__other' : item.size || '';
  return (
    <div className="qt-field qt-size">
      <label htmlFor={`qt-size-${i}`}>{t('quote.size')}</label>
      <div className="qt-size-row">
        {hasChoices && (
          <select
            id={typed ? undefined : `qt-size-${i}`}
            aria-label={typed ? t('quote.size') : undefined}
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '__other') onChange({ size: '', sizeOther: true });
              else onChange({ size: v, sizeOther: false });
            }}
          >
            <option value="">{t('quote.sizeChoose')}</option>
            {choices.map((c) => (
              <option key={c} value={c}>
                {/* kept left to right on the Arabic page ("60×60 cm", not "cm 60×60") */}
                {`\u2066${c}\u2069`}
              </option>
            ))}
            {item.slabs && <option value={SLABS}>{t('productDetails.form_slabs')}</option>}
            <option value="__other">{t('quote.sizeOther')}</option>
          </select>
        )}
        {typed && (
          <input
            id={`qt-size-${i}`}
            type="text"
            value={item.size || ''}
            maxLength={60}
            dir="auto"
            placeholder={t('quote.sizePlaceholder')}
            onChange={(e) => onChange({ size: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

// The thickness of one stone (2026-11-27, owner): typed freely in cm, so any thickness can be
// asked for (e.g. 4.3); "cm" is shown beside the box and added when sent (`thicknessText()`).
function ThicknessField({ item, index, t, onChange }) {
  const id = `qt-thick-${index}`;
  return (
    <div className="qt-field qt-thick">
      <label htmlFor={id}>{t('quote.thickness')}</label>
      <div className="qt-size-row qt-cm">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={(item.thickness || '').replace(/\s*cm$/i, '')}
          maxLength={16}
          dir="ltr"
          placeholder={t('quote.thicknessPlaceholder')}
          onChange={(e) => onChange({ thickness: e.target.value })}
        />
        <span className="qt-suffix" aria-hidden="true">
          cm
        </span>
      </div>
    </div>
  );
}

// The finish of one stone: the stone's own finishes, or "Other finish" to type one
// (2026-11-27, owner). `finishOther` keeps the text box open; the typed text is sent as `finish`.
const OTHER = '__other';
function FinishField({ item, index, t, onChange }) {
  const id = `qt-finish-${index}`;
  const choices = item.finishes?.length ? item.finishes : item.finish ? [item.finish] : [];
  const typed = !choices.length || item.finishOther;
  return (
    <div className="qt-field qt-finish">
      <label htmlFor={id}>{t('quote.finish')}</label>
      <div className="qt-size-row">
        {choices.length > 0 && (
          <select
            id={typed ? undefined : id}
            aria-label={typed ? t('quote.finish') : undefined}
            value={item.finishOther ? OTHER : item.finish || ''}
            onChange={(e) => {
              const v = e.target.value;
              if (v === OTHER) onChange({ finish: '', finishOther: true });
              else onChange({ finish: v, finishOther: false });
            }}
          >
            {choices.map((f) => (
              <option key={f} value={f}>
                {finishLabel(t, f)}
              </option>
            ))}
            <option value={OTHER}>{t('quote.finishOther')}</option>
          </select>
        )}
        {typed && (
          <input
            id={id}
            type="text"
            value={item.finish || ''}
            maxLength={60}
            dir="auto"
            placeholder={t('quote.finishPlaceholder')}
            onChange={(e) => onChange({ finish: e.target.value })}
          />
        )}
      </div>
    </div>
  );
}

// Quantity units (sent in English) and the shipping terms asked once for the whole request
const UNITS = [
  ['m²', 'quote.unitM2'],
  ['sq ft', 'quote.unitSqft'],
  ['containers', 'quote.unitContainers'],
];
const INCOTERMS = ['FOB', 'CFR', 'CIF', 'EXW'];

export default function Quote() {
  const { t } = useTranslation();
  const [list, ready] = useQuoteList();
  const [sent, setSent] = useState(false);
  const [incoterm, setIncoterm] = useState('');

  const update = (index, change) => writeQuote(list.map((item, i) => (i === index ? { ...item, ...change } : item)));
  const remove = (index) => writeQuote(list.filter((_, i) => i !== index));

  return (
    <div className="contact-container cx-page qt">
      <section className="cx-hero" style={{ '--cx-hero-img': `url("${HERO}")` }}>
        <div className="cx-hero-inner">
          <nav className="cx-crumbs" aria-label={t('quote.heading')}>
            <LangLink href="/">{t('contact.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t('quote.heading')}</span>
          </nav>
          <p className="cx-eyebrow">{t('quote.eyebrow')}</p>
          <h1>{t('quote.heading')}</h1>
          <p className="cx-hero-sub">{t('quote.intro')}</p>
        </div>
      </section>

      <div className="qt-main">
        {ready && list.length === 0 && !sent && (
          <section className="cx-form-card qt-empty">
            <h2>{t('quote.emptyTitle')}</h2>
            <p>{t('quote.emptyText')}</p>
            <LangLink href="/products" className="cx-btn cx-btn-primary">
              {t('quote.browse')}
            </LangLink>
          </section>
        )}

        {list.length > 0 && (
          <section className="cx-form-card qt-list" aria-labelledby="qt-list-title">
            <h2 id="qt-list-title">
              {t('quote.heading')} <span className="qt-count">{list.length}</span>
            </h2>
            <ul>
              {list.map((item, i) => (
                <li key={`${item.slug}-${i}`} className="qt-item">
                  <LangLink href={`/products/${item.slug}`} className="qt-photo" tabIndex={-1} aria-hidden="true">
                    {item.photo ? <img src={item.photo} alt="" loading="lazy" width="72" height="72" /> : null}
                  </LangLink>
                  <div className="qt-info">
                    <LangLink href={`/products/${item.slug}`} className="qt-name">
                      {item.name}
                    </LangLink>
                    <div className="qt-fields">
                      <FinishField item={item} index={i} t={t} onChange={(change) => update(i, change)} />
                      <SizeField item={item} index={i} t={t} onChange={(change) => update(i, change)} />
                      <ThicknessField item={item} index={i} t={t} onChange={(change) => update(i, change)} />
                      <div className="qt-field qt-qty">
                        <label htmlFor={`qt-qty-${i}`}>{t('quote.quantity')}</label>
                        <div className="qt-size-row">
                          <input
                            id={`qt-qty-${i}`}
                            type="text"
                            value={item.quantity || ''}
                            maxLength={60}
                            placeholder={t('quote.quantityPlaceholder')}
                            onChange={(e) => update(i, { quantity: e.target.value })}
                          />
                          <select
                            className="qt-unit"
                            aria-label={t('quote.unit')}
                            value={item.unit || 'm²'}
                            onChange={(e) => update(i, { unit: e.target.value })}
                          >
                            {UNITS.map(([v, key]) => (
                              <option key={v} value={v}>
                                {t(key)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="qt-remove" onClick={() => remove(i)} aria-label={`${t('quote.remove')}: ${item.name}`}>
                    <FaTrashAlt aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="qt-terms">
              <label className="qt-field" htmlFor="qt-incoterm">
                <span>{t('quote.incoterm')}</span>
              </label>
              <select id="qt-incoterm" value={incoterm} onChange={(e) => setIncoterm(e.target.value)}>
                <option value="">{t('quote.incotermNotSure')}</option>
                {INCOTERMS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <p className="qt-terms-hint">{t('quote.incotermHint')}</p>
            </div>
            <LangLink href="/products" className="qt-more">
              <FaPlus aria-hidden="true" /> {t('quote.addMore')}
            </LangLink>
          </section>
        )}

        {(list.length > 0 || sent) && (
          <ContactForm
            quote={{
              items: list,
              incoterm,
              onSent: () => {
                setSent(true);
                writeQuote([]);
                // the list disappears, so bring the "sent" message into view
                setTimeout(() => document.querySelector('.qt-main')?.scrollIntoView({ block: 'start' }), 50);
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
