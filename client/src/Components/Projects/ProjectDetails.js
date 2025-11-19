import React, { useState, useEffect } from "react";
import "./ProjectDetails.css"
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import apiClient from "../../util/client.js"; 
import projects from "./projectList"; 
import Product from "../Products/Product"; 
import Lightbox from 'yet-another-react-lightbox';
import Zoom from "yet-another-react-lightbox/plugins/zoom"; // Import Zoom plugin
import 'yet-another-react-lightbox/styles.css';
import ContactBubble from "../Contact/ContactBubble.js";
import "../Products/Products.css";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

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

  const slides = project?.gallery ? Object.values(project?.gallery).map((img) => ({ src: img })) : [];

  return (
    <div className="project-details-page">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <p>{">"} Explore</p>
        <a href="/projects">{">"} Projects</a>
        <p>{">"} {project.name}</p>
      </div>
      <p className="project-hint">Tap on the image to view it in full size and swipe to navigate</p>
      <div className="project-details-container">
        <div className="project-details-left">
          {project?.gallery && Object.keys(project?.gallery)?.length > 0 ? (
            <Swiper
              key={Object.keys(project?.gallery)?.length}
              pagination={{ clickable: true }}
              navigation
              modules={[Pagination, Navigation]}
              lazy={true}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}            
              className="project-gallery-swiper"
            >
              {Object.values(project?.gallery).map((image, index) => (
                <SwiperSlide 
                  key={index} 
                  onClick={() => { setIndex(index); setOpen(true); }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  >
                  <img loading="lazy" src={image} alt={`Slide ${index}`} className="project-image" />
                  {hovered && (
                    <div className="image-overlay">
                      <p>Click on the image to view it in full size and swipe to navigate</p>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img loading="lazy" src={project.thumbnail} alt={project.name} className="project-image" />
          )}
        </div>

        <div className="project-details-right">
          <h1 className="project-details-title">{project.name}</h1>
          <p className="project-details-description">Location: <strong>{project.city}{project.city?" - ":""}{project.country}</strong></p>

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
      <ContactBubble />

      {/* Lightbox Component */}
      <Lightbox 
      open={open} 
      close={() => setOpen(false)} 
      slides={slides} 
      index={index}
      plugins={[Zoom]} 
      zoom={{ maxZoomPixelRatio: 3 }} 
      />

    </div>
  );
}
