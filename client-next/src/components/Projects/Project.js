'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';

export default function Project({ project }) {
  const router = useRouter();
  const lang = useLang();
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
        <button
          className="btn2"
          onClick={() => {
            router.push(`/${lang}/projects/${project.id}`);
            window.scrollTo({ top: 0 });
          }}
        >
          {t('projects.viewButton')}
        </button>
      </div>
    </div>
  );
}
