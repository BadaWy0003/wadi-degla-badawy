'use client';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaLinkedinIn, FaLink } from 'react-icons/fa';
import './NewsPage.css';
import LangLink from '../LangLink';
import usePhotoZoom from '../usePhotoZoom';
import NewsCard, { photoCount } from './NewsCard';
import useReveal from './useReveal';
import { WHATSAPP_URL } from '../Contact/contactData';

const SITE = 'https://www.wadidegla-eg.com';
const GRID = 5; // photos shown in the grid; all of them open in the zoom viewer

// One news article (redesigned 2026-11-12 with the list's design A): photo header with the
// title, the text with a side box (date, author, photos, share, WhatsApp), a photo grid, three
// more articles and a WhatsApp band.
// article / more: from the admin panel, read at build time by app/[lang]/news/[slug]/page.js.
export default function NewsDetail({ article, more = [], lang = 'en' }) {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const [openPhoto, zoom] = usePhotoZoom();
  const [copied, setCopied] = useState(false);
  useReveal(pageRef, [article?.slug]);

  if (!article) {
    return (
      <div className="nw">
        <div className="nw-hero">
          <div className="nw-wrap">
            <h1>{t('news.articleNotFound')}</h1>
            <p className="nw-lead">
              <LangLink href="/news">{t('news.backToNews')}</LangLink>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const paragraphs = article.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const images = article.images || [];
  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));
  const url = `${SITE}/${lang}/news/${article.slug}/`;
  const share = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <div className="nw" ref={pageRef}>
      <div className="nw-art-hero">
        {article.thumbnail && (
          <img src={article.thumbnail} alt="" fetchPriority="high" className="nw-art-photo" />
        )}
        <div className="nw-wrap">
          <div className="nw-crumb">
            <LangLink href="/">{t('news.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <LangLink href="/news">{t('news.breadcrumbCurrent')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="nw-crumb-here">{article.title}</span>
          </div>
          <p className="nw-eyebrow">
            {article.date}
            {article.author && ` · ${article.author}`}
          </p>
          <h1 dir="auto">{article.title}</h1>
        </div>
      </div>

      <div className="nw-wrap">
        <div className="nw-body">
          <div className="nw-text">
            {paragraphs.map((para, i) => (
              <p key={i} dir="auto">
                {para}
              </p>
            ))}
          </div>
          <aside className="nw-side">
            <dl>
              <div>
                <dt>{t('news.factPublished')}</dt>
                <dd>{article.date}</dd>
              </div>
              {article.author && (
                <div>
                  <dt>{t('news.factBy')}</dt>
                  <dd>{article.author}</dd>
                </div>
              )}
              {images.length > 0 && (
                <div>
                  <dt>{t('projects.factPhotos')}</dt>
                  <dd>{images.length}</dd>
                </div>
              )}
            </dl>
            <div className="nw-share">
              <span>{t('news.share')}</span>
              <a
                href={`https://wa.me/?text=${share}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn aria-hidden="true" />
              </a>
              <button type="button" onClick={copy} aria-label={t('news.copyLink')}>
                <FaLink aria-hidden="true" />
              </button>
              {copied && (
                <em className="nw-copied" role="status">
                  {t('news.copied')}
                </em>
              )}
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nw-btn">
              <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
            </a>
          </aside>
        </div>

        {images.length > 0 && (
          <section className="nw-section">
            <h2>{t('news.photosTitle')}</h2>
            <div className={`nw-photos nw-photos-${Math.min(images.length, GRID)}`}>
              {images.slice(0, GRID).map((img, i) => (
                <button
                  type="button"
                  key={img.src}
                  className="nw-photo nw-reveal"
                  onClick={() => openPhoto(i)}
                  aria-label={img.alt || article.title}
                >
                  <img loading="lazy" src={img.src} alt={img.alt || article.title} />
                </button>
              ))}
              {images.length > 1 && (
                <button type="button" className="nw-all" onClick={() => openPhoto(0)}>
                  {images.length > GRID
                    ? t('projects.allPhotos').replace('{{count}}', images.length)
                    : photoCount(t, images.length)}
                </button>
              )}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <section className="nw-section">
            <h2>{t('news.moreTitle')}</h2>
            <div className="nw-grid">
              {more.map((a) => (
                <NewsCard key={a.id} article={a} excerpt={false} />
              ))}
            </div>
          </section>
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

      {zoom(slides)}
    </div>
  );
}
