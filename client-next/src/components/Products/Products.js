'use client';
import React, { useState, useEffect } from 'react';
import './Products.css';
import { useTranslation } from 'react-i18next';

import Product from './Product';
import apiClient from '../../util/client.js';
import ContactBubble from '../Contact/ContactBubble.js';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.js';
import LangLink from '../LangLink';
import { PRODUCT_TYPE_KEYS } from '../../util/product-types';
import { CATEGORY_TOPIC } from '../../util/topic-pages';

const CATEGORIES = ['Egyptian Marble', 'Imported Marble', 'Egyptian Granite', 'Imported Granite'];

// initialProducts comes from the build (the page fetches the API), so the product cards are
// in the static HTML for Google. The list is refreshed from the API in the browser, so
// admin-panel changes show up without a redeploy.
export default function Products({ initialProducts = [] }) {
  const { t } = useTranslation();
  // The build always renders the default category; a category remembered in this tab
  // (sessionStorage) is applied after the page has loaded.
  const [selectedCategory, setSelectedCategory] = useState('Egyptian Marble');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [data, setData] = useState(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedCategory');
    if (CATEGORIES.includes(saved)) setSelectedCategory(saved);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await apiClient.get(`/api/storage/all`);
      if (data.data) {
        setData(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category and search query
  const filteredProducts = data.filter((item) => {
    const isCategoryMatch = item.type === selectedCategory;
    const isSearchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <>
      <div className="products-container-2">
        {/* 🌟 Hero Section */}
        <div className="quarries-hero">
          <h1>{t('products.heroTitle')}</h1>
          <div className="breadcrumb">
            <LangLink href="/">{t('products.breadcrumbHome')}</LangLink>
            <p>
              {'>'} {t('products.breadcrumbCurrent')}
            </p>
          </div>
          <p className="hero-hint-2">{t('products.heroHint')}</p>
        </div>

        {/* Categories and Search */}
        <div className="products-categories-and-title-2">
          <div className="products-categories-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`btn2 ${selectedCategory === category ? 'active-2' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  sessionStorage.setItem('selectedCategory', category);
                }}
              >
                {t(PRODUCT_TYPE_KEYS[category])}
              </button>
            ))}
          </div>

          <h2>{t(PRODUCT_TYPE_KEYS[selectedCategory])}</h2>

          {/* Dynamic Category Description */}
          <div className="category-description-2">
            <p>
              {selectedCategory === 'Egyptian Marble' && t('products.egyptianMarbleDescription')}
              {selectedCategory === 'Imported Marble' && t('products.importedMarbleDescription')}
              {selectedCategory === 'Egyptian Granite' && t('products.egyptianGraniteDescription')}
              {selectedCategory === 'Imported Granite' && t('products.importedGraniteDescription')}
            </p>
            {/* The category's own page, with its full description and questions */}
            {CATEGORY_TOPIC[selectedCategory] && (
              <LangLink
                className="category-topic-link"
                href={`/${CATEGORY_TOPIC[selectedCategory]}/`}
              >
                {t('products.aboutCategory', { category: t(PRODUCT_TYPE_KEYS[selectedCategory]) })}{' '}
                →
              </LangLink>
            )}
          </div>

          {/* Search Bar */}

          {/* Search Bar */}
          <input
            type="text"
            placeholder={t('products.searchPlaceholder', {
              category: t(PRODUCT_TYPE_KEYS[selectedCategory]),
            })}
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
                  {t('products.noProducts', { category: t(PRODUCT_TYPE_KEYS[selectedCategory]) })}
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
