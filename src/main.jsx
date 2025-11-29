import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AccessibilityProvider } from './context/AccessibilityContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AccessibilityProvider>
  </React.StrictMode>
)
