
import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home'
import Booking from './pages/Booking'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '/')

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <>
      <LanguageProvider>
        {route === '/' && <Home />}
        {route.startsWith('/booking') && <Booking />}
        {route === '/privacy-policy' && <PrivacyPolicy />}
      </LanguageProvider>
    </>
  )
}

export default App
