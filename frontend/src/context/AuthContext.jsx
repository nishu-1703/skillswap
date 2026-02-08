import React, { createContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On mount, check if token exists and verify it
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => {
          if (!r.ok) throw new Error('Token invalid')
          return r.json()
        })
        .then(data => {
          if (data.error) {
            localStorage.removeItem('token')
            setUser(null)
          } else {
            setUser(data)
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (email, password, name) => {
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Server error: ' + res.statusText)
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      localStorage.setItem('token', data.token)
      setUser({ id: data.id, email: data.email, name: data.name, credits: data.credits })
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const contentType = res.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Server error: ' + res.statusText)
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('token', data.token)
      setUser({ id: data.id, email: data.email, name: data.name, credits: data.credits })
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
