import { useState, useEffect } from 'react'
import './App.css'

// Configuração da API
const API_BASE_URL = 'https://bff-analyse.vercel.app'

function App() {
  const [apps, setApps] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [stores, setStores] = useState(['google_play', 'app_store'])
  const [selectedStore, setSelectedStore] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')

  // Carregar dados iniciais
  useEffect(() => {
    loadApps()
    loadCategories()
  }, [selectedStore, selectedCategory])

  const loadApps = async () => {
    try {
      setLoading(true)
      let url = `${API_BASE_URL}/api/apps`
      const params = new URLSearchParams()
      
      if (selectedStore) params.append('store', selectedStore)
      if (selectedCategory) params.append('category', selectedCategory)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setApps(data)
    } catch (error) {
      console.error('Erro ao carregar apps:', error)
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const selectApp = async (app) => {
    setSelectedApp(app)
    setActiveTab('overview')
    setLoading(true)
    
    try {
      // Carregar reviews
      const reviewsResponse = await fetch(`${API_BASE_URL}/api/apps/${app.app_id}/reviews?limit=20`)
      const reviewsData = await reviewsResponse.json()
      setReviews(reviewsData)

      // Carregar análise
      const analysisResponse = await fetch(`${API_BASE_URL}/api/apps/${app.app_id}/analysis`)
      const analysisData = await analysisResponse.json()
      setAnalysis(analysisData)
    } catch (error) {
      console.error('Erro ao carregar dados do app:', error)
    } finally {
      setLoading(false)
    }
  }

  const collectAppData = async (appId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/scraping/app/${appId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 50 })
      })
      
      if (response.ok) {
        alert('Dados coletados com sucesso! Recarregando...')
        await selectApp(selectedApp)
      } else {
        alert('Erro ao coletar dados')
      }
    } catch (error) {
      console.error('Erro ao coletar dados:', error)
      alert('Erro ao coletar dados')
    } finally {
      setLoading(false)
    }
  }

  const analyzeAppSentiment = async (appId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/sentiment/analyze-app/${appId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: 100 })
      })
      
      if (response.ok) {
        alert('Análise de sentimentos concluída! Recarregando...')
        await selectApp(selectedApp)
      } else {
        alert('Erro na análise de sentimentos')
      }
    } catch (error) {
      console.error('Erro na análise:', error)
      alert('Erro na análise de sentimentos')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981'
      case 'negative': return '#ef4444'
      case 'neutral': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      case 'neutral': return '😐'
      default: return '❓'
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 Agente de Análise de Apps</h1>
        <p>Análise inteligente de aplicativos da Google Play e Apple Store</p>
      </header>

      <div className="container">
        {!selectedApp ? (
          <div className="app-selection">
            <div className="filters">
              <h2>Selecione um Aplicativo para Análise</h2>
              
              <div className="filter-row">
                <div className="filter-group">
                  <label>Loja:</label>
                  <select 
                    value={selectedStore} 
                    onChange={(e) => setSelectedStore(e.target.value)}
                  >
                    <option value="">Todas as lojas</option>
                    <option value="google_play">Google Play</option>
                    <option value="app_store">Apple App Store</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Categoria:</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <button onClick={loadApps} disabled={loading}>
                  {loading ? 'Carregando...' : 'Filtrar'}
                </button>
              </div>
            </div>

            <div className="apps-grid">
              {loading ? (
                <div className="loading">Carregando aplicativos...</div>
              ) : apps.length > 0 ? (
                apps.map(app => (
                  <div 
                    key={app.app_id} 
                    className="app-card"
                    onClick={() => selectApp(app)}
                  >
                    <div className="app-info">
                      <h3>{app.name}</h3>
                      <p className="store-badge">{app.store === 'google_play' ? '📱 Google Play' : '🍎 App Store'}</p>
                      <p className="category">{app.category}</p>
                      {app.rating && (
                        <div className="rating">
                          ⭐ {app.rating} ({app.total_reviews?.toLocaleString() || 0} reviews)
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-apps">
                  <p>Nenhum aplicativo encontrado com os filtros selecionados.</p>
                  <button onClick={loadApps}>Tentar novamente</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="app-dashboard">
            <div className="app-header">
              <button className="back-button" onClick={() => setSelectedApp(null)}>
                ← Voltar
              </button>
              <div className="app-title">
                <h2>{selectedApp.name}</h2>
                <p>{selectedApp.store === 'google_play' ? '📱 Google Play' : '🍎 App Store'} • {selectedApp.category}</p>
                {selectedApp.rating && (
                  <div className="rating">
                    ⭐ {selectedApp.rating} • {selectedApp.total_reviews?.toLocaleString() || 0} reviews
                  </div>
                )}
              </div>
              <div className="action-buttons">
                <button 
                  onClick={() => collectAppData(selectedApp.app_id)}
                  disabled={loading}
                  className="collect-btn"
                >
                  📥 Coletar Dados
                </button>
                <button 
                  onClick={() => analyzeAppSentiment(selectedApp.app_id)}
                  disabled={loading}
                  className="analyze-btn"
                >
                  🧠 Analisar Sentimentos
                </button>
              </div>
            </div>

            <div className="tabs">
              <button 
                className={activeTab === 'overview' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('overview')}
              >
                📊 Visão Geral
              </button>
              <button 
                className={activeTab === 'reviews' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('reviews')}
              >
                💬 Reviews ({reviews.length})
              </button>
              <button 
                className={activeTab === 'sentiment' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('sentiment')}
              >
                🎭 Análise de Sentimentos
              </button>
            </div>

            <div className="tab-content">
              {loading && <div className="loading">Carregando...</div>}

              {activeTab === 'overview' && !loading && (
                <div className="overview">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total de Reviews</h3>
                      <p className="stat-number">{reviews.length}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Avaliação Média</h3>
                      <p className="stat-number">⭐ {selectedApp.rating || 'N/A'}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Versão Atual</h3>
                      <p className="stat-number">{selectedApp.current_version || 'N/A'}</p>
                    </div>
                    <div className="stat-card">
                      <h3>Última Atualização</h3>
                      <p className="stat-number">
                        {selectedApp.last_updated ? 
                          new Date(selectedApp.last_updated).toLocaleDateString('pt-BR') : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  {analysis && (
                    <div className="sentiment-overview">
                      <h3>Distribuição de Sentimentos</h3>
                      <div className="sentiment-bars">
                        <div className="sentiment-bar">
                          <span>Positivo</span>
                          <div className="bar">
                            <div 
                              className="bar-fill positive" 
                              style={{width: `${analysis.positive_percentage}%`}}
                            ></div>
                          </div>
                          <span>{analysis.positive_percentage}%</span>
                        </div>
                        <div className="sentiment-bar">
                          <span>Negativo</span>
                          <div className="bar">
                            <div 
                              className="bar-fill negative" 
                              style={{width: `${analysis.negative_percentage}%`}}
                            ></div>
                          </div>
                          <span>{analysis.negative_percentage}%</span>
                        </div>
                        <div className="sentiment-bar">
                          <span>Neutro</span>
                          <div className="bar">
                            <div 
                              className="bar-fill neutral" 
                              style={{width: `${analysis.neutral_percentage}%`}}
                            ></div>
                          </div>
                          <span>{analysis.neutral_percentage}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && !loading && (
                <div className="reviews">
                  <div className="reviews-header">
                    <h3>Reviews Recentes</h3>
                    <p>{reviews.length} reviews carregadas</p>
                  </div>
                  <div className="reviews-list">
                    {reviews.length > 0 ? reviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <span className="user-name">{review.user_name || 'Usuário Anônimo'}</span>
                          <span className="rating">{'⭐'.repeat(review.rating)}</span>
                          {review.sentiment && (
                            <span 
                              className="sentiment-badge"
                              style={{backgroundColor: getSentimentColor(review.sentiment)}}
                            >
                              {getSentimentIcon(review.sentiment)} {review.sentiment}
                            </span>
                          )}
                        </div>
                        <p className="review-content">{review.content}</p>
                        <div className="review-footer">
                          <span className="review-date">
                            {review.date ? new Date(review.date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </span>
                          {review.sentiment_score && (
                            <span className="sentiment-score">
                              Confiança: {(review.sentiment_score * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="no-reviews">
                        <p>Nenhuma review encontrada.</p>
                        <button onClick={() => collectAppData(selectedApp.app_id)}>
                          Coletar Reviews
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'sentiment' && !loading && (
                <div className="sentiment-analysis">
                  {analysis ? (
                    <div>
                      <div className="sentiment-summary">
                        <h3>Resumo da Análise de Sentimentos</h3>
                        <div className="sentiment-stats">
                          <div className="sentiment-stat positive">
                            <h4>😊 Positivo</h4>
                            <p>{analysis.positive_percentage}%</p>
                          </div>
                          <div className="sentiment-stat negative">
                            <h4>😞 Negativo</h4>
                            <p>{analysis.negative_percentage}%</p>
                          </div>
                          <div className="sentiment-stat neutral">
                            <h4>😐 Neutro</h4>
                            <p>{analysis.neutral_percentage}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="sentiment-details">
                        <h4>Detalhes da Análise</h4>
                        <p><strong>Total de reviews analisadas:</strong> {analysis.total_reviews}</p>
                        <p><strong>Score médio de confiança:</strong> {(analysis.avg_sentiment_score * 100).toFixed(1)}%</p>
                        <p><strong>Última atualização:</strong> {new Date(analysis.last_updated).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-analysis">
                      <p>Nenhuma análise de sentimentos disponível.</p>
                      <button onClick={() => analyzeAppSentiment(selectedApp.app_id)}>
                        Iniciar Análise
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

