'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import { loadSearchProducts } from '../../util/api-lazy.js';
import './SearchBarMobile.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../context/LangContext';
import { productSlug } from '../../util/product-slugs';

const SearchBarMobile = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [products, setProducts] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const lang = useLang();
  const { t, i18n } = useTranslation();

  // Load the product list the first time the search box is opened (not on every page view)
  useEffect(() => {
    if (!open || products.length) return;
    let alive = true;
    loadSearchProducts().then((list) => {
      if (alive && list.length) setProducts(list);
    });
    return () => {
      alive = false;
    };
  }, [open, products.length]);

  // Esc closes the search
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // The phone menu's search field opens this box (and closes the menu)
  useEffect(() => {
    const openFromMenu = () => setOpen(true);
    window.addEventListener('wd:open-search', openFromMenu);
    return () => window.removeEventListener('wd:open-search', openFromMenu);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

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
    fairs: '/fairs',
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
    title = title.replace(/\s*\|\s*Wadi\s*Degla\s*/gi, '').replace(/\s*\|\s*Wadidegla\s*/gi, '').trim();
    
    return title;
  };

  const handleSearch = (q) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const allContent = getAllSearchableContent();
    const searchTerm = q.toLowerCase();
    const filteredResults = [];
    const seenPaths = new Set();

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

    // stones first (the name starting with the words typed, then containing them), then pages
    const rank = (r) => {
      if (!r.isProduct) return 3;
      const name = r.title.toLowerCase();
      return name.startsWith(searchTerm) ? 0 : name.includes(searchTerm) ? 1 : 2;
    };
    filteredResults.sort((a, b) => rank(a) - rank(b));
    setResults(filteredResults);
  };

  const handleResultClick = (path) => {
    router.push(`/${lang}${path}`);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  // Products arrive after the box opens: refresh the results if something was already typed
  useEffect(() => {
    if (query.trim()) handleSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return (
    <div className="search-mobile-container" ref={containerRef}>
      <button
        aria-label="Open search"
        className={`mobile-search-icon ${open ? 'active' : ''}`}
        onClick={() => setOpen((s) => !s)}
      >
        <FaSearch aria-hidden="true" />
      </button>

      {open && (
        <div
          className="mobile-search-scrim"
          aria-hidden="true"
          onClick={() => {
            setOpen(false);
            setResults([]);
          }}
        />
      )}
      {open && (
        <div className="mobile-search-dropdown">
          <input
            ref={inputRef}
            className="mobile-search-input"
            type="text"
            placeholder={t('common.search') || "Search..."}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {results && results.length > 0 && (
            <div className="mobile-search-results">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`mobile-search-result-item ${r.isProduct ? 'product-result' : ''}`}
                  onClick={() => handleResultClick(r.path)}
                >
                  {r.image && (
                    <img src={r.image} alt={r.title} className="result-image" />
                  )}
                  <div className="result-text-content">
                    <div className="result-title">{r.title}</div>
                    <div className="result-content">{r.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarMobile;
