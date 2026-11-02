"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// Helmet removed - metadata handled by generateMetadata() in page.js
import "./NewsDetail.css";
import ContactBubble from "../Contact/ContactBubble";
import LangLink from "../LangLink";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// article: from the admin panel, read at build time by app/[lang]/news/[slug]/page.js.
export default function NewsDetail({ article }) {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!article) {
    return (
      <div className="news-detail-not-found">
        <h2>{t("news.articleNotFound")}</h2>
      </div>
    );
  }

  const paragraphs = article.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const slides = (article.images || []).map((img) => ({ src: img.src }));

  return (
    <>
      <div className="news-detail-container">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div
          className="news-detail-hero"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                         url(${article.thumbnail}) center/cover no-repeat`,
            backgroundAttachment: "fixed",
          }}
        >
          <h1 className="news-detail-hero-title">{article.title}</h1>
          <div className="breadcrumb">
            <LangLink href="/">{t("news.breadcrumbHome")}</LangLink>
            <p>{">"}</p>
            <LangLink href="/news">{t("news.breadcrumbCurrent")}</LangLink>
            <p>
              {">"} {article.title}
            </p>
          </div>
        </div>

        {/* ── Article Body ───────────────────────────────────── */}
        <div className="news-detail-body">
          <div className="news-detail-meta">
            <span className="news-detail-date">{article.date}</span>
          </div>

          <div className="news-detail-content">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {article.author && (
            <p className="news-detail-author">— {article.author}</p>
          )}
        </div>

        {/* ── Gallery ── */}
        {article.images && article.images.length > 0 && (
          <div
            className="news-detail-gallery"
            style={{ "--gallery-cols": Math.min(article.images.length, 4) }}
          >
            {article.images.map((img, i) => (
              <div
                key={i}
                className="news-gallery-item"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <img loading="lazy" src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        )}

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
          plugins={[Zoom]}
          zoom={{ maxZoomPixelRatio: 3 }}
        />

        <ContactBubble />
      </div>
    </>
  );
}
