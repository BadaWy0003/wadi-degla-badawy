'use client';
import React, { useState, useEffect, useMemo } from 'react';
import './ProductsList.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

import apiClient from '../../util/client.js';
import LangLink from '../LangLink';
import { PRODUCT_TYPE_KEYS, PRODUCT_CATEGORIES, normalizeProducts } from '../../util/product-types';
import { CATEGORY_TOPIC } from '../../util/topic-pages';
import { productSlug } from '../../util/product-slugs';
import { finishLabel } from '../../util/finishes';
import { WHATSAPP_URL } from '../Contact/contactData';
import { COMPANY, EXPORT_COUNTRIES_LABEL } from '../../util/company';
import { stoneImgProps } from '../../util/responsive-img';

// Products list (redesigned 2026-11-12, design A "Grouped by category"): every stone, in one
// section per category, so all of them (and their links) are in the static HTML for Google.
// The bar's buttons jump to a section; the search box filters every section.

// Room photos are not finishes.
const ROOM_FINISHES = ['indoorMockup', 'mockup', 'outdoorMockup', 'mockupOutdoor'];
// Shown first in their category (owner's choice); the rest are A-Z.
const FIRST = ['Emperador'];
// Short descriptions of each category (translation keys).
const DESCRIPTION_KEYS = {
  'Egyptian Marble': 'products.egyptianMarbleDescription',
  'Egyptian Limestone': 'products.egyptianLimestoneDescription',
  'Egyptian Granite': 'products.egyptianGraniteDescription',
  'Imported Marble': 'products.importedMarbleDescription',
  'Imported Granite': 'products.importedGraniteDescription',
};
// Numbers in the header; keep them the same as the home page's trust strip (Home.js).
const QUARRIES = COMPANY.quarries;
const EXPORT_COUNTRIES = EXPORT_COUNTRIES_LABEL;

const sectionId = (category) => `pl-${category.toLowerCase().replace(/\s+/g, '-')}`;
const order = (a, b) => {
  const fa = FIRST.indexOf(a.name);
  const fb = FIRST.indexOf(b.name);
  if (fa !== fb) return (fa === -1 ? 99 : fa) - (fb === -1 ? 99 : fb);
  return a.name.localeCompare(b.name);
};
// the card photo: Honed, else Polished, else the first finish
const cardPhoto = (item) =>
  item.finishes?.find((f) => f.finish === 'Honed') ||
  item.finishes?.find((f) => f.finish === 'Polished') ||
  item.finishes?.find((f) => !ROOM_FINISHES.includes(f.finish));
const finishCount = (item) =>
  item.finishCount ?? (item.finishes || []).filter((f) => !ROOM_FINISHES.includes(f.finish)).length;

