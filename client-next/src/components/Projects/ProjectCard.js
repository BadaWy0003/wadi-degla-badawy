'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';
import { cardImageProps } from '../../util/responsive-img';

// One project card (projects list and "more projects" on a project page). card comes from
// projectCard() in src/util/projects-data.js. The whole card is a real link (for Google).
export default function ProjectCard({ card }) {
  const { t } = useTranslation();
  const place = [card.city, card.country].filter(Boolean).join(' · ');
  const count = (one, many, n) => (n === 1 ? t(one) : t(many).replace('{{count}}', n));
  return (
    <LangLink href={`/projects/${card.id}/`} className="pj-card">
      <span className="pj-card-img">
        <img
          loading="lazy"
          {...cardImageProps(card.thumbnail, '(max-width: 768px) 100vw, 400px')}
          alt={card.name}
        />
        {card.photoCount > 1 && (
          <span className="pj-card-badge">
            {count('projects.photosOne', 'projects.photosMany', card.photoCount)}
          </span>
        )}
      </span>
      <span className="pj-card-name">{card.name}</span>
      {place && <span className="pj-card-place">{place}</span>}
      {card.stoneCount > 0 && (
        <span className="pj-card-stones">
          <span className="pj-swatches" aria-hidden="true">
            {card.stones.map((s) =>
              s.thumb ? <img key={s.id} src={s.thumb} alt={s.name || ''} loading="lazy" /> : null,
            )}
          </span>
          {count('projects.stonesOne', 'projects.stonesMany', card.stoneCount)}
        </span>
      )}
    </LangLink>
  );
}
