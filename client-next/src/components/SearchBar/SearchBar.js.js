'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import apiClient from '../../util/client.js';
import './SearchBar.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { productSlug } from '../../util/product-slugs';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const searchRef = useRef(null);
  const router = useRouter();
  const lang = useLang();
  const { t, i18n } = useTranslation();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get('/api/storage/all');
        if (data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle click outside to close results and search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.querySelector('.search-input')?.focus();
      }, 300);
    }
  };

  // Recursively extract all text from i18n objects
  const extractAllText = (obj, prefix = '') => {
    const results = [];
    
    if (typeof obj === 'string') {
      return [{ text: obj, key: prefix }];
    }
    
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const currentKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          results.push({ text: value, key: currentKey });
        } else if (typeof value === 'object' && value !== null) {
          results.push(...extractAllText(value, currentKey));
        }
      });
    }
    
    return results;
  };

  // Get all searchable content from current language
  const getAllSearchableContent = () => {
    const allResources = i18n.getResourceBundle(i18n.language);
    const allText = extractAllText(allResources);
    return allText;
  };

  // Page mapping for better UX
  const pageMapping = {
    about: '/about',
    history: '/history',
    quarries: '/quarries',
    exports: '/exports',
    machinery: '/machinery',
    certificates: '/certificates',
    gallery: '/gallery',
    contact: '/contact',
    products: '/products',
    projects: '/projects',
    partners: '/partners',
    news: '/news',
    kerbstone: '/kerbstone',
    cobbles: '/cobbles',
    inspiration: '/inspiration',
    stoneCreation: '/stone creations',
    patterns: '/patterns',
    packing: '/packing'
  };

  // Determine page from key
  const getPageFromKey = (key) => {
    for (const [pageName, pagePath] of Object.entries(pageMapping)) {
      if (key.toLowerCase().startsWith(pageName.toLowerCase())) {
        return { path: pagePath, page: pageName };
      }
    }
    return null;
  };

  // Get page title from translation
  const getPageTitle = (page) => {
    // Manual mapping for consistent titles
    const titleMap = {
      about: t('about.introTitle') || 'About Us',
      history: t('history.pageTitle') || 'History',
      quarries: t('quarries.pageTitle') || 'Quarries',
      exports: t('exports.pageTitle') || 'Exports',
      machinery: t('machinery.pageTitle') || 'Machinery',
      certificates: t('certificates.pageTitle') || 'Certificates',
      gallery: t('gallery.pageTitle') || 'Gallery',
      contact: t('contact.heroHeading') || 'Contact',
      products: t('products.pageTitle') || 'Products',
      projects: t('projects.pageTitle') || 'Projects',
      fairs: t('fairs.pageTitle') || 'Fairs',
      partners: t('partners.pageTitle') || 'Partners',
      news: t('news.pageTitle') || 'News',
      kerbstone: t('kerbstone.pageTitle') || 'Kerbstone',
      cobbles: t('cobbles.pageTitle') || 'Cobbles',
      inspiration: t('inspiration.pageTitle') || 'Inspiration',
      stoneCreation: t('stoneCreation.pageTitle') || 'Stone Creation',
      patterns: t('patterns.pageTitle') || 'Patterns',
      packing: t('packing.pageTitle') || 'Packing'
    };
    
    let title = titleMap[page] || page.charAt(0).toUpperCase() + page.slice(1);
    
    // Clean up the title by removing "| Wadidegla" or "| Wadi Degla"
    title = title.replace(/\s*\|\s*Wadi\s*Degla\s*/gi, '').replace(/\s*\|\s*Wadidegla\s*/gi, '').trim();
    
    return title;
  };

  // Search function
  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const allContent = getAllSearchableContent();
    const searchTerm = searchQuery.toLowerCase();
    const filteredResults = [];
    const seenPaths = new Set(); // Prevent duplicates

    // Search in page content
    allContent.forEach(({ text, key }) => {
      if (text.toLowerCase().includes(searchTerm)) {
        const pageInfo = getPageFromKey(key);
        
        if (pageInfo && !seenPaths.has(pageInfo.path)) {
          seenPaths.add(pageInfo.path);
          filteredResults.push({
            title: getPageTitle(pageInfo.page),
            path: pageInfo.path,
            content: text.substring(0, 150) + (text.length > 150 ? '...' : '')
          });
        }
      }
    });

    // Search in products
    products.forEach((product) => {
      const productPath = `/products/${productSlug(product.name)}`;
      
      if (!seenPaths.has(productPath)) {
        if (product.name.toLowerCase().includes(searchTerm) || 
            product.type.toLowerCase().includes(searchTerm)) {
          seenPaths.add(productPath);
          // Get product image (honed or polished finish)
          const productImage = product.finishes?.find(f => f.finish === 'Honed' || f.finish === 'Polished')?.link || null;
          
          filteredResults.push({
            title: product.name,
            path: productPath,
            content: `${product.type} | ${t('common.product') || 'Product'}`,
            image: productImage,
            isProduct: true
          });
        }
      }
    });

    setResults(filteredResults);
    setShowResults(filteredResults.length > 0);
  };

  // Navigate to result
  const handleResultClick = (path) => {
    router.push(`/${lang}${path}`);
    setQuery('');
    setShowResults(false);
    setIsSearchOpen(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div 
        className={`search-icon ${isSearchOpen ? 'hidden' : ''}`}
        onClick={toggleSearch}
      >
        <FaSearch aria-hidden="true" />
      </div>
      <div className={`search-input-container ${isSearchOpen ? 'open' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder={t('common.search') || "Search..."}
          className="search-input"
        />
        {showResults && results.length > 0 && (
          <div className="search-results">
            {results.map((result, index) => (
              <div
                key={index}
                className={`search-result-item ${result.isProduct ? 'product-result' : ''}`}
                onClick={() => {
                  handleResultClick(result.path);
                }}>
                {result.image && (
                  <img src={result.image} alt={result.title} className="result-image" />
                )}
                <div className="result-text-content">
                  <div className="result-title">{result.title}</div>
                  <div className="result-content">{result.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;