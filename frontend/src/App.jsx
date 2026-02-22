import React from 'react'
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Landing from './pages/Landing'
import DashboardNew from './pages/DashboardNew'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Messaging from './pages/Messaging'
import { ThemeToggle } from './components/ThemeToggle'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-100 bg-dark-900 dark:bg-dark-900 border-b border-dark-800 dark:border-dark-700 shadow-lg" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleLogoClick}
            className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            aria-label="SkillSwap home"
          >
            SkillSwap
          </button>

          <nav className="flex items-center gap-3 ml-auto" aria-label="Main navigation">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-dark-200 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 text-sm font-medium text-dark-200 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-bold text-white bg-gradient-primary hover:shadow-glow rounded-lg transition-all"
                  aria-label="Create a new account"
                >
                  Get Started
                </button>
                <ThemeToggle />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading)
    return (
      <div
        className="loading"
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-lg)',
          fontSize: 'var(--font-size-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
        role="status"
        aria-live="polite"
      >
        Loading your experience...
      </div>
    )

  const isDashboardNew = location.pathname === '/dashboard'
  const isLandingRoute = location.pathname === '/'
  const hideHeaderOnLanding = isLandingRoute && !user
  const mainClassName = hideHeaderOnLanding
    ? 'main-content w-full flex-1 px-0'
    : 'main-content max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1'
  const mainStyle = hideHeaderOnLanding ? { maxWidth: '100%', margin: 0, padding: 0 } : undefined

  if (isDashboardNew && user) {
    return <DashboardNew />
  }

  return (
    <div className="app min-h-screen flex flex-col bg-dark-900 dark:bg-dark-900 text-dark-100 dark:text-dark-50">
      {hideHeaderOnLanding ? null : <Header />}
      <main className={mainClassName} style={mainStyle}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={user ? <DashboardNew /> : <LoginPage />} />
          <Route path="/signup" element={user ? <DashboardNew /> : <SignupPage />} />
          <Route path="/dashboard" element={user ? <DashboardNew /> : <LoginPage />} />
          <Route path="/messages" element={user ? <Messaging /> : <LoginPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
