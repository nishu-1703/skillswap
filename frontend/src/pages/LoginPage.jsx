import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SittingDoodle from '../components/doodles/SittingDoodle.tsx'
import StrollingDoodle from '../components/doodles/StrollingDoodle.tsx'
import './AuthPages.css'

export default function LoginPage() {
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const focusForm = () => {
    emailRef.current?.focus()
  }

  const fillDemo = () => {
    setEmail('alice@skillswap.com')
    setPassword('alice123')
    focusForm()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="authx-page authx-page-login">
      <div className="authx-shell">
        <section className="authx-hero">
          <header className="authx-nav">
            <button type="button" className="authx-brand" onClick={() => navigate('/')}>
              SkillSwap
            </button>
            <span className="authx-pill">Credits</span>
            <div className="authx-nav-actions">
              <button type="button" className="authx-icon-chip" aria-label="Search">
                <Search size={15} />
              </button>
              <button type="button" className="authx-nav-link" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </header>

          <div className="authx-hero-body">
            <div className="authx-figure authx-figure-left" aria-hidden="true">
              <SittingDoodle accent="#f5a524" ink="#1f2a44" />
            </div>

            <div className="authx-copy">
              <h1>Welcome Back</h1>
              <p>Sign in and continue exchanging skills with your learning community.</p>
              <button type="button" className="authx-cta" onClick={focusForm}>
                Sign In
              </button>
            </div>

            <div className="authx-figure authx-figure-right" aria-hidden="true">
              <StrollingDoodle accent="#ffc15f" ink="#1f2a44" />
            </div>
          </div>
        </section>

        <section className="authx-form-section">
          <article className="authx-form-card">
            <header className="authx-form-head">
              <h2>Login</h2>
              <p>Access your dashboard, credits, and ongoing sessions.</p>
            </header>

            {error ? (
              <div className="authx-alert" role="alert" aria-live="polite">
                {error}
              </div>
            ) : null}

            <form className="authx-form" onSubmit={handleSubmit}>
              <label className="authx-field" htmlFor="login-email">
                Email Address
                <span className="authx-input-wrap">
                  <Mail size={16} aria-hidden="true" />
                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </span>
              </label>

              <label className="authx-field" htmlFor="login-password">
                Password
                <span className="authx-input-wrap">
                  <Lock size={16} aria-hidden="true" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </span>
              </label>

              <button type="submit" className="authx-submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="authx-helper">
              <button type="button" className="authx-helper-btn" onClick={fillDemo}>
                Use Demo Account
              </button>
              <span>Email: <code>alice@skillswap.com</code> Password: <code>alice123</code></span>
            </div>

            <p className="authx-switch">
              New to SkillSwap? <Link to="/signup">Create account</Link>
            </p>
          </article>
        </section>

        <footer className="authx-legal">&copy; 2026 SkillSwap. All rights reserved.</footer>
      </div>
    </main>
  )
}
