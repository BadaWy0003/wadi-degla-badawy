import React, { useState, useEffect } from "react";
import "./Products.css";
import Product from "./Product";
import apiClient from "../../util/client.js";
import ContactBubble from "../Contact/ContactBubble.js";

// Remove Modal import

export default function Visualizer() {
  const [selectedCategory, setSelectedCategory] = useState("Egyptian Marble");
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
    <div className="products-container-2">
                          {/* 🌟 Hero Section */}
                          <div className="quarries-hero">
                        <h1>OUR MARBLE & GRANITE</h1>
                        <div className="breadcrumb">
                        <a href="/">Home</a>
                        <p>{'>'} Products</p>
                        </div>
                        <p className="hero-hint-2">
          Select a product from below to view its details.
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
          ].map((category) => (
            <button
              key={category}
              className={`btn2 ${
                selectedCategory === category ? "active-2" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <h2>{selectedCategory}</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder={`Search inside ${selectedCategory} ...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-2"
        />
      </div>

      {loading ? (
        <div className="loading-message">Loading products...</div>
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
                No products available for your search in {selectedCategory}.
              </p>
            </div>
          )}
        </>
      )}
                  <ContactBubble />

    </div>
  );
}
