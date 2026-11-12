'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

const newsPlaceholder = '/Assets/Media/Hero/news-hero.webp';

export const photoCount = (t, n) =>
  n === 1 ? t('projects.photosOne') : t('projects.photosMany').replace('{{count}}', n);

// One article card (news list and "More news"). The whole card is a real link, so Google can
// follow it. featured: the big card at the top of the list (pinned article).
export default function NewsCard({ article, featured = false, excerpt = true }) {
  const { t } = useTranslation();
  const photos = article.images?.length || 0;
  return (
    <LangLink
      href={`/news/${article.slug}`}
      className={`nw-card nw-reveal${featured ? ' nw-card-featured' : ''}`}
    >
      <span className="nw-card-img">
        <img
          loading={featured ? 'eager' : 'lazy'}
          src={article.thumbnail || newsPlaceholder}
          alt={article.title}
        />
        {featured && <span className="nw-pin">★ {t('news.featured')}</span>}
        {!featured && photos > 0 && <span className="nw-count">{photoCount(t, photos)}</span>}
      </span>
      <span className="nw-card-text">
        <span className="nw-meta">
          <b>{article.date}</b>
          {featured && photos > 0 && <span>{photoCount(t, photos)}</span>}
        </span>
        <h3 className="nw-card-title" dir="auto">
          {article.title}
        </h3>
        {excerpt && (
          <p className="nw-card-excerpt" dir="auto">
            {article.excerpt}
          </p>
        )}
        <span className="nw-read">
          {featured ? t('news.readStory') : t('news.readMore')}{' '}
          <span className="nw-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </LangLink>
  );
}
