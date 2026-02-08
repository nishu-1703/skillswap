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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ color: '#666', margin: '0' }}>Sign in to your SkillSwap account</p>
        </div>

        {error && <div style={{ padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '6px', color: '#c00', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '12px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '12px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              background: isLoading ? '#aaa' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background 0.2s'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '6px', fontSize: '13px', color: '#666' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>📝 Demo Account:</p>
          <p style={{ margin: '4px 0' }}>Email: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }}>alice@skillswap.com</code></p>
          <p style={{ margin: '4px 0' }}>Password: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }}>alice123</code></p>
        </div>
      </div>
    </div>
  )
}
