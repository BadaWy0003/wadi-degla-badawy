import React from "react";
import { useNavigate } from "react-router-dom";
import newsPlaceholder from "../../Public/Assets/Media/Hero/news-hero.webp";

export default function NewsCard({ article }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${article.slug}`);
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
