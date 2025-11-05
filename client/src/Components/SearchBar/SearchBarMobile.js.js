import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../data/searchContent';
import './SearchBarMobile.css';

const SearchBarMobile = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleSearch = (q) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const filtered = searchContent(q);
    setResults(filtered);
  };

  const handleResultClick = (path) => {
    navigate(path);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="search-mobile-container" ref={containerRef}>
      <button
        aria-label="Open search"
        className={`mobile-search-icon ${open ? 'active' : ''}`}
        onClick={() => setOpen((s) => !s)}
      >
        <i className="fas fa-search" />
      </button>

      {open && (
        <div className="mobile-search-dropdown">
          <input
            ref={inputRef}
            className="mobile-search-input"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {results && results.length > 0 && (
            <div className="mobile-search-results">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="mobile-search-result-item"
                  onClick={() => handleResultClick(r.path)}
                >
                  <div className="result-title">{r.title}</div>
                  <div className="result-content">{r.content}</div>
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
