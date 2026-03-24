'use client';
import React from "react";
import { useTranslation } from 'react-i18next';
import "./Projects.css";
import Project from "./Project";
import projects from "./projectList"; // Import the project list
import ContactBubble from "../Contact/ContactBubble";

export default function Projects() {
  const { t } = useTranslation();

  // Group projects by country
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.country]) {
      acc[project.country] = [];
    }
    acc[project.country].push(project);
    return acc;
  }, {});

  return (
    <>
    
    <div className="projects-page">
      {/* 🌟 Hero Section */}
      <div className="quarries-hero">
        <h1>{t('projects.heroHeading')}</h1>
        <div className="breadcrumb">
          <a href="/">{t('projects.breadcrumbHome')}</a>
          <p>{">"} {t('projects.breadcrumbCurrent')}</p>
        </div>
      </div>

      <div className="projects-container">
        {Object.keys(groupedProjects).map((country) => {
          const countryProjects = groupedProjects[country];
          return (
            <div className="projects-section" key={country}>
              <div className="projects-section-title">
                <hr />
                <h2>{country}</h2>
              </div>
              <div 
                className={`projects-section-content ${countryProjects.length === 1 ? "single-project" : "multi-projects"}`}
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
