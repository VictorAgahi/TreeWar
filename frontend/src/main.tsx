import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppThemeProvider } from './context/ThemeContext'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </StrictMode>,
)
