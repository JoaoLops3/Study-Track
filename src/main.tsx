import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { inject } from '@vercel/speed-insights'
import { Analytics } from "@vercel/analytics/react"
import { testConnection } from './database/db'

// Testar conexão com o banco de dados
testConnection()

// Inicializa o Speed Insights
inject()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
