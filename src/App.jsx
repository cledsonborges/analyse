import { useState, useEffect } from 'react';
import './App.css';
import TopNav from './components/layout/TopNav';
import MetricsCard from './components/dashboard/MetricsCard';
import ChartCard from './components/dashboard/ChartCard';
import { AppsDisplay } from './components/dashboard/AppListCard';
import { ReviewList } from './components/dashboard/ReviewCard';
import SentimentDistributionChart from './components/dashboard/SentimentDistributionChart';

// Configuração da API
const API_BASE_URL = 'https://bff-analyse.vercel.app';

function App() {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [activeTab, setActiveTab] = useState('overview'); // Old tab logic, might remove
  const [selectedStore, setSelectedStore] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // For new search bar

  useEffect(() => {
    loadApps();
    loadCategories();
  }, [selectedStore, selectedCategory, searchTerm]); // Add searchTerm to dependencies

  const loadApps = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/apps`;
      const params = new URLSearchParams();
      
      if (selectedStore) params.append('store', selectedStore);
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm); // Add search term to API query
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setApps(data);
    } catch (error) {
      console.error('Erro ao carregar apps:', error);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const selectApp = async (app) => {
    setSelectedApp(app);
    // setActiveTab('overview'); // Old tab logic
    setLoading(true);
    try {
      const reviewsResponse = await fetch(`${API_BASE_URL}/api/apps/${app.app_id}/reviews?limit=20`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);

      const analysisResponse = await fetch(`${API_BASE_URL}/api/apps/${app.app_id}/analysis`);
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Erro ao carregar dados do app:', error);
      setReviews([]);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const collectAppData = async (appId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/scraping/app/${appId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 }),
      });
      if (response.ok) {
        alert('Dados coletados com sucesso! Recarregando...');
        if (selectedApp && selectedApp.app_id === appId) await selectApp(selectedApp);
      } else {
        alert('Erro ao coletar dados');
      }
    } catch (error) {
      console.error('Erro ao coletar dados:', error);
      alert('Erro ao coletar dados');
    } finally {
      setLoading(false);
    }
  };

  const analyzeAppSentiment = async (appId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/sentiment/analyze-app/${appId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 }),
      });
      if (response.ok) {
        alert('Análise de sentimentos concluída! Recarregando...');
        if (selectedApp && selectedApp.app_id === appId) await selectApp(selectedApp);
      } else {
        alert('Erro na análise de sentimentos');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro na análise de sentimentos');
    } finally {
      setLoading(false);
    }
  };

  // const getSentimentColor and getSentimentIcon might be moved to ReviewCard or utils if needed there.

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const renderAppSelection = () => (
    <AppsDisplay
      apps={apps}
      onSelectApp={selectApp}
      loading={loading && !selectedApp} // only show app list loading if no app is selected yet
      // Pass filter states if AppsDisplay will have its own filters, otherwise TopNav handles it
      // selectedStore={selectedStore}
      // setSelectedStore={setSelectedStore}
      // categories={categories}
      // selectedCategory={selectedCategory}
      // setSelectedCategory={setSelectedCategory}
      // loadApps={loadApps}
    />
  );

  const renderAppDashboard = () => {
    if (!selectedApp) return null; // Should not happen if logic is correct
    if (loading && selectedApp) return <div className="loading-fullscreen">Loading App Details...</div>;

    return (
      <div className="app-dashboard-new-layout">
        <div className="dashboard-header">
          <button onClick={() => setSelectedApp(null)} className="back-button-new-style">
            &larr; Back to Apps
          </button>
          <h1>{selectedApp.name}</h1>
          <p className="app-meta">{selectedApp.store === 'google_play' ? 'Google Play' : 'App Store'} | {selectedApp.category}</p>
          <div className="action-buttons-header">
             <button
                onClick={() => collectAppData(selectedApp.app_id)}
                disabled={loading}
                className="action-btn primary"
              >
                Collect Data
              </button>
              <button
                onClick={() => analyzeAppSentiment(selectedApp.app_id)}
                disabled={loading}
                className="action-btn secondary"
              >
                Analyze Sentiments
              </button>
          </div>
        </div>

        <div className="dashboard-metrics-grid">
          <MetricsCard title="Total Reviews" value={reviews.length.toLocaleString()} icon="📊" />
          <MetricsCard title="Average Rating" value={selectedApp.rating || 'N/A'} icon="⭐" />
          <MetricsCard title="Current Version" value={selectedApp.current_version || 'N/A'} icon="📦" />
          <MetricsCard
            title="Last Updated"
            value={selectedApp.last_updated ? new Date(selectedApp.last_updated).toLocaleDateString('pt-BR') : 'N/A'}
            icon="📅"
          />
        </div>

        {analysis && (
          <ChartCard title="Sentiment Analysis">
            <SentimentDistributionChart analysis={analysis} />
          </ChartCard>
        )}

        <ReviewList reviews={reviews} />
      </div>
    );
  };

  return (
    <div className="app-new-layout">
      <TopNav
        onSearch={handleSearch}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        // loadApps={loadApps} // loadApps is triggered by useEffect on filter change
      />
      <main className="main-content-area">
        {loading && !selectedApp && apps.length === 0 && <div className="loading-fullscreen">Fetching apps...</div>}
        {!selectedApp ? renderAppSelection() : renderAppDashboard()}
      </main>
    </div>
  );
}

export default App;

