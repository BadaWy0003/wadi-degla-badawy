'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LangLink from '../LangLink';

export default function Project({ project }) {
  const { t } = useTranslation();

  return (
    <div className="project-card" style={{ position: 'relative', cursor: 'pointer' }}>
      <div className="img-div">
        <img loading="lazy" src={project.thumbnail} alt={project.name} className="project-image" />
      </div>

      {/* Hover overlay */}
      <div className="overlay">
        <h3>{project.name}</h3>
        <p>
          {project.city}
          {project.city ? ' - ' : ''}
          {project.country}
        </p>
        {/* A real link (not a click handler), so Google can follow it to the project page. */}
        <LangLink className="btn2" href={`/projects/${project.id}/`}>
          {t('projects.viewButton')}
        </LangLink>
      </div>
    </div>
  );
}
