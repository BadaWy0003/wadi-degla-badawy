'use client';
import React, { useRef, useState } from 'react';
import './NewsPage.css';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import LangLink from '../LangLink';
import NewsCard from './NewsCard';
import useReveal from './useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';
import { coverStyle } from '../../util/page-covers';
import CoverPreload from '../PhotoCover/CoverPreload';
import '../PhotoCover/PhotoCover.css';

// News list (redesigned 2026-11-12, design A "Featured + grid"): header with numbers, year
// buttons + search, the pinned article as a big card, the others in a 3-column grid, and a
// WhatsApp band. articles: from the admin panel, read at build time by app/[lang]/news/page.js,
// already in display order (pinned first, then newest). Every card is in the static HTML; the
// year buttons and search only hide cards in the browser.
export default function News({ articles = [] }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [year, setYear] = useState(null);
  const [query, setQuery] = useState('');

  const years = [...new Set(articles.map((a) => a.year))].sort((a, b) => b - a);
  const photos = articles.reduce((sum, a) => sum + (a.images?.length || 0), 0);
  const span = years.length > 1 ? `${years[years.length - 1]}–${years[0]}` : String(years[0] || '');

  const q = query.trim().toLowerCase();
  const shown = articles.filter(
    (a) =>
      (!year || a.year === year) &&
      (!q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
  );
  const featured = shown[0]?.pinned ? shown[0] : null;
  const rest = featured ? shown.slice(1) : shown;

  useReveal(pageRef, [year, q]);

  return (
    <div className="nw" ref={pageRef}>
      <div className="nw-hero wd-cover" style={coverStyle('news')}>
        <CoverPreload page="news" />
        <div className="nw-wrap">
          <div className="nw-crumb">
            <LangLink href="/">{t('news.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="nw-crumb-here">{t('news.breadcrumbCurrent')}</span>
          </div>
          <p className="nw-eyebrow">{t('news.eyebrow')}</p>
          <h1>{t('news.heroTitle')}</h1>
          <p className="nw-lead">{t('news.newsDescription')}</p>
          {articles.length > 0 && (
            <dl className="nw-stats">
              <div>
                <dt>{t('news.statArticles')}</dt>
                <dd>{articles.length}</dd>
              </div>
              <div>
                <dt>{t('news.statPhotos')}</dt>
                <dd>{photos}</dd>
              </div>
              <div>
                <dt>{t('news.statYears')}</dt>
                <dd>
                  <bdi>{span}</bdi>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      <div className="nw-wrap">
        {articles.length === 0 ? (
          <p className="nw-empty">{t('news.comingSoon')}</p>
        ) : (
          <>
            <div className="nw-bar">
              <div className="nw-chips">
                <button
                  type="button"
                  className={`nw-chip${year ? '' : ' is-on'}`}
                  aria-pressed={!year}
                  onClick={() => setYear(null)}
                >
                  {t('projects.filterAll')} <i>{articles.length}</i>
                </button>
                {years.map((y) => (
                  <button
                    type="button"
                    key={y}
                    className={`nw-chip${year === y ? ' is-on' : ''}`}
                    aria-pressed={year === y}
                    onClick={() => setYear(year === y ? null : y)}
                  >
                    {y} <i>{articles.filter((a) => a.year === y).length}</i>
                  </button>
                ))}
              </div>
              <input
                type="search"
                className="nw-search"
                placeholder={t('news.searchPlaceholder')}
                aria-label={t('news.searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {shown.length === 0 && (
              <p className="nw-empty">{t('news.noResults').replace('%s', query)}</p>
            )}

            {featured && <NewsCard article={featured} featured />}

            {rest.length > 0 && (
              <section className="nw-section">
                <h2>{t('news.latestTitle')}</h2>
                <div className="nw-grid">
                  {rest.map((a) => (
                    <NewsCard key={a.id} article={a} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <div className="nw-band">
        <div className="nw-wrap">
          <div>
            <h2>{t('news.bandTitle')}</h2>
            <p>{t('news.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nw-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
