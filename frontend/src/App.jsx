import React, { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { API_BASE_URL } from './config'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Messaging from './pages/Messaging'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [backendStatus, setBackendStatus] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then(r => r.json())
      .then(j => setBackendStatus(j.status))
      .catch(() => setBackendStatus('down'))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: 'var(--spacing-lg) var(--spacing-xl)', 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #6366f1 100%)',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-lg)'
      }}
      role="banner"
    >
      {/* Logo */}
      <button
        onClick={handleLogoClick}
        style={{ 
          cursor: 'pointer', 
          fontWeight: 'var(--font-weight-bold)', 
          fontSize: 'var(--font-size-2xl)', 
          color: 'white',
          background: 'none',
          border: 'none',
          padding: 'var(--spacing-md)',
          marginRight: 'var(--spacing-xl)'
        }}
        aria-label="SkillSwap home"
      >
        SkillSwap
      </button>

      {/* Navigation - Main */}
      <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }} aria-label="Main navigation">
        {user ? (
          <>
            {/* Messages Button */}
            <button 
              onClick={() => navigate('/messages')}
              className="btn btn-secondary btn-sm"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: 'var(--font-size-sm)'
              }}
              aria-label="Go to messages"
            >
              💬 Messages
            </button>

            {/* User Info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-lg)',
              paddingRight: 'var(--spacing-lg)',
              borderRight: '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ 
                fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)'
              }}>
                {user.name}
              </span>
              <span 
                style={{ 
                  fontWeight: 'var(--font-weight-bold)',
                  background: 'rgba(255,255,255,0.15)',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)'
                }}
                aria-label={`${user.credits} credits`}
              >
                💰 {user.credits}
              </span>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: 'var(--font-size-sm)'
              }}
              aria-label="Log out of your account"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-secondary btn-sm"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                fontSize: 'var(--font-size-sm)'
              }}
              aria-label="Sign in to your account"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="btn btn-primary btn-sm"
              aria-label="Create a new account"
            >
              Get Started
            </button>
          </>
        )}
      </nav>

      {/* API Status */}
      <div 
        style={{ 
          fontSize: 'var(--font-size-xs)', 
          fontWeight: 'var(--font-weight-medium)', 
          opacity: backendStatus === 'ok' ? 1 : 0.6,
          marginLeft: 'var(--spacing-lg)',
          whiteSpace: 'nowrap'
        }}
        aria-live="polite"
        aria-label={`API status: ${backendStatus === 'ok' ? 'Active' : 'Down'}`}
      >
        {backendStatus === 'ok' ? '✓ API Active' : '✗ API Down'}
      </div>
    </header>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return (
    <div 
      className="loading" 
      style={{ 
        padding: 'var(--spacing-5xl) var(--spacing-lg)', 
        fontSize: 'var(--font-size-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}
      role="status"
      aria-live="polite"
    >
      Loading your experience...
    </div>
  )

  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 var(--spacing-lg)', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <Dashboard /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Dashboard /> : <SignupPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <LoginPage />} />
          <Route path="/messages" element={user ? <Messaging /> : <LoginPage />} />
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