// initialProducts comes from the build (the page fetches the API), so the product cards are
// in the static HTML for Google. The list is refreshed from the API in the browser, so
// admin-panel changes show up without a redeploy.
export default function Products({ initialProducts = [] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [data, setData] = useState(initialProducts);
  const [active, setActive] = useState(PRODUCT_CATEGORIES[0]);

  useEffect(() => {
    apiClient
      .get(`/api/storage/all`)
      .then(({ data: res }) => {
        if (res?.data) setData(normalizeProducts(res.data));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_CATEGORIES.map((category) => ({
      category,
      total: data.filter((p) => p.type === category && cardPhoto(p)).length,
      items: data
        .filter((p) => p.type === category && cardPhoto(p))
        .filter((p) => !q || p.name.toLowerCase().includes(q))
        .sort(order),
    }));
  }, [data, query]);
  const total = groups.reduce((n, g) => n + g.total, 0);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  // the bar's button for the section on screen is highlighted: the last section whose top
  // has passed the bar
  useEffect(() => {
    const onScroll = () => {
      let current = null;
      for (const c of PRODUCT_CATEGORIES) {
        const el = document.getElementById(sectionId(c));
        if (el && el.getBoundingClientRect().top < 220) current = c;
      }
      const first = PRODUCT_CATEGORIES.find((c) => document.getElementById(sectionId(c)));
      setActive(current || first);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shown]);

  const jump = (category) => {
    const el = document.getElementById(sectionId(category));
    if (!el) return;
    setActive(category);
    const bar = document.querySelector('.pl-bar');
    const top = el.getBoundingClientRect().top + window.scrollY - (bar?.offsetHeight || 0) - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="pl">
      <div className="pl-hero">
        <div className="pl-wrap">
          <div className="pl-crumb">
            <LangLink href="/">{t('products.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="pl-crumb-here">{t('products.breadcrumbCurrent')}</span>
          </div>
          <p className="pl-eyebrow">{t('products.eyebrow')}</p>
          <h1>{t('products.collectionTitle')}</h1>
          <p className="pl-lead">{t('products.intro')}</p>
          <dl className="pl-stats">
            <div>
              <dt>{t('products.statStones')}</dt>
              <dd>{total}</dd>
            </div>
            <div>
              <dt>{t('products.statCategories')}</dt>
              <dd>{PRODUCT_CATEGORIES.length}</dd>
            </div>
            <div>
              <dt>{t('products.statQuarries')}</dt>
              <dd>{QUARRIES}</dd>
            </div>
            <div>
              <dt>{t('products.statCountries')}</dt>
              <dd>{EXPORT_COUNTRIES}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pl-bar">
        <div className="pl-wrap">
          <div className="pl-chips">
            {groups.map(({ category, items }) => (
              <button
                type="button"
                key={category}
                className={`pl-chip${active === category ? ' is-on' : ''}`}
                onClick={() => jump(category)}
                disabled={!items.length}
              >
                {t(PRODUCT_TYPE_KEYS[category])} <i>{items.length}</i>
              </button>
            ))}
          </div>
          <input
            type="search"
            className="pl-search"
            placeholder={t('products.searchAll')}
            aria-label={t('products.searchAll')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="pl-wrap">
        {shown === 0 && query && (
          <p className="pl-empty">{t('products.noResults', { query: query.trim() })}</p>
        )}
        {groups
          .filter((g) => g.items.length > 0)
          .map(({ category, items }) => (
            <section
              key={category}
              id={sectionId(category)}
              data-category={category}
              className="pl-group"
            >
              <div className="pl-group-head">
                <div>
                  <h2>
                    {t(PRODUCT_TYPE_KEYS[category])} <i>{items.length}</i>
                  </h2>
                  <p>{t(DESCRIPTION_KEYS[category])}</p>
                </div>
                {CATEGORY_TOPIC[category] && (
                  <LangLink className="pl-more" href={`/${CATEGORY_TOPIC[category]}/`}>
                    {t('products.aboutCategory', { category: t(PRODUCT_TYPE_KEYS[category]) })}{' '}
                    <span className="pl-arrow" aria-hidden="true">
                      →
                    </span>
                  </LangLink>
                )}
              </div>
              <div className="pl-grid">
                {items.map((item) => {
                  const photo = cardPhoto(item);
                  const count = finishCount(item);
                  return (
                    <LangLink
                      key={item.id}
                      href={`/products/${productSlug(item.name)}`}
                      className="pl-card"
                    >
                      <span className="pl-card-img">
                        <img
                          loading="lazy"
                          {...stoneImgProps(photo, '(max-width: 768px) 45vw, 220px')}
                          alt={`${item.name} - ${finishLabel(t, photo.finish)}`}
                        />
                      </span>
                      <span className="pl-card-name">{item.name}</span>
                      <span className="pl-card-meta">
                        {count === 1
                          ? t('products.finishOne')
                          : t('productDetails.finishesCount').replace('{{count}}', count)}
                      </span>
                    </LangLink>
                  );
                })}
              </div>
            </section>
          ))}
      </div>

      <div className="pl-band">
        <div className="pl-wrap">
          <div>
            <h2>{t('products.bandTitle')}</h2>
            <p>{t('products.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pl-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
