import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, error } = useAuth()
  const [email, setEmail] = useState('alice@skillswap.com')
  const [password, setPassword] = useState('alice123')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(email, password)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
      padding: 'var(--spacing-lg)' 
    }}>
      <article style={{ 
        width: '100%', 
        maxWidth: '420px', 
        background: 'var(--color-bg-light)', 
        border: '1px solid var(--color-border)', 
        borderRadius: 'var(--border-radius-lg)', 
        padding: 'var(--spacing-3xl)', 
        boxShadow: 'var(--shadow-lg)' 
      }}>
        <header style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--color-text)', 
            margin: '0 0 var(--spacing-xs) 0' 
          }}>Welcome Back</h1>
          <p style={{ 
            color: 'var(--color-text-light)', 
            margin: '0',
            fontSize: 'var(--font-size-base)'
          }}>Sign in to your SkillSwap account</p>
        </header>

        {error && <div 
          role="alert"
          aria-live="polite"
          style={{ 
            padding: 'var(--spacing-sm)', 
            background: 'var(--color-error-light)', 
            border: `2px solid var(--color-error)`, 
            borderRadius: 'var(--border-radius-md)', 
            color: 'var(--color-error)', 
            marginBottom: 'var(--spacing-lg)', 
            fontSize: 'var(--font-size-sm)' 
          }}
        >
          {error}
        </div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div className="form-group">
            <label htmlFor="email" style={{ 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-semibold)', 
              color: 'var(--color-text)',
              display: 'block',
              marginBottom: 'var(--spacing-xs)'
            }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-describedby={error ? 'error-message' : undefined}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, outline-offset 0.2s'
              }}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ 
              fontSize: 'var(--font-size-sm)', 
              fontWeight: 'var(--font-weight-semibold)', 
              color: 'var(--color-text)',
              display: 'block',
              marginBottom: 'var(--spacing-xs)'
            }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-describedby={error ? 'error-message' : undefined}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, outline-offset 0.2s'
              }}
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            aria-busy={isLoading}
            style={{
              marginTop: 'var(--spacing-sm)'
            }}
            className="btn btn-primary btn-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <aside style={{ 
          marginTop: 'var(--spacing-2xl)', 
          padding: 'var(--spacing-lg)', 
          background: 'var(--color-bg-secondary)', 
          borderRadius: 'var(--border-radius-md)', 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-text-light)' 
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 'var(--font-weight-semibold)' }}>📝 Demo Account:</p>
          <p style={{ margin: 'var(--spacing-xs) 0' }}>Email: <code style={{ 
            background: 'var(--color-bg-light)', 
            padding: '2px 6px', 
            borderRadius: 'var(--border-radius-sm)', 
            fontFamily: 'monospace',
            color: 'var(--color-primary)'
          }}>alice@skillswap.com</code></p>
          <p style={{ margin: 'var(--spacing-xs) 0' }}>Password: <code style={{ 
            background: 'var(--color-bg-light)', 
            padding: '2px 6px', 
            borderRadius: 'var(--border-radius-sm)', 
            fontFamily: 'monospace',
            color: 'var(--color-primary)'
          }}>alice123</code></p>
        </aside>
      </article>
    </main>
  )
}
