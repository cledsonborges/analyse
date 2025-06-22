// src/components/dashboard/AppListCard.jsx
import React from 'react';

const AppListCard = ({ app, onSelectApp }) => {
  // This is for a single app card in a list/grid
  return (
    <div className="app-list-card" onClick={() => onSelectApp(app)}>
      <img src={app.icon_url || `https://via.placeholder.com/60?text=${app.name.charAt(0)}`} alt={app.name} className="app-list-card-icon" />
      <div className="app-list-card-info">
        <h4 className="app-list-card-name">{app.name}</h4>
        <p className="app-list-card-category">{app.category}</p>
        <p className="app-list-card-store">{app.store === 'google_play' ? 'Google Play' : 'App Store'}</p>
      </div>
      <div className="app-list-card-rating">
        ⭐ {app.rating || 'N/A'}
      </div>
    </div>
  );
};


const AppsDisplay = ({ apps, onSelectApp, loading, loadApps, selectedStore, setSelectedStore, categories, selectedCategory, setSelectedCategory }) => {
  // This component will display the grid/list of apps, potentially with filters if not in TopNav
  // For now, let's assume filters are handled globally or in TopNav, and this just displays
  if (loading) {
    return <div className="loading-apps">Loading apps...</div>;
  }

  if (!apps || apps.length === 0) {
    return <div className="no-apps-found">No applications found for the current filters.</div>;
  }

  return (
    <div className="apps-display-container">
      {/* Optional: Filters can be here if not in TopNav
      <div className="app-filters-local">
        <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
          <option value="">All Stores</option>
          <option value="google_play">Google Play</option>
          <option value="app_store">Apple App Store</option>
        </select>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button onClick={loadApps}>Filter</button>
      </div>
      */}
      <div className="apps-grid-new-style">
        {apps.map(app => (
          <AppListCard key={app.app_id} app={app} onSelectApp={onSelectApp} />
        ))}
      </div>
    </div>
  );
};

export { AppListCard, AppsDisplay };
