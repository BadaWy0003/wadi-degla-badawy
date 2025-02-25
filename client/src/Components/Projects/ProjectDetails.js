import React, { useState, useEffect } from "react";
import "./ProjectDetails.css"
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import apiClient from "../../util/client.js"; 
import projects from "./projectList"; 
import Product from "../Products/Product"; 

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/api/storage/all"); 
        if (data?.data) {
          setProducts(data.data); 
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const project = projects?.find((p) => p.id.toString() === projectId);

  if (!projects || !project) {
    return <div className="error-message">Project not found</div>;
  }

  const materialProducts = project?.materialsSupplied?.map((material) => {
    return products.find((p) => p.name.toLowerCase() === material.toLowerCase());
  }).filter(Boolean) ?? []; // Prevents undefined errors

  return (
    <div className="project-details-page">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <p>{">"} Explore</p>
        <a href="/projects">{">"} Projects</a>
        <p>{">"} {project.name}</p>
      </div>

      <div className="project-details-container">
        <div className="project-details-left">
          {project?.gallery && Object.keys(project?.gallery)?.length > 0 ? (
            <Swiper
              key={Object.keys(project?.gallery)?.length}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              lazy={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}            
              className="project-gallery-swiper"
            >
              {Object.values(project?.gallery).map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image} alt={`Slide ${index}`} className="project-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={project.thumbnail} alt={project.name} className="project-image" />
          )}
        </div>

        <div className="project-details-right">
          <h1 className="project-details-title">{project.name}</h1>
          <p className="project-details-description">Location: <strong>{project.city} - {project.country}</strong></p>

          <p>Materials Supplied:</p>
          {loading ? (
            <p>Loading materials...</p>
          ) : materialProducts.length > 0 ? (
            <div className="materials-supplied-container">
              {materialProducts.map((product) => (
                <Product key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <p id="no-materials">No materials available.</p>
          )}

          <button className="btn1" onClick={() => navigate("/contact")} style={{ width: "100%", marginTop: "2rem" }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
