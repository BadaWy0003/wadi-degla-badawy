'use client';
import React, { useState } from "react";
import './News.css';
import ContactBubble from "../Contact/ContactBubble";
import { useTranslation } from 'react-i18next';
import NewsCard from "./NewsCard";
import articles from "./newsList";

export default function News(){
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");

    // Sort articles by dateOrder descending (newest first), then filter by search
    const sortedArticles = [...articles]
        .sort((a, b) => b.dateOrder - a.dateOrder)
        .filter((article) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return(
        <>
        <Helmet>
            <title>{t('news.pageTitle')}</title>
            <meta name="description" content={t('news.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/news" />
        </Helmet>
        
        <div className='news-container'>
            {/* 🌟 Hero Section */}
            <div className="quarries-hero">
                <h1>{t('news.heroTitle')}</h1>
                <div className="breadcrumb">
                    <a href="/">{t('news.breadcrumbHome')}</a>
                    <p>{'>'} {t('news.breadcrumbCurrent')}</p>
                </div>
            </div>
            <div className="news-intro">
                <p>{t('news.newsDescription')}</p>
                <input
                    type="text"
                    placeholder={t('news.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar-news"
                />
            </div>
            {sortedArticles.length > 0 ? (
                <div className="news-articles-container">
                    <div className="news-section-content multi-articles">
                        {sortedArticles.map((article) => (
                            <NewsCard key={article.id} article={article} />
                        ))}
                    </div>
                </div>
            ) : articles.length === 0 ? (
                <div className="coming-soon">
                    <p>{t('news.newsDescription')}</p>
                    <h1>{t('news.comingSoon')}</h1>
                </div>
            ) : (
                <div className="news-no-results">
                    <p>{t('news.noResults', { replace: [searchQuery] }).replace('%s', searchQuery)}</p>
                </div>
            )}

            <ContactBubble />
        </div>   
        </> 
    );
}