# 🤖 Agente de Análise de Apps - Frontend

Dashboard moderno para análise automática de aplicativos da Google Play e Apple Store usando IA.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Visualização completa de dados de aplicativos
- **Análise de Sentimentos**: Classificação automática de reviews com IA
- **Top Reviews**: Exibição dos 20 principais comentários analisados
- **Automação GitHub**: Criação automática de issues baseada em insights
- **Interface Responsiva**: Design moderno e compatível com dispositivos móveis

## 🛠️ Tecnologias

- **React 18** - Framework frontend
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **API Integration** - Consumo da API Flask hospedada na Vercel

## 🌐 Deploy

O frontend está automaticamente deployado no GitHub Pages através de GitHub Actions.

**URL de Produção**: https://cledsonborges.github.io/analyse/

## 🔗 Integração

Este frontend consome a API do back-end hospedada na Vercel:
- **API Base URL**: https://bff-analyse.vercel.app
- **Endpoints**: `/api/apps`, `/api/apps/{id}/reviews`, `/api/github/*`

## 📊 Funcionalidades da IA

1. **Scraping Automático**: Coleta de reviews da Google Play e Apple Store
2. **Análise de Sentimentos**: Classificação usando API do Gemini
3. **Comparação de Competidores**: Análise comparativa na mesma categoria
4. **Alertas Inteligentes**: Detecção de tendências negativas
5. **Automação de Issues**: Criação automática de backlog no GitHub

## 🎯 Como Usar

1. Acesse o dashboard
2. Selecione um aplicativo da lista
3. Navegue pelas abas para ver diferentes análises
4. Use a automação para gerar issues no GitHub

## 🔧 Desenvolvimento Local

```bash
cd app-analysis-frontend
pnpm install
pnpm run dev
```

## 📈 Métricas

- ✅ Interface responsiva e moderna
- ✅ Integração completa com back-end
- ✅ Análise em tempo real
- ✅ Automação de workflows
- ✅ Deploy automático via GitHub Actions

