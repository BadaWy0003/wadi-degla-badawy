'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import './ProjectsPage.css';
import ProjectCard from './ProjectCard';
import LangLink from '../LangLink';
import { WHATSAPP_URL } from '../Contact/contactData';

// Projects list (redesigned 2026-11-12, design A "Grid with country filter").
// projects: cards from the admin panel (read at build time, projectCard() in
// src/util/projects-data.js), already in page order (countries in their order, then the
// projects inside each). All cards are in the static HTML; the buttons only filter them.
const EXPORT_COUNTRIES = '31+'; // same as the home page's trust strip (Home.js)

export default function Projects({ projects = [] }) {
  const { t } = useTranslation();
  const [country, setCountry] = useState(null);

  // countries in page order, with their number of projects
  const countries = [];
  for (const p of projects) {
    const key = p.countryId || p.country;
    const found = countries.find((c) => c.key === key);
    if (found) found.count += 1;
    else countries.push({ key, name: p.country, count: 1 });
  }
  const shown = country ? projects.filter((p) => (p.countryId || p.country) === country) : projects;

  return (
    <div className="pj">
      <div className="pj-hero">
        <div className="pj-wrap">
          <div className="pj-crumb">
            <LangLink href="/">{t('projects.breadcrumbHome')}</LangLink>
            <span aria-hidden="true">›</span>
            <span className="pj-crumb-here">{t('projects.breadcrumbCurrent')}</span>
          </div>
          <p className="pj-eyebrow">{t('projects.eyebrow')}</p>
          <h1>{t('projects.listTitle')}</h1>
          <p className="pj-lead">{t('projects.intro')}</p>
          <dl className="pj-stats">
            <div>
              <dt>{t('projects.statProjects')}</dt>
              <dd>{projects.length}</dd>
            </div>
            <div>
              <dt>{t('projects.statCountries')}</dt>
              <dd>{countries.length}</dd>
            </div>
            <div>
              <dt>{t('projects.statExport')}</dt>
              <dd>{EXPORT_COUNTRIES}</dd>
            </div>
          </dl>
        </div>
      </div>

      {countries.length > 1 && (
        <div className="pj-bar">
          <div className="pj-wrap">
            <button
              type="button"
              className={`pj-chip${!country ? ' is-on' : ''}`}
              onClick={() => setCountry(null)}
            >
              {t('projects.filterAll')} <i>{projects.length}</i>
            </button>
            {countries.map((c) => (
              <button
                type="button"
                key={c.key}
                className={`pj-chip${country === c.key ? ' is-on' : ''}`}
                onClick={() => setCountry(c.key)}
              >
                {c.name} <i>{c.count}</i>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pj-wrap">
        <div className="pj-grid pj-grid-list">
          {shown.map((p) => (
            <ProjectCard key={p.id} card={p} />
          ))}
        </div>
      </div>

      <div className="pj-band">
        <div className="pj-wrap">
          <div>
            <h2>{t('projects.bandTitle')}</h2>
            <p>{t('projects.bandText')}</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pj-btn">
            <FaWhatsapp aria-hidden="true" /> {t('productDetails.bandCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
