// src/components/layout/TopNav.jsx
import React, { useState } from 'react';
// import { SearchIcon, BellIcon, UserCircleIcon } from 'lucide-react'; // Example icons

const TopNav = ({
  onSearch,
  selectedStore,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  categories,
  loadApps
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <div className="topnav-logo">App Analytics Dashboard</div>
        {/* Placeholder for nav links if needed */}
        {/* <a href="#dashboard">Dashboard</a>
        <a href="#apps">Apps</a> */}
      </div>
      <div className="topnav-center">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="search"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* <button type="submit" className="search-button"><SearchIcon size={18} /></button> */}
          <button type="submit" className="search-button">Search</button>
        </form>
        <div className="filter-controls-nav">
          <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} className="topnav-select">
            <option value="">All Stores</option>
            <option value="google_play">Google Play</option>
            <option value="app_store">Apple App Store</option>
          </select>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="topnav-select">
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {/* Removed explicit filter button, assuming selection change + search triggers reload via useEffect in App.jsx */}
        </div>
      </div>
      <div className="topnav-right">
        {/* <button className="icon-button"><BellIcon size={20} /></button>
        <button className="icon-button"><UserCircleIcon size={20} /></button> */}
        <div className="placeholder-icon">N</div>
        <div className="placeholder-icon">U</div>
      </div>
    </nav>
  );
};

export default TopNav;
