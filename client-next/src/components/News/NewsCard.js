'use client';
import React from 'react';
import LangLink from '../LangLink';

const newsPlaceholder = '/Assets/Media/Hero/news-hero.webp';

// The whole card is a real link (so Google can follow it to the article).
export default function NewsCard({ article }) {
  return (
    <LangLink href={`/news/${article.slug}`} className="btn-link">
      <div className="news-card">
        <div className="news-card-img-div">
          <img
            loading="lazy"
            src={article.thumbnail || newsPlaceholder}
            alt={article.title}
            className="news-card-image"
          />
        </div>
        <div className="news-card-footer">
          <span className="news-card-date">{article.date}</span>
          <h3 className="news-card-title">{article.title}</h3>
        </div>
      </div>
    </LangLink>
  );
}
