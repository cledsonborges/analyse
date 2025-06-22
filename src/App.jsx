import { useState, useEffect } from 'react'
import './App.css'

// URL da API em produção
const API_BASE_URL = 'https://bff-analyse.vercel.app'

function App() {
  const [apps, setApps] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  // Carregar apps na inicialização
  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/apps`)
      const data = await response.json()
      setApps(data)
    } catch (error) {
      console.error('Erro ao carregar apps:', error)
    }
  }

  const fetchReviews = async (appId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/apps/${appId}/reviews`)
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error('Erro ao carregar reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAppSelect = (app) => {
    setSelectedApp(app)
    setActiveTab('overview')
    fetchReviews(app.app_id)
  }

  const simulateGitHubIssue = async (appId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/github/simulate-issue/${appId}`, {
        method: 'POST'
      })
      const data = await response.json()
      alert(`Issue simulada: ${data.preview?.title}`)
    } catch (error) {
      console.error('Erro ao simular issue:', error)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10B981'
      case 'negative': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getSentimentStats = () => {
    if (!reviews.length) return { positive: 0, negative: 0, neutral: 0 }
    
    const stats = reviews.reduce((acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1
      return acc
    }, {})
    
    const total = reviews.length
    return {
      positive: ((stats.positive || 0) / total * 100).toFixed(1),
      negative: ((stats.negative || 0) / total * 100).toFixed(1),
      neutral: ((stats.neutral || 0) / total * 100).toFixed(1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 Agente de Análise de Apps
              </h1>
              <p className="text-gray-600 mt-1">
                Análise automática de aplicativos com IA
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ API Online
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Apps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📱 Aplicativos Monitorados
              </h2>
              <div className="space-y-3">
                {apps.map((app) => (
                  <div
                    key={app.app_id}
                    onClick={() => handleAppSelect(app)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedApp?.app_id === app.app_id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{app.name}</h3>
                        <p className="text-sm text-gray-500">{app.store}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">⭐</span>
                          <span className="ml-1 text-sm font-medium">{app.rating}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {app.total_reviews?.toLocaleString()} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Principal */}
          <div className="lg:col-span-2">
            {selectedApp ? (
              <div className="space-y-6">
                {/* Informações do App */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedApp.name}
                      </h2>
                      <p className="text-gray-600">
                        {selectedApp.store} • Versão {selectedApp.current_version}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-2xl">⭐</span>
                        <span className="ml-2 text-3xl font-bold">{selectedApp.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedApp.total_reviews?.toLocaleString()} avaliações
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                      {[
                        { id: 'overview', label: '📊 Visão Geral' },
                        { id: 'sentiment', label: '😊 Sentimentos' },
                        { id: 'reviews', label: '💬 Top Reviews' },
                        { id: 'automation', label: '🤖 Automação' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-900">Total de Reviews</h3>
                            <p className="text-2xl font-bold text-blue-600">
                              {reviews.length}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-medium text-green-900">Sentimento Positivo</h3>
                            <p className="text-2xl font-bold text-green-600">
                              {getSentimentStats().positive}%
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h3 className="font-medium text-red-900">Sentimento Negativo</h3>
                            <p className="text-2xl font-bold text-red-600">
                              {getSentimentStats().negative}%
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'sentiment' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Análise de Sentimentos</h3>
                        <div className="space-y-4">
                          {['positive', 'neutral', 'negative'].map((sentiment) => {
                            const stats = getSentimentStats()
                            const percentage = stats[sentiment]
                            return (
                              <div key={sentiment} className="flex items-center">
                                <div className="w-24 text-sm font-medium capitalize">
                                  {sentiment === 'positive' ? '😊 Positivo' : 
                                   sentiment === 'negative' ? '😞 Negativo' : '😐 Neutro'}
                                </div>
                                <div className="flex-1 mx-4">
                                  <div className="bg-gray-200 rounded-full h-4">
                                    <div
                                      className="h-4 rounded-full"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor: getSentimentColor(sentiment)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="w-12 text-sm font-medium text-right">
                                  {percentage}%
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Top 20 Reviews Analisadas</h3>
                        {loading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Carregando reviews...</p>
                          </div>
                        ) : (
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {reviews.slice(0, 20).map((review) => (
                              <div key={review.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <span className="font-medium">{review.user_name}</span>
                                      <div className="flex">
                                        {[...Array(review.rating)].map((_, i) => (
                                          <span key={i} className="text-yellow-500">⭐</span>
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-gray-700 mb-2">{review.content}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>{review.date}</span>
                                      <span
                                        className="px-2 py-1 rounded-full text-xs font-medium"
                                        style={{
                                          backgroundColor: getSentimentColor(review.sentiment) + '20',
                                          color: getSentimentColor(review.sentiment)
                                        }}
                                      >
                                        {review.sentiment} ({(review.sentiment_score * 100).toFixed(0)}%)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'automation' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">🤖 Automação GitHub</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-yellow-800 mb-2">
                            ⚠️ Alertas Detectados
                          </h4>
                          <p className="text-yellow-700 mb-4">
                            Foram detectadas tendências negativas que podem gerar issues automáticas no GitHub.
                          </p>
                          <button
                            onClick={() => simulateGitHubIssue(selectedApp.app_id)}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            🔧 Simular Criação de Issue
                          </button>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-800 mb-2">
                            📊 Estatísticas de Automação
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Issues Criadas:</span>
                              <span className="ml-2 font-medium">12</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Problemas Detectados:</span>
                              <span className="ml-2 font-medium">45</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Confiança da IA:</span>
                              <span className="ml-2 font-medium">92%</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Última Análise:</span>
                              <span className="ml-2 font-medium">2 min atrás</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📱</div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Selecione um aplicativo
                </h2>
                <p className="text-gray-600">
                  Escolha um aplicativo da lista ao lado para ver a análise detalhada
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

