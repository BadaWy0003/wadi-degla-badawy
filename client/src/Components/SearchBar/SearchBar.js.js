import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../data/searchContent';
import './SearchBar.css';

// Static content to search through
// const staticContent = [
//   { title: 'About Us', path: '/about', content: 'A Legacy of Excellence' },
//   { title: 'Gallery', path: '/gallery', content: 'View our collection of marble and granite' },
//   { title: 'Contact', path: '/contact', content: 'Get in touch with us' },
//   { title: 'Quarries', path: '/quarries', content: 'Explore our quarries' },
//   { title: 'Exports', path: '/exports', content: 'International shipping and exports' },
//   { title: 'Machinery', path: '/machinery', content: 'Our state-of-the-art machinery' },
//   { title: 'History', path: '/history', content: 'Our journey through the years' },
//   { title: 'Partners', path: '/partners', content: 'Our trusted business partners' },
//   { title: 'News', path: '/news', content: 'Latest updates and news' },
//   { title: 'Projects', path: '/projects', content: 'Our completed and ongoing projects' },
//   { title: 'Fairs', path: '/fairs', content: 'International exhibitions and fairs' },
//   { title: 'Certificates', path: '/certificates', content: 'Our quality certifications' },
//   { title: 'Visualizer', path: '/visualizer', content: 'Visualize our products in your space' }
// ];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

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

  // Search function
  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const filtered = searchContent(searchQuery);
    setResults(filtered);
    setShowResults(true);
  };
  // Navigate to result
  const handleResultClick = (path) => {
    navigate(path);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div 
        className={`search-icon ${isSearchOpen ? 'hidden' : ''}`}
        onClick={toggleSearch}
      >
        <i className="fas fa-search"></i>
                {/* <p>Search</p> */}

      </div>
      <div className={`search-input-container ${isSearchOpen ? 'open' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search..."
          className="search-input"
        />
        {showResults && results.length > 0 && (
          <div className="search-results">
            {results.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => {
                  handleResultClick(result.path);
                  setIsSearchOpen(false);
                }}>
              <div className="result-title">{result.title}</div>
              <div className="result-content">{result.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SearchBar;