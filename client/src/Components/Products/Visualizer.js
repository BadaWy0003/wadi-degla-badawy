import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./Visualizer.css";
import { Helmet } from 'react-helmet-async';
import hero_bg from "../../Public/Assets/Media/Hero/visualizer-hero.webp";
import ProductForVisualizer from "./ProductForVisualizer.js";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";

export default function Visualizer() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("Imported Marble");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [showIndoor, setShowIndoor] = useState(true); // Toggle for indoor
  const [showOutdoor, setShowOutdoor] = useState(true); // Toggle for outdoor
  const [data, setData] = useState([]); // Set the product data
  const indoorRef = useRef(null);
  const outdoorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [mockupLoading, setMockupLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});



  useEffect(() => {
    setLoading(true);
    apiClient
    .get(`/api/storage/all`)
    .then(({ data }) => {
      const products = data.data || [];
  
      // ✅ preload indoor & outdoor mockups
      const mockupLinks = products.flatMap((item) =>
        item.finishes
          .filter(f => f.finish === "indoorMockup" || f.finish === "outdoorMockup")
          .map(f => f.link)
      );
  
      mockupLinks.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
  
      setData(products);
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
  const mockupLink = mockupFinish?.link || null;
  if (!mockupLink) return;

  // 👇 Check if image is already cached
  if (loadedImages[mockupLink]) {
    setSelectedProduct({ ...item, currentMockup: mockupLink });
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // 👇 Otherwise, show loading, then cache
  setMockupLoading(true);

  const img = new Image();
  img.src = mockupLink;
  img.onload = () => {
    setLoadedImages(prev => ({ ...prev, [mockupLink]: true }));
    setSelectedProduct({ ...item, currentMockup: mockupLink });
    setMockupLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
};
  
  return (
    <>
        <Helmet>
      <title>{t('visualizer.pageTitle')}</title>
      <meta name="description" content={t('visualizer.metaDescription')} />
            <link rel="canonical" href="https://www.wadidegla-eg.com/visualizer" />
        </Helmet>
    
    <div className="products-container">
      <div className="products-hero">
      {mockupLoading ? (
        <LoadingSpinner />
      ) : selectedProduct ? (
        <img
          src={selectedProduct.currentMockup}
          alt={selectedProduct.name}
          className={`products-hero-image ${loadedImages[selectedProduct.currentMockup] ? "visible" : ""}`}
        />
      ) : (
        <img
          src={hero_bg}
          alt="Hero Background"
          className="products-hero-image"
        />
      )}
        <h1>{selectedProduct ? selectedProduct.name : t('visualizer.heroTitle')}</h1>
        {!selectedProduct && (
          <p className="hero-hint">
            {t('visualizer.heroHint')}
          </p>
        )}
      </div>

      <div className="products-categories-and-title">
        <div className="products-categories">
          <button
            className={`btn2 ${selectedCategory === "Imported Marble" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Imported Marble")}
          >
            {t('visualizer.importedMarble')}
          </button>
          <button
            className={`btn2 ${selectedCategory === "Egyptian Marble" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Egyptian Marble")}
          >
            {t('visualizer.egyptianMarble')}
          </button>
          <button
            className={`btn2 ${selectedCategory === "Imported Granite" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Imported Granite")}
          >
            {t('visualizer.importedGranite')}
          </button>
          <button
            className={`btn2 ${selectedCategory === "Egyptian Granite" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Egyptian Granite")}
          >
            {t('visualizer.egyptianGranite')}
          </button>
        </div>

        <h2>{selectedCategory}</h2>

        {/* Dynamic Category Description */}
        <div className="category-description-2">
          <p>
            {selectedCategory === "Egyptian Marble" && t('visualizer.egyptianMarbleDescription')}
            {selectedCategory === "Imported Marble" && t('visualizer.importedMarbleDescription')}
            {selectedCategory === "Egyptian Granite" && t('visualizer.egyptianGraniteDescription')}
            {selectedCategory === "Imported Granite" && t('visualizer.importedGraniteDescription')}
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder={t('visualizer.searchPlaceholder', { category: selectedCategory })}
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
                {showIndoor ? t('visualizer.hideIndoor') : t('visualizer.showIndoor')}
              </button>
            )}
            {hasOutdoorProducts && (
              <button
                className={`toggle-btn ${showOutdoor ? "active" : ""}`}
                onClick={() => setShowOutdoor(!showOutdoor)}
              >
                {showOutdoor ? t('visualizer.hideOutdoor') : t('visualizer.showOutdoor')}
              </button>
            )}
          </div>
        )}
      </div>
      {loading ? (
        <LoadingSpinner />
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
                {t('visualizer.scrollToIndoor')}
              </p>
            )}

          {/* Outdoor Section */}
          {showOutdoor && visibleOutdoorProducts.length > 0 && (
            <div className="category-title-and-product-cards" ref={outdoorRef}>
              <h2>{t('visualizer.outdoor')}</h2>
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
              ? t('visualizer.comingSoon', { category: selectedCategory })
              : t('visualizer.noProducts', { category: selectedCategory })}
          </p>
        </div>
      )}
              </>
      )}
            <ContactBubble />

    </div>
    </>
  );
}
