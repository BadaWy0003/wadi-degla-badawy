import React, { useState, useRef, useEffect } from "react";
import "./Visualizer.css";
import hero_bg from "../../Public/Assets/Media/Hero/visualizer-hero.webp";
import ProductForVisualizer from "./ProductForVisualizer.js";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState("Imported Marble");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showIndoor, setShowIndoor] = useState(true); // Toggle for indoor
  const [showOutdoor, setShowOutdoor] = useState(true); // Toggle for outdoor
  const [data, setData] = useState([]); // Set the product data
  const indoorRef = useRef(null);
  const outdoorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/api/storage/all`)
      .then(({ data }) => {
        setData(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setData([]);
        setLoading(false);
      });

  }, []);

  // Reset toggle state when the category changes
  useEffect(() => {
    setShowIndoor(true);
    setShowOutdoor(true);
  }, [selectedCategory]);

  // Filter products based on selected category and search query
  const filteredProducts = data.filter((item) => {
    const isCategoryMatch = item.type === selectedCategory;
    const isSearchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  // Get mockup images from finishes
  const indoorProducts = filteredProducts.filter((item) =>
    item.finishes.some((f) => f.finish === "indoorMockup")
  );

  const outdoorProducts = filteredProducts.filter((item) =>
    item.finishes.some((f) => f.finish === "outdoorMockup")
  );

  // Apply toggle logic ONLY to the selected category
  const visibleIndoorProducts = showIndoor ? indoorProducts : [];
  const visibleOutdoorProducts = showOutdoor ? outdoorProducts : [];

  // Scroll to the outdoor section
  const scrollToOutdoor = () => {
    if (outdoorRef.current) {
      outdoorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the indoor section
  const scrollToIndoor = () => {
    if (indoorRef.current) {
      indoorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Check for product availability in current category
  const hasIndoorProducts = indoorProducts.length > 0;
  const hasOutdoorProducts = outdoorProducts.length > 0;

  const handleProductClick = (item, type) => {
    const mockupFinish = item.finishes.find(
      (f) => f.finish === (type === "indoor" ? "indoorMockup" : "outdoorMockup")
    );

    setSelectedProduct({
      ...item,
      currentMockup: mockupFinish ? mockupFinish.link : null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="products-container">
      <div className="products-hero">
        {selectedProduct ? (
          <img loading="lazy"
            src={selectedProduct.currentMockup}
            alt={selectedProduct.name}
            className="products-hero-image"
          />
        ) : (
          <img loading="lazy"
            src={hero_bg}
            alt="Hero Background"
            className="products-hero-image"
          />
        )}
        <h1>{selectedProduct ? selectedProduct.name : "Visualizer"}</h1>
        {!selectedProduct && (
          <p className="hero-hint">
            Select a product from below and it will show here
          </p>
        )}
      </div>

      <div className="products-categories-and-title">
        <div className="products-categories">
          <button
            className={`btn2 ${
              selectedCategory === "Imported Marble" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Imported Marble")}
          >
            Imported Marble
          </button>
          <button
            className={`btn2 ${
              selectedCategory === "Egyptian Marble" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Egyptian Marble")}
          >
            Egyptian Marble
          </button>
          <button
            className={`btn2 ${
              selectedCategory === "Imported Granite" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Imported Granite")}
          >
            Imported Granite
          </button>
          <button
            className={`btn2 ${
              selectedCategory === "Egyptian Granite" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("Egyptian Granite")}
          >
            Egyptian Granite
          </button>
        </div>

        <h2>{selectedCategory}</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder={`Search inside ${selectedCategory} ...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {/* Toggle Buttons */}
        {(hasIndoorProducts || hasOutdoorProducts) && (
          <div className="toggle-buttons">
            {/* Show "Hide Indoor" button only if outdoor products exist */}
            {hasIndoorProducts && hasOutdoorProducts && (
              <button
                className={`toggle-btn ${showIndoor ? "active" : ""}`}
                onClick={() => setShowIndoor(!showIndoor)}
              >
                {showIndoor ? "Hide Indoor" : "Show Indoor"}
              </button>
            )}
            {hasOutdoorProducts && (
              <button
                className={`toggle-btn ${showOutdoor ? "active" : ""}`}
                onClick={() => setShowOutdoor(!showOutdoor)}
              >
                {showOutdoor ? "Hide Outdoor" : "Show Outdoor"}
              </button>
            )}
          </div>
        )}
      </div>
      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : (
        <>
      {filteredProducts.length > 0 ? (
        <div className="products-page">
          {/* Scroll to outdoor link */}
          {window.innerWidth < 768 &&
            showIndoor &&
            showOutdoor &&
            hasOutdoorProducts && (
              <p onClick={scrollToOutdoor} className="scroll-to-outdoor-btn">
                Scroll to Outdoor ↓
              </p>
            )}

          {/* Indoor Section */}
          {showIndoor && visibleIndoorProducts.length > 0 && (
            <div
              className={
                hasOutdoorProducts
                  ? "category-title-and-product-cards"
                  : "category-title-and-product-cards-2"
              }
              ref={indoorRef}
            >
              {hasOutdoorProducts && <h2>Indoor</h2>}
              <div className="product-cards">
                {visibleIndoorProducts.map((item) => (
                  <ProductForVisualizer
                    key={item.id}
                    item={item}
                    onClick={() => handleProductClick(item, "indoor")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scroll to indoor link */}
          {window.innerWidth < 768 &&
            showIndoor &&
            showOutdoor &&
            hasOutdoorProducts && (
              <p onClick={scrollToIndoor} className="scroll-to-indoor-btn">
                Scroll to Indoor ↑
              </p>
            )}

          {/* Outdoor Section */}
          {showOutdoor && visibleOutdoorProducts.length > 0 && (
            <div className="category-title-and-product-cards" ref={outdoorRef}>
              <h2>Outdoor</h2>
              <div className="product-cards">
                {visibleOutdoorProducts.map((item) => (
                  <ProductForVisualizer
                    key={item.id}
                    item={item}
                    onClick={() => handleProductClick(item, "outdoor")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-products-message">
          <p>
            {selectedCategory === "Imported Granite"
              ? `${selectedCategory} Coming soon.`
              : `No products available for your search in ${selectedCategory}.`}
          </p>
        </div>
      )}
              </>
      )}
            <ContactBubble />

    </div>
  );
}
