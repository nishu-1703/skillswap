import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, Lock, Mail, Search, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import SittingDoodle from '../components/doodles/SittingDoodle.tsx'
import StrollingDoodle from '../components/doodles/StrollingDoodle.tsx'
import './AuthPages.css'

const setupCards = [
  { title: 'Personal Info', icon: UserRound },
  { title: 'Account Details', icon: Mail },
  { title: 'Preferences', icon: BadgeCheck },
]

export default function SignupPage() {
  const { signup, error } = useAuth()
  const navigate = useNavigate()
  const nameRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formError, setFormError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const focusForm = () => {
    nameRef.current?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    if (!acceptedTerms) {
      setFormError('Please accept the Terms and Conditions to continue.')
      return
    }

    setIsLoading(true)
    try {
      await signup(email, password, name)
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const displayError = formError || error

  return (
    <main className="authx-page authx-page-signup">
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
              <button type="button" className="authx-nav-link" onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          </header>

          <div className="authx-hero-body">
            <div className="authx-figure authx-figure-left" aria-hidden="true">
              <SittingDoodle accent="#f5a524" ink="#1f2a44" />
            </div>

            <div className="authx-copy">
              <h1>Create Your Account</h1>
              <p>Join the community and start your skill-learning journey today.</p>
              <button type="button" className="authx-cta" onClick={focusForm}>
                Sign Up
              </button>
            </div>

            <div className="authx-figure authx-figure-right" aria-hidden="true">
              <StrollingDoodle accent="#ffc15f" ink="#1f2a44" />
            </div>
          </div>
        </section>

        <section className="authx-steps" aria-label="Registration steps">
          {setupCards.map((item, index) => {
            const Icon = item.icon
            return (
              <article key={item.title} className={`authx-step-card authx-step-${index}`}>
                <div className="authx-step-icon">
                  <Icon size={18} />
                </div>
                <h3>{item.title}</h3>
              </article>
            )
          })}
        </section>

        <section className="authx-form-section">
          <article className="authx-form-card">
            <header className="authx-form-head">
              <h2>Sign Up</h2>
              <p>Create your profile and start learning with credits.</p>
            </header>

            {displayError ? (
              <div className="authx-alert" role="alert" aria-live="polite">
                {displayError}
              </div>
            ) : null}

            <form className="authx-form" onSubmit={handleSubmit}>
              <label className="authx-field" htmlFor="signup-name">
                Full Name
                <span className="authx-input-wrap">
                  <UserRound size={16} aria-hidden="true" />
                  <input
                    ref={nameRef}
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </span>
              </label>

              <label className="authx-field" htmlFor="signup-email">
                Email Address
                <span className="authx-input-wrap">
                  <Mail size={16} aria-hidden="true" />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </span>
              </label>

              <label className="authx-field" htmlFor="signup-password">
                Password
                <span className="authx-input-wrap">
                  <Lock size={16} aria-hidden="true" />
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </span>
              </label>

              <label className="authx-field" htmlFor="signup-confirm-password">
                Confirm Password
                <span className="authx-input-wrap">
                  <Lock size={16} aria-hidden="true" />
                  <input
                    id="signup-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </span>
              </label>

              <label className="authx-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>I agree to the Terms and Conditions</span>
              </label>

              <button type="submit" className="authx-submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="authx-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </article>
        </section>

        <footer className="authx-legal">&copy; 2026 SkillSwap. All rights reserved.</footer>
      </div>
    </main>
  )
}
