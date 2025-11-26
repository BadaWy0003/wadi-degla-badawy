import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Project({ project }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="project-card"
      style={{ position: "relative", cursor: "pointer" }}
    >
      <div className="img-div">
        <img loading="lazy" src={project.thumbnail} alt={project.name} className="project-image" />
      </div>

      {/* Hover overlay */}
        <div className="overlay">
          <h3>{project.name}</h3>
          <p>{project.city}{project.city?" - ":""}{project.country}</p>
          <button 
          className="btn2"       
          onClick={() => {
                navigate(`/projects/${project.id}`);
                window.scrollTo({ top: 0 });
            }}
            >{t('projects.viewButton')}</button>
        </div>
    </div>
  );
}
