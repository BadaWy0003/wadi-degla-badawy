import React, { useState, useEffect } from "react";
import "./Products.css";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import Product from "./Product";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';


export default function Products() {
  const { t } = useTranslation();
const [selectedCategory, setSelectedCategory] = useState(() => {
  return sessionStorage.getItem("selectedCategory") || "Egyptian Marble";
});
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/api/storage/all`);
      if (data.data) {
        setData(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category and search query
  const filteredProducts = data.filter((item) => {
    const isCategoryMatch = item.type === selectedCategory;
    const isSearchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <>
    <Helmet>
  <title>{t('products.pageTitle')}</title>
  <meta name="description" content={t('products.metaDescription')} />
        <link rel="canonical" href="https://www.wadidegla-eg.com/products" />
    </Helmet>
    
    <div className="products-container-2">
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
          <h1>{t('products.heroTitle')}</h1>
          <div className="breadcrumb">
            <a href="/">{t('products.breadcrumbHome')}</a>
            <p>{'>'} {t('products.breadcrumbCurrent')}</p>
          </div>
          <p className="hero-hint-2">
            {t('products.heroHint')}
          </p>
        </div>



      {/* Categories and Search */}
      <div className="products-categories-and-title-2">
        <div className="products-categories-2">
          {[
            "Egyptian Marble",
            "Imported Marble",
            "Egyptian Granite",
            "Imported Granite",
          ].map((category) => {
            const categoryTranslationKey = category
              .toLowerCase()
              .replace(/\s+/g, '')
              .replace('egyptian', 'egyptyan')
              .replace('imported', 'imported');
            const displayName = t(`products.category_${category.toLowerCase().replace(/\s+/g, '_')}`, category);
            
            return (
              <button
                key={category}
                className={`btn2 ${
                  selectedCategory === category ? "active-2" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  sessionStorage.setItem("selectedCategory", category);
                }}>
                {displayName}
              </button>
            );
          })}
        </div>

        <h2>{selectedCategory === "Egyptian Marble" && t('products.category_egyptian_marble')}
          {selectedCategory === "Imported Marble" && t('products.category_imported_marble')}
          {selectedCategory === "Egyptian Granite" && t('products.category_egyptian_granite')}
          {selectedCategory === "Imported Granite" && t('products.category_imported_granite')}</H2>

              {/* Dynamic Category Description */}
      <div className="category-description-2">
        <p>
          {selectedCategory === "Egyptian Marble" && t('products.egyptianMarbleDescription')}
          {selectedCategory === "Imported Marble" && t('products.importedMarbleDescription')}
          {selectedCategory === "Egyptian Granite" && t('products.egyptianGraniteDescription')}
          {selectedCategory === "Imported Granite" && t('products.importedGraniteDescription')}
        </p>
      </div>

  {/* Search Bar */}

        {/* Search Bar */}
        <input
          type="text"
          placeholder={t('products.searchPlaceholder', { category: selectedCategory })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-2"
        />
      </div>


      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="product-cards-container-2">
              <div className="product-cards-2">
                {filteredProducts.map((item) => (
                  <Product key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="no-products-message-2">
              <p>
                {t('products.noProducts', { category: selectedCategory })}
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
