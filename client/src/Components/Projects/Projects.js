import React from "react";
import "./Projects.css";
import Project from "./Project";
import projects from "./projectList"; // Import the project list
import ContactBubble from "../Contact/ContactBubble";
import { Helmet } from 'react-helmet-async';

export default function Projects() {
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
    <Helmet>
        <title>Projects | Wadidegla</title>
        <meta name="description" content="Projects Description" />
        <link rel="canonical" href="https://www.wadidegla-eg.com/projects" />
    </Helmet>
    
    <div className="projects-page">
      {/* 🌟 Hero Section */}
      <div className="quarries-hero">
        <h1>SOME OF OUR PROJECTS</h1>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <p>{">"} Projects</p>
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
