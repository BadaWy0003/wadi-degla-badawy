import React, { useState, useEffect } from "react";
import "./ProjectDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import apiClient from "../../util/client.js"; // Fetch products from API
import projects from "./projectList"; // Static project data
import Product from "../Products/Product"; // Import the Product card component

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find the project by ID
  const project = projects.find((p) => p.id === projectId);

  // ✅ Always call useEffect at the top level
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/api/storage/all"); // Fetch products from API
        if (data.data) {
          setProducts(data.data); // Save fetched products
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ❌ Don't return before hooks are called → Move below!
  if (!project) {
    return <div className="error-message">Project not found</div>;
  }

  // Generate links for materials supplied
  const materialProducts = project.materialsSupplied?.map((material) => {
    return products.find((p) => p.name.toLowerCase() === material.toLowerCase());
  }).filter(Boolean); // Remove undefined values

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
          {project.gallery && Object.keys(project.gallery).length > 0 ? (
            <Swiper
              key={Object.keys(project.gallery).length}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              className="project-gallery-swiper"
            >
              {Object.values(project.gallery).map((image, index) => (
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

          {/* Materials Supplied Section */}
          <p><strong>Materials Supplied:</strong></p>
          {loading ? (
            <p>Loading materials...</p>
          ) : materialProducts.length > 0 ? (
            <div className="materials-supplied-container">
              {materialProducts.map((product) => (
                <Product key={product.id} item={product} />
              ))}
            </div>
          ) : (
            <p>No materials available.</p>
          )}

          <button className="btn1" onClick={() => navigate("/contact")} style={{ width: "100%", marginTop: "2rem" }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
