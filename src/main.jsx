import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Set initial theme before first paint without inline script in index.html (CSP strict)
try {
  const raw = localStorage.getItem('salary_calc_state_v5')
  let initialTheme = 'light'
  if (raw) {
    const parsed = JSON.parse(raw)
    if (parsed && (parsed.theme === 'dark' || parsed.theme === 'light')) {
      initialTheme = parsed.theme
    }
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialTheme = 'dark'
  }
  document.documentElement.dataset.theme = initialTheme
  const metaTheme = document.getElementById('meta-theme-color')
  if (metaTheme) {
    metaTheme.setAttribute('content', initialTheme === 'dark' ? '#090d16' : '#f1f5f9')
  }
} catch {
  document.documentElement.dataset.theme = 'light'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
