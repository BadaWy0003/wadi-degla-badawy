'use client';
import React from "react";
const newsPlaceholder = '/Assets/Media/Hero/news-hero.webp';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

export default function NewsCard({ article }) {
  const router = useRouter();
  const lang = useLang();

  const handleClick = () => {
    router.push(`/${lang}/news/${article.slug}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="news-card" onClick={handleClick}>
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
  );
}
