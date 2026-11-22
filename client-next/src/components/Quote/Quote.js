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

export default function Quote() {
  const { t } = useTranslation();
  const [list, ready] = useQuoteList();
  const [sent, setSent] = useState(false);

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
                <li key={`${item.slug}-${item.finish}`} className="qt-item">
                  <LangLink href={`/products/${item.slug}`} className="qt-photo" tabIndex={-1} aria-hidden="true">
                    {item.photo ? <img src={item.photo} alt="" loading="lazy" width="72" height="72" /> : null}
                  </LangLink>
                  <div className="qt-info">
                    <LangLink href={`/products/${item.slug}`} className="qt-name">
                      {item.name}
                    </LangLink>
                    <div className="qt-fields">
                      {item.finishes?.length > 1 ? (
                        <label className="qt-field">
                          <span>{t('quote.finish')}</span>
                          <select value={item.finish} onChange={(e) => update(i, { finish: e.target.value })}>
                            {item.finishes.map((f) => (
                              <option key={f} value={f}>
                                {finishLabel(t, f)}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        item.finish && (
                          <p className="qt-field">
                            <span>{t('quote.finish')}</span>
                            <b>{finishLabel(t, item.finish)}</b>
                          </p>
                        )
                      )}
                      <label className="qt-field qt-qty">
                        <span>{t('quote.quantity')}</span>
                        <input
                          type="text"
                          value={item.quantity || ''}
                          maxLength={60}
                          dir="auto"
                          placeholder={t('quote.quantityPlaceholder')}
                          onChange={(e) => update(i, { quantity: e.target.value })}
                        />
                      </label>
                    </div>
                  </div>
                  <button type="button" className="qt-remove" onClick={() => remove(i)} aria-label={`${t('quote.remove')}: ${item.name}`}>
                    <FaTrashAlt aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <LangLink href="/products" className="qt-more">
              <FaPlus aria-hidden="true" /> {t('quote.addMore')}
            </LangLink>
          </section>
        )}

        {(list.length > 0 || sent) && (
          <ContactForm
            quote={{
              items: list,
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
