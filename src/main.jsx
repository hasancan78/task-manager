import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Service Worker kaydı (PWA + arka plan bildirimleri)
const updateSW = registerSW({
  onRegistered(registration) {
    console.log('✅ Service Worker kaydedildi:', registration)
    // Periyodik olarak SW'yi güncelle
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // Her saat
    }
  },
  onRegisterError(error) {
    console.error('❌ Service Worker kayıt hatası:', error)
  },
  onOfflineReady() {
    console.log('📱 Uygulama çevrimdışı kullanıma hazır!')
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
