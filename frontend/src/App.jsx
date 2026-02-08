import React, { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { API_BASE_URL } from './config'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [backendStatus, setBackendStatus] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(r => r.json())
      .then(j => setBackendStatus(j.status))
      .catch(() => setBackendStatus('down'))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowMobileMenu(false)
  }

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div onClick={() => {
          navigate('/')
          setShowMobileMenu(false)
        }} style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '20px', color: 'white' }}>
          SkillSwap
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user && (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                <span style={{ fontWeight: '500' }}>{user.name}</span>
                <span style={{ fontWeight: '600', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>💰 {user.credits}</span>
              </span>
              <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>Logout</button>
            </>
          )}
          <div style={{ fontSize: '12px', fontWeight: '500', opacity: backendStatus === 'ok' ? 1 : 0.6 }}>
            {backendStatus === 'ok' ? '✓ API Active' : '✗ API Down'}
          </div>
        </div>
      </div>
    </header>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return <div className="loading" style={{ padding: '40px', fontSize: '18px' }}>Loading...</div>

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Dashboard /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Dashboard /> : <SignupPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}
