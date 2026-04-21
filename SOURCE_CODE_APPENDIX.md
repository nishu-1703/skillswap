# APPENDIX A: SELECTED SOURCE CODE

Project: SkillSwap - Credit Based Peer-to-Peer Skill Exchange Platform

This appendix contains selected important source code modules for documentation. The complete source code is available in the project repository. Secrets such as database passwords, JWT secrets, and private environment variables are not included.

## A.1 Frontend API Configuration

File: frontend\src\config.js

```js
const defaultBaseUrl =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:4000'
    : 'https://your-backend-url.onrender.com';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

```

## A.2 Authentication Context

File: frontend\src\context\AuthContext.jsx

```jsx
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

  // Refresh current user (fetch latest profile + skills)
  const refreshUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        localStorage.removeItem('token')
        setUser(null)
        return null
      }
      const data = await res.json()
      setUser(data)
      return data
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
      return null
    }
  }

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
      // fetch full user (including skills) and set
      await refreshUser()
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
      // fetch full user (including skills) and set
      await refreshUser()
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
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

```

## A.3 Skill Manager Component

File: frontend\src\components\SkillManager.jsx

```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export function SkillManager({ onSkillAdded }) {
  const { user, refreshUser } = useAuth()
  const [skills, setSkills] = useState([])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillDesc, setNewSkillDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills)
    } else if (user?.id) {
      fetchSkills()
    }
  }, [user])

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setSkills(data)
    } catch (err) {
      setError('Failed to load skills')
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkillName.trim()) return

    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newSkillName, description: newSkillDesc })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // refresh user to get latest skills list
      const updated = await refreshUser()
      setSkills(updated?.skills || [...skills, data])
      setNewSkillName('')
      setNewSkillDesc('')
      if (onSkillAdded) onSkillAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/user/${user.id}/skills/${skillId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const updated = await refreshUser()
      setSkills(updated?.skills || skills.filter(s => s.id !== skillId))
      if (onSkillAdded) onSkillAdded()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="skill-manager">
      {error && <div className="error-message">{error}</div>}

      <h3>Add a New Skill to Teach</h3>
      <form onSubmit={handleAddSkill} className="add-skill-form">
        <div className="form-group">
          <label>Skill Name *</label>
          <input
            type="text"
            placeholder="e.g., Python, Guitar, Cooking"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Brief description of what you teach..."
            value={newSkillDesc}
            onChange={(e) => setNewSkillDesc(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Adding...' : '+ Add Skill'}
        </button>
      </form>

      <div style={{ marginTop: '32px' }}>
        <h3>My Teaching Skills ({skills.length})</h3>
        {skills.length === 0 ? (
          <div className="empty-state">
            <p>No skills added yet. Add your first skill above!</p>
          </div>
        ) : (
          <div className="skills-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{ padding: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#111' }}>{skill.name}</h4>
                  {skill.description && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666', lineHeight: '1.4' }}>{skill.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  style={{
                    padding: '8px 12px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#fecaca'}
                  onMouseOut={(e) => e.target.style.background = '#fee2e2'}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillManager


```

## A.4 Skill Browser Component

File: frontend\src\components\SkillBrowser.jsx

```jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export default function SkillBrowser({ searchQuery = '' }) {
  const { user } = useAuth()
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery || '')

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    setLocalSearch(searchQuery || '')
  }, [searchQuery])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/skills`)
      const data = await res.json()
      // Filter out user's own skills
      const otherSkills = data.filter(s => s.teacherId !== user?.id)
      setAllSkills(otherSkills)
    } catch (err) {
      setError('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSession = async (skill) => {
    setRequesting(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          skillId: skill.id,
          teacherId: skill.teacherId
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setSelectedSkill(null)
      alert('Session requested! Check your requests page.')
    } catch (err) {
      setError(err.message)
    } finally {
      setRequesting(false)
    }
  }

  const visibleSkills = useMemo(() => {
    const normalizedQuery = localSearch.trim().toLowerCase()
    if (!normalizedQuery) {
      return allSkills
    }

    return allSkills.filter((skill) =>
      [skill.name, skill.teacherName, skill.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    )
  }, [allSkills, localSearch])

  if (loading) return <div className="loading">Loading skills...</div>

  return (
    <section className="skill-browser">
      <h2>Browse & Learn Skills</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="skill-search-row">
        <input
          type="text"
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Search skills or teacher..."
          className="skill-search-input"
          aria-label="Search available skills"
        />
      </div>

      {allSkills.length === 0 ? (
        <p className="empty-state">No other skills available yet. Check back later!</p>
      ) : visibleSkills.length === 0 ? (
        <p className="empty-state">No skills match your search.</p>
      ) : (
        <div className="skills-market">
          {visibleSkills.map(skill => (
            <div key={skill.id} className="skill-item">
              <div className="skill-header">
                <h3>{skill.name}</h3>
                <span className="teacher-badge">by {skill.teacherName}</span>
              </div>
              {skill.description && <p className="skill-desc">{skill.description}</p>}
              <button
                onClick={() => setSelectedSkill(skill)}
                className="btn-request"
              >
                Request Session
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSkill && (
        <div className="modal-overlay" onClick={() => setSelectedSkill(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Request "{selectedSkill.name}" from {selectedSkill.teacherName}</h3>
            <p>Cost: {LEARN_COST} credits</p>
            <p>Your credits: {user?.credits}</p>
            {user?.credits < LEARN_COST && (
              <div className="warning">âš ï¸ You don't have enough credits</div>
            )}
            <div className="modal-actions">
              <button
                onClick={() => handleRequestSession(selectedSkill)}
                disabled={requesting || user?.credits < LEARN_COST}
                className="btn primary"
              >
                {requesting ? 'Requesting...' : 'Confirm Request'}
              </button>
              <button onClick={() => setSelectedSkill(null)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const LEARN_COST = 5

```

## A.5 Session Manager Component

File: frontend\src\components\SessionManager.jsx

```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ReviewForm from './ReviewForm'
import { API_BASE_URL } from '../config'

const TEACH_EARN = 5
const LEARN_COST = 5

export default function SessionManager() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reviewingSessionId, setReviewingSessionId] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchSessions()
    }
  }, [user])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      setError('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSession = async (sessionId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      fetchSessions() // Refresh list
    } catch (err) {
      setError(err.message)
    }
  }

  const incomingRequests = sessions.filter(s => s.teacherId === user?.id && s.status === 'pending')
  const outgoingRequests = sessions.filter(s => s.learnerId === user?.id && s.status === 'pending')
  const acceptedSessions = sessions.filter(s => s.status === 'accepted')
  const completed = sessions.filter(s => s.status === 'completed')

  return (
    <section className="session-manager">
      <h2>Session Management</h2>
      {error && <div className="error-message">{error}</div>}

      {loading && <div className="loading">Loading sessions...</div>}

      {/* Incoming Requests (As Teacher) */}
      <div className="session-section">
        <h3>ðŸ“¥ Teaching Requests ({incomingRequests.length})</h3>
        {incomingRequests.length === 0 ? (
          <p className="empty-state">No pending requests</p>
        ) : (
          <div className="sessions-list">
            {incomingRequests.map(s => (
              <div key={s.id} className="session-card">
                <div className="session-info">
                  <h4>{s.skillName}</h4>
                  <p><strong>{s.learnerName}</strong> wants to learn from you</p>
                  <p className="reward">You'll earn {TEACH_EARN} credits if accepted</p>
                </div>
                <div className="session-actions">
                  <button
                    onClick={() => handleUpdateSession(s.id, 'accepted')}
                    className="btn success"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateSession(s.id, 'rejected')}
                    className="btn danger"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing Requests (As Learner) */}
      <div className="session-section">
        <h3>ðŸ“¤ Learning Requests ({outgoingRequests.length})</h3>
        {outgoingRequests.length === 0 ? (
          <p className="empty-state">No pending requests</p>
        ) : (
          <div className="sessions-list">
            {outgoingRequests.map(s => (
              <div key={s.id} className="session-card">
                <div className="session-info">
                  <h4>{s.skillName}</h4>
                  <p>Requested from <strong>{s.teacherName}</strong></p>
                  <p className="cost">Costs {LEARN_COST} credits</p>
                </div>
                <div className="status-badge pending">Pending</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Sessions */}
      <div className="session-section">
        <h3>âœ… Accepted Sessions ({acceptedSessions.length})</h3>
        {acceptedSessions.length === 0 ? (
          <p className="empty-state">No accepted sessions</p>
        ) : (
          <div className="sessions-list">
            {acceptedSessions.map(s => (
              <div key={s.id} className="session-card">
                <div className="session-info">
                  <h4>{s.skillName}</h4>
                  <p>Between <strong>{s.learnerName}</strong> and <strong>{s.teacherName}</strong></p>
                </div>
                {(s.teacherId === user?.id || s.learnerId === user?.id) && (
                  <button
                    onClick={() => handleUpdateSession(s.id, 'completed')}
                    className="btn primary"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      {completed.length > 0 && (
        <div className="session-section">
          <h3>âœ¨ Completed Transactions ({completed.length})</h3>
          <div className="sessions-list">
            {completed.map(s => (
              <div key={s.id} className="session-card completed">
                <div className="session-info">
                  <h4>{s.skillName}</h4>
                  <p>Between <strong>{s.learnerName}</strong> and <strong>{s.teacherName}</strong></p>
                  <p className="completed-date">
                    Completed on {new Date(s.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setReviewingSessionId(reviewingSessionId === s.id ? null : s.id)}
                  className="btn-review"
                >
                  {reviewingSessionId === s.id ? 'âœ• Close' : 'â­ Review'}
                </button>
                {reviewingSessionId === s.id && (
                  <div className="review-form-container">
                    <ReviewForm
                      sessionId={s.id}
                      targetUserName={s.learnerId === user.id ? s.teacherName : s.learnerName}
                      onSubmit={() => {
                        setReviewingSessionId(null)
                        fetchSessions()
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

```

## A.6 Messaging Logic

File: frontend\src\pages\Messaging.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'
import './Messaging.css'

export default function Messaging() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState({})
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    }
  }

  // Fetch messages with selected user
  const fetchMessages = async (otherUserId) => {
    if (!otherUserId) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/direct-chat/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        console.log(`Fetched ${data.length} messages from ${otherUserId}`)
        setMessages(prevMessages => {
          // Merge new messages with existing ones, preventing duplicates
          const messageMap = new Map()
          prevMessages.forEach(m => messageMap.set(m.id, m))
          data.forEach(m => messageMap.set(m.id, m))
          return Array.from(messageMap.values()).sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          )
        })
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }

  // Fetch online status
  const fetchOnlineStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/online/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOnlineUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch online status:', err)
    }
  }

  // Ping online status
  const pingOnlineStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE_URL}/api/online/ping`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }


  // Initialize socket connection
  useEffect(() => {
    if (!user?.id) return

    const token = localStorage.getItem('token')
    socketRef.current = io(API_BASE_URL, {
      auth: { token }
    })

    socketRef.current.on('connect', () => {
      console.log('Connected to server')
    })

    socketRef.current.on('new_message', (message) => {
      console.log('New message received:', message)
      // Only add if it's for the current conversation
      if (selectedUserId && ((message.senderId === user.id && message.receiverId === selectedUserId) || (message.senderId === selectedUserId && message.receiverId === user.id))) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev
          return [...prev, message].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        })
      }
    })

    socketRef.current.on('user_online', (data) => {
      setOnlineUsers(prev => ({ ...prev, [data.userId]: data.isOnline }))
    })

    fetchConversations()
    fetchOnlineStatus()

    // Poll for conversations every 3 seconds to update last messages
    const convInterval = setInterval(fetchConversations, 3000)

    return () => {
      socketRef.current?.disconnect()
      clearInterval(convInterval)
    }
  }, [user?.id])

  // Fetch messages when user is selected


  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUserId) return

    const messageText = newMessage
    setNewMessage('')
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/api/direct-chat/${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: messageText })
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages(prev => {
          // Check if message already exists
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        // Refresh after a short delay to sync with server
        setTimeout(() => fetchMessages(selectedUserId), 500)
      } else {
        // Restore message if send failed
        setNewMessage(messageText)
        console.error('Failed to send message:', await res.text())
      }
    } catch (err) {
      setNewMessage(messageText)

```

## A.7 Backend Server Setup and Main API Routes

File: backend\server.js

```js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const { 
  initializeDB, getUser, getUserByEmail, createUser, 
  getSkill, getAllSkills, getUserSkills, addSkill, deleteSkill,
  getSession, getUserSessions, createSession, updateSessionStatus, updateUserCredits, getUserCredits,
  getReviews, addReview, checkReviewExists, resetDemo,
  addCreditTransaction, getTransactionHistory, getActiveCredits, getExpiringCredits, expireOldCredits, awardTeachingCredits, deductLearningCredits,
  saveDirectMessage, getDirectMessages, getConversationUsers, getAllUsers
} = require('./db');

const app = express();
// Enable CORS with proper headers for GitHub Pages
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Dynamic PORT binding
const PORT = process.env.PORT || 4000;

// Config
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const TEACH_EARN = 5;
const LEARN_COST = 5;

// Simple in-memory chat store for prototype (persist only while server runs)
const chatStore = {};

// Online status tracker: { userId: { lastSeen: timestamp, isOnline: bool } }
const onlineStatus = {};

// Read status tracker: { conversationKey: { userId: lastReadTime } }
const readStatus = {};

const ONLINE_TIMEOUT = 30000; // 30 seconds - mark as offline if no ping

/**
 * Socket.io middleware for authentication
 */
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

/**
 * Socket.io connection handling
 */
io.on('connection', (socket) => {
  const userId = socket.userId;
  console.log(`User ${userId} connected`);

  // Join user's room for private messages
  socket.join(userId);

  // Update online status
  onlineStatus[userId] = { lastSeen: Date.now(), isOnline: true };
  io.emit('user_online', { userId, isOnline: true });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
    onlineStatus[userId] = { lastSeen: Date.now(), isOnline: false };
    io.emit('user_online', { userId, isOnline: false });
  });

  // Handle ping for online status
  socket.on('ping', () => {
    onlineStatus[userId] = { lastSeen: Date.now(), isOnline: true };
  });
});

/**
 * Middleware: Verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {

 * Auth Routes
 */
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    // Check if email exists
    const existing = await getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const id = 'user_' + Date.now();
    await createUser(id, email, password, name);
    
    const user = await getUser(id);
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ id, email, name, credits: user.credits, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed: ' + error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

app.get('/auth/verify', verifyToken, async (req, res) => {
  try {
    const user = await getUser(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const skills = await getUserSkills(req.userId);
    res.json({ id: user.id, email: user.email, name: user.name, credits: user.credits, skills });
  } catch (error) {
    console.error('Verify error:', error);

 * Skill Management Routes
 */
app.post('/api/user/:id/skills', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });
  
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name required' });

  const user = await getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Check if skill already exists
  const userSkills = await getUserSkills(req.userId);
  if (userSkills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ error: 'You already listed this skill' });
  }

  const skillId = 'skill_' + Date.now();
  await addSkill(skillId, name, description || '', req.userId);
  
  const skill = await getSkill(skillId);
  res.status(201).json(skill);
});

app.get('/api/user/:id/skills', async (req, res) => {
  const user = await getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const skills = await getUserSkills(req.params.id);
  res.json(skills || []);
});

app.delete('/api/user/:id/skills/:skillId', verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });

  const user = await getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skill = await getSkill(req.params.skillId);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  await deleteSkill(req.params.skillId);
  res.json({ success: true, skill });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/skills', async (req, res) => {
  const allSkills = await getAllSkills();
  res.json(allSkills);
});

 * Session Management Routes
 */
app.post('/api/sessions', verifyToken, async (req, res) => {
  const { skillId, teacherId } = req.body;
  if (!skillId || !teacherId) return res.status(400).json({ error: 'skillId and teacherId required' });
  if (req.userId === teacherId) return res.status(400).json({ error: 'Cannot request your own skill' });

  const teacher = await getUser(teacherId);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  const sessionId = 'session_' + Date.now();
  await createSession(sessionId, skillId, teacherId, req.userId);
  
  const session = await getSession(sessionId);
  res.status(201).json(session);
});

app.get('/api/sessions', verifyToken, async (req, res) => {
  const userSessions = await getUserSessions(req.userId);
  res.json(userSessions);
});

// Chat endpoints (prototype) - messages are stored in-memory for each session
app.get('/api/chat/:sessionId', verifyToken, async (req, res) => {
  const session = await getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const msgs = chatStore[req.params.sessionId] || [];
  res.json(msgs);
});

app.post('/api/chat/:sessionId', verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required' });
  const session = await getSession(req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const message = { id: 'msg_' + Date.now(), sessionId: req.params.sessionId, senderId: req.userId, text, createdAt: new Date().toISOString() };
  chatStore[req.params.sessionId] = chatStore[req.params.sessionId] || [];

  }
});

app.post('/api/direct-chat/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text required' });
    
    const otherUserId = req.params.otherUserId;
    const message = await saveDirectMessage(req.userId, otherUserId, text);
    
    if (!message) {
      return res.status(500).json({ error: 'Failed to save message' });
    }
    
    // Emit real-time message to both users
    io.to(req.userId).emit('new_message', message);
    io.to(otherUserId).emit('new_message', message);
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/conversations/:otherUserId/mark-read', verifyToken, async (req, res) => {
  const otherUserId = req.params.otherUserId;
  const conversationKey = [req.userId, otherUserId].sort().join('_');
  readStatus[conversationKey] = readStatus[conversationKey] || {};
  readStatus[conversationKey][req.userId] = Date.now();
  res.json({ status: 'marked' });
});

app.put('/api/sessions/:id', verifyToken, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });

  const session = await getSession(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  // Only teacher can accept/reject, or either can mark complete
  if (status !== 'completed' && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (status === 'completed') {
    // Check permissions and credits
    if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const learnerCredits = await getUserCredits(session.learnerId);
    if (learnerCredits < LEARN_COST) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }


// Async initialization and startup
(async () => {
  try {
    await initializeDB();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`SkillSwap backend listening on port ${PORT} (accessible from network)`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
})();

```

## A.8 Database Schema and Important Queries

File: backend\db.js

```js
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

// Respect explicit PGSSLMODE and only default to SSL in production.
const pgSslMode = (process.env.PGSSLMODE || '').toLowerCase();
const sslDisabledModes = new Set(['disable', 'false', '0', 'no']);
const sslEnabledModes = new Set(['require', 'verify-ca', 'verify-full', 'true', '1', 'yes']);

let sslModeFromUrl = null;
if (connectionString) {
  try {
    const parsed = new URL(connectionString);
    sslModeFromUrl = parsed.searchParams.get('sslmode')?.toLowerCase() || null;
  } catch {
    // Ignore URL parse failures and fall back to env-based detection.
  }
}

const sslExplicitlyDisabled = sslDisabledModes.has(pgSslMode) || sslModeFromUrl === 'disable';
const sslExplicitlyEnabled = sslEnabledModes.has(pgSslMode) ||
  (sslModeFromUrl !== null && sslModeFromUrl !== 'disable');
const useSsl = sslExplicitlyEnabled || (!sslExplicitlyDisabled && process.env.NODE_ENV === 'production');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

// Initialize database schema
async function initializeDB() {
  try {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        credits INTEGER DEFAULT 100,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        "teacherId" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("teacherId") REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        "skillId" TEXT NOT NULL,
        "teacherId" TEXT NOT NULL,
        "learnerId" TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        "requestedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completedAt" TIMESTAMP,
        FOREIGN KEY ("skillId") REFERENCES skills(id),
        FOREIGN KEY ("teacherId") REFERENCES users(id),
        FOREIGN KEY ("learnerId") REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        "sessionId" TEXT NOT NULL,
        "targetUserId" TEXT NOT NULL,
        "reviewerId" TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        text TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("sessionId", "reviewerId"),
        FOREIGN KEY ("sessionId") REFERENCES sessions(id),
        FOREIGN KEY ("targetUserId") REFERENCES users(id),
        FOREIGN KEY ("reviewerId") REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
        reason TEXT NOT NULL,
        "sessionId" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
        FOREIGN KEY ("userId") REFERENCES users(id),
        FOREIGN KEY ("sessionId") REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS direct_messages (
        id TEXT PRIMARY KEY,
        "senderId" TEXT NOT NULL,
        "receiverId" TEXT NOT NULL,
        text TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "isRead" BOOLEAN DEFAULT false,
        FOREIGN KEY ("senderId") REFERENCES users(id),
        FOREIGN KEY ("receiverId") REFERENCES users(id)
      )
    `);

    // Initialize demo data if users table is empty
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');

// Helper functions
async function getUser(id) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function createUser(id, email, password, name) {
  try {
    await pool.query(
      `INSERT INTO users (id, email, password, name, credits) VALUES ($1, $2, $3, $4, 100)`,
      [id, email, password, name]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function getAllUsers(excludeUserId = null) {
  try {
    let query = 'SELECT id, name, email FROM users';
    let params = [];
    if (excludeUserId) {
      query += ' WHERE id != $1';
      params = [excludeUserId];
    }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function getSkill(id) {
  try {
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }

async function getSession(id) {
  try {
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

async function getUserSessions(userId) {
  try {
    const result = await pool.query(`
      SELECT s.*, sk.name as "skillName", sk.description as "skillDesc",
             l.name as "learnerName", t.name as "teacherName"
      FROM sessions s
      JOIN skills sk ON s."skillId" = sk.id
      JOIN users l ON s."learnerId" = l.id
      JOIN users t ON s."teacherId" = t.id
      WHERE s."learnerId" = $1 OR s."teacherId" = $2
      ORDER BY s."requestedAt" DESC
    `, [userId, userId]);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function createSession(id, skillId, teacherId, learnerId) {
  try {
    await pool.query(
      `INSERT INTO sessions (id, "skillId", "teacherId", "learnerId", status) VALUES ($1, $2, $3, $4, 'pending')`,
      [id, skillId, teacherId, learnerId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function updateSessionStatus(id, status) {
  try {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    await pool.query(
      `UPDATE sessions SET status = $1, "completedAt" = $2 WHERE id = $3`,

  } catch (error) {
    console.error('Get active credits error:', error);
    return 0;
  }
}

async function getExpiringCredits(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM credit_transactions
       WHERE "userId" = $1 
       AND status = 'active'
       AND type = 'earn'
       AND "expiresAt" IS NOT NULL
       AND "expiresAt" > NOW()
       AND "expiresAt" < NOW() + INTERVAL '30 days'
       ORDER BY "expiresAt" ASC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get expiring credits error:', error);
    return [];
  }
}

async function expireOldCredits(userId) {
  try {
    const result = await pool.query(
      `UPDATE credit_transactions
       SET status = 'expired'
       WHERE "userId" = $1
       AND status = 'active'
       AND type = 'earn'
       AND "expiresAt" < NOW()
       RETURNING *`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Expire old credits error:', error);
    return [];
  }
}

async function awardTeachingCredits(teacherId, sessionId, creditAmount = 10) {
  try {
    // Award credits for teaching
    await addCreditTransaction(teacherId, creditAmount, 'earn', 'Teaching session completed', sessionId);
    // Update total user credits
    await pool.query(
      `UPDATE users SET credits = credits + $1 WHERE id = $2`,
      [creditAmount, teacherId]
    );
    return true;
  } catch (error) {

async function saveDirectMessage(senderId, receiverId, text) {
  try {
    const id = 'msg_' + Date.now();
    await pool.query(
      `INSERT INTO direct_messages (id, "senderId", "receiverId", text) VALUES ($1, $2, $3, $4)`,
      [id, senderId, receiverId, text]
    );
    return { id, senderId, receiverId, text, createdAt: new Date().toISOString() };
  } catch (error) {
    console.error('Save message error:', error);
    return null;
  }
}

async function getDirectMessages(userId, otherUserId) {
  try {
    const result = await pool.query(
      `SELECT * FROM direct_messages 
       WHERE ("senderId" = $1 AND "receiverId" = $2) 
          OR ("senderId" = $2 AND "receiverId" = $1)
       ORDER BY "createdAt" ASC`,
      [userId, otherUserId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
}

async function getConversationUsers(userId) {
  try {
    const result = await pool.query(

module.exports = {
  initializeDB,
  getUser,
  getUserByEmail,
  createUser,
  getAllUsers,
  getSkill,
  getAllSkills,
  getUserSkills,
  addSkill,
  deleteSkill,
  getSession,
  getUserSessions,
  createSession,
  updateSessionStatus,
  updateUserCredits,
  getUserCredits,
  getReviews,
  addReview,
  checkReviewExists,
  resetDemo,
  addCreditTransaction,
  getTransactionHistory,
  getActiveCredits,
  getExpiringCredits,
  expireOldCredits,
  awardTeachingCredits,

```

## A.9 Backend Package Configuration

File: backend\package.json

```json
{
  "name": "skillswap-backend",
  "version": "0.1.0",
  "main": "server.js",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "express-rate-limit": "^8.2.1",
    "jsonwebtoken": "9.0.0",
    "pg": "^8.11.3",
    "socket.io": "^4.8.3"
  }
}

```

## A.10 Frontend Package Configuration

File: frontend\package.json

```json
{
  "name": "skillswap-frontend",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.1",
    "lucide-react": "^0.574.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "socket.io-client": "^4.8.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.24",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^5.0.0"
  }
}

```

