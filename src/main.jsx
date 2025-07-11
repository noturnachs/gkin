import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add dark mode class to html if needed
const savedMode = localStorage.getItem('darkMode')
if (savedMode === 'true' || 
    (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <App />
)
