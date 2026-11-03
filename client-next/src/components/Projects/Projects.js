'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Projects.css';
import Project from './Project';
import ContactBubble from '../Contact/ContactBubble';
import LangLink from '../LangLink';

// projects: from the admin panel (read at build time), already in page order: the
// country groups in their order, then the projects inside each group.
export default function Projects({ projects = [] }) {
  const { t } = useTranslation();

  // Group by country, keeping the order.
  const groups = [];
  for (const project of projects) {
    const key = project.countryId || project.country;
    let group = groups.find((g) => g.key === key);
    if (!group) groups.push((group = { key, name: project.country, list: [] }));
    group.list.push(project);
  }

  return (
    <>
      <div className="projects-page">
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
          <h1>{t('projects.heroHeading')}</h1>
          <div className="breadcrumb">
            <LangLink href="/">{t('projects.breadcrumbHome')}</LangLink>
            <p>
              {'>'} {t('projects.breadcrumbCurrent')}
            </p>
          </div>
        </div>

        <div className="projects-container">
          {groups.map(({ key, name, list: countryProjects }) => {
            return (
              <div className="projects-section" key={key}>
                <div className="projects-section-title">
                  <hr />
                  <h2>{name}</h2>
                </div>
                <div
                  className={`projects-section-content ${countryProjects.length === 1 ? 'single-project' : 'multi-projects'}`}
                >
                  {countryProjects.map((project) => (
                    <Project key={project.id} project={project} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <ContactBubble />
      </div>
    </>
  );
}
