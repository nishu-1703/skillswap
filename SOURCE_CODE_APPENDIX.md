# APPENDIX A: SOURCE CODE

Project: SkillSwap - Credit Based Peer-to-Peer Skill Exchange Platform

Note: This appendix contains important project source code modules for documentation. Secrets such as database passwords, JWT secrets, and private environment variables are not included.

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

## A.3 Dashboard Page

File: frontend\src\pages\DashboardNew.jsx

```jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  CircleUserRound,
  Compass,
  GraduationCap,
  Home,
  MessageCircle,
  Search,
  Settings,
  Star,
  Trophy,
  UserRound,
  Wrench,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'
import SkillManager from '../components/SkillManager'
import SkillBrowser from '../components/SkillBrowser'
import SessionManager from '../components/SessionManager'
import CreditPanel from '../components/CreditPanel'
import SittingDoodle from '../components/doodles/SittingDoodle.tsx'
import StrollingDoodle from '../components/doodles/StrollingDoodle.tsx'
import ReadingDoodle from '../components/doodles/ReadingDoodle.tsx'
import SittingReadingDoodle from '../components/doodles/SittingReadingDoodle.tsx'
import './DashboardNew.css'

// feature pillars removed per requirements
const featurePillars = []

const fallbackCourseCards = [
  {
    id: 'fallback-web-development',
    skillId: null,
    teacherId: null,
    title: 'Web Development',
    mentor: 'Priya Sharma',
    pace: 'Beginner',
    tone: 'tone-cyan',
  },
  {
    id: 'fallback-ui-ux-design',
    skillId: null,
    teacherId: null,
    title: 'UI/UX Design',
    mentor: 'Aditi Joshi',
    pace: 'Intermediate',
    tone: 'tone-sunset',
  },
  {
    id: 'fallback-marketing',
    skillId: null,
    teacherId: null,
    title: 'Marketing',
    mentor: 'Noah Patel',
    pace: 'Beginner',
    tone: 'tone-violet',
  },
  {
    id: 'fallback-python',
    skillId: null,
    teacherId: null,
    title: 'Python',
    mentor: 'Rahul Verma',
    pace: 'Advanced',
    tone: 'tone-ocean',
  },
  {
    id: 'fallback-javascript',
    skillId: null,
    teacherId: null,
    title: 'JavaScript',
    mentor: 'Emma Wilson',
    pace: 'Intermediate',
    tone: 'tone-amber',
  },
  {
    id: 'fallback-data-science',
    skillId: null,
    teacherId: null,
    title: 'Data Science',
    mentor: 'Karan Mehta',
    pace: 'Advanced',
    tone: 'tone-teal',
  },
  {
    id: 'fallback-graphic-design',
    skillId: null,
    teacherId: null,
    title: 'Graphic Design',
    mentor: 'Mia Thomas',
    pace: 'Beginner',
    tone: 'tone-pink',
  },
  {
    id: 'fallback-digital-marketing',
    skillId: null,
    teacherId: null,
    title: 'Digital Marketing',
    mentor: 'Liam Scott',
    pace: 'Intermediate',
    tone: 'tone-indigo',
  },
]

const toneCycle = [
  'tone-cyan',
  'tone-sunset',
  'tone-violet',
  'tone-ocean',
  'tone-amber',
  'tone-teal',
  'tone-pink',
  'tone-indigo',
]

const quickActions = [
  { key: 'courses', label: 'My Courses', icon: BookOpen },
  { key: 'messages', label: 'Messages', icon: MessageCircle },
  { key: 'sessions', label: 'Activity', icon: CalendarDays },
  { key: 'skills', label: 'Add Skill', icon: Settings },
]

const dockItems = [
  { key: 'home', target: 'home', label: 'Home', icon: Home },
  { key: 'dashboard', target: 'overview', label: 'Dashboard', icon: Compass },
  { key: 'courses', target: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'community', target: 'messages', label: 'Community', icon: MessageCircle },
  { key: 'profile', target: 'profile', label: 'Profile', icon: UserRound },
]

const panelTitles = {
  courses: 'Explore Courses',
  sessions: 'Session Activity',
  skills: 'Skill Workspace',
  profile: 'Profile Snapshot',
}

function getNameInitial(name) {
  return (name || 'S').trim().charAt(0).toUpperCase()
}

function normalizeSkillTitle(skill, index) {
  return skill.name || skill.skillName || skill.title || `Skill ${index + 1}`
}

export default function DashboardNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [sessions, setSessions] = useState([])
  const [creditBalance, setCreditBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('overview')
  const [enrollingSkillId, setEnrollingSkillId] = useState(null)
  const [enrollFeedback, setEnrollFeedback] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      return
    }

    const controller = new AbortController()

    const loadDashboardData = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

      try {
        const [skillsRes, allSkillsRes, sessionsRes, creditsRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/user/${user.id}/skills`, {
            headers: authHeaders,
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/skills`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/sessions`, {
            headers: authHeaders,
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/api/credits/balance`, {
            headers: authHeaders,
            signal: controller.signal,
          }),
        ])

        if (skillsRes.status === 'fulfilled' && skillsRes.value.ok) {
          const data = await skillsRes.value.json()
          setSkills(Array.isArray(data) ? data : [])
        }

        if (allSkillsRes.status === 'fulfilled' && allSkillsRes.value.ok) {
          const data = await allSkillsRes.value.json()
          setAllSkills(Array.isArray(data) ? data : [])
        }

        if (sessionsRes.status === 'fulfilled' && sessionsRes.value.ok) {
          const data = await sessionsRes.value.json()
          setSessions(Array.isArray(data) ? data : [])
        }

        if (creditsRes.status === 'fulfilled' && creditsRes.value.ok) {
          const data = await creditsRes.value.json()
          setCreditBalance(data.currentBalance ?? user.credits ?? 0)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Dashboard data fetch failed:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    return () => controller.abort()
  }, [user])

  useEffect(() => {
    if (!enrollFeedback) {
      return
    }

    const timeoutId = setTimeout(() => setEnrollFeedback(null), 3200)
    return () => clearTimeout(timeoutId)
  }, [enrollFeedback])

  useEffect(() => {
    if (activePanel !== 'courses') {
      return
    }

    const workspace = document.getElementById('dashboard-workspace')
    if (!workspace) {
      return
    }

    requestAnimationFrame(() => {
      workspace.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [activePanel])

  if (!user) {
    return (
      <main className="alt-dashboard-empty">
        Please log in to access your dashboard.
      </main>
    )
  }

  const taughtCount = skills.filter((skill) => String(skill.teacherId) === String(user.id)).length
  const learnedCount = Math.max(skills.length - taughtCount, 0)
  const completedSessions = sessions.filter((session) => session.status === 'completed').length
  const progressPercent = Math.min(95, Math.max(26, completedSessions * 10 + learnedCount * 5 + 24))
  const hoursLearned = Math.max(12, completedSessions * 3 + learnedCount * 2 + 6)
  const badgesEarned = Math.max(3, Math.floor((completedSessions + taughtCount) / 2) + 2)

  const activities = useMemo(() => {
    const generated = sessions.slice(0, 4).map((session, index) => ({
      id: session.id || `session-${index}`,
      label: session.skillName || session.topic || `Completed session ${index + 1}`,
      detail: session.status === 'completed' ? 'Completed exchange' : 'Upcoming exchange',
      tone: ['amber', 'cyan', 'violet', 'green'][index % 4],
    }))

    if (generated.length >= 4) {
      return generated
    }

    return [
      ...generated,
      { id: 'fallback-1', label: 'Completed HTML Basics', detail: 'Recent activity', tone: 'amber' },
      { id: 'fallback-2', label: 'Started CSS Course', detail: 'Recent activity', tone: 'cyan' },
      { id: 'fallback-3', label: 'Joined Study Group', detail: 'Recent activity', tone: 'violet' },
      { id: 'fallback-4', label: 'Earned 50 Credits', detail: 'Recent activity', tone: 'green' },
    ].slice(0, 4)
  }, [sessions])

  const courseCards = useMemo(() => {
    if (!allSkills.length) {
      return fallbackCourseCards
    }

    return allSkills.map((skill, index) => ({
      id: skill.id || `${normalizeSkillTitle(skill, index)}-${index}`,
      skillId: skill.id ?? null,
      teacherId: skill.teacherId ?? null,
      title: normalizeSkillTitle(skill, index),
      mentor: skill.teacherName || skill.user?.name || 'SkillSwap Mentor',
      pace: skill.level || ['Beginner', 'Intermediate', 'Advanced'][index % 3],
      tone: toneCycle[index % toneCycle.length],
    }))
  }, [allSkills])

  const tutorCards = useMemo(
    () =>
      courseCards.slice(0, 4).map((card, index) => ({
        id: `${card.title}-${index}`,
        name: card.mentor,
        course: card.title,
        rating: (4.7 + (index % 3) * 0.1).toFixed(1),
      })),
    [courseCards]
  )

  const filteredCourseCards = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return courseCards.slice(0, 9)
    }

    return courseCards
      .filter((course) =>
        [course.title, course.mentor, course.pace]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 18)
  }, [courseCards, searchQuery])

  const showWorkspace = activePanel !== 'overview'

  const renderWorkspace = () => {
    if (activePanel === 'courses') {
      return <SkillBrowser searchQuery={searchQuery} />
    }

    if (activePanel === 'sessions') {
      return <SessionManager />
    }

    if (activePanel === 'skills') {
      return <SkillManager onSkillAdded={() => setActivePanel('overview')} />
    }

    if (activePanel === 'profile') {
      return (
        <div className="alt-profile-grid">
          <article>
            <p>Name</p>
            <h4>{user.name}</h4>
          </article>
          <article>
            <p>Email</p>
            <h4>{user.email || 'Not available'}</h4>
          </article>
          <article>
            <p>Credits</p>
            <h4>{creditBalance || user.credits || 0}</h4>
          </article>
          <article>
            <p>Skill Score</p>
            <h4>{taughtCount * 10 + completedSessions * 8 + learnedCount * 4}</h4>
          </article>
          <div className="alt-credit-panel-wrap">
            <CreditPanel />
          </div>
        </div>
      )
    }

    return null
  }

  const handleActionClick = (target) => {
    if (target === 'home') {
      navigate('/')
      return
    }

    if (target === 'messages') {
      navigate('/messages')
      return
    }

    setActivePanel(target)
  }

  const focusDashboardSearch = () => {
    const overviewSection = document.getElementById('dashboard-overview')
    if (overviewSection) {
      overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }

  const handleEnrollClick = async (course) => {
    if (!course.skillId || !course.teacherId) {
      setActivePanel('courses')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const currentSkillId = String(course.skillId)
    setEnrollingSkillId(currentSkillId)
    setEnrollFeedback(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skillId: course.skillId,
          teacherId: course.teacherId,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Unable to create enrollment right now.')
      }

      setSessions((prevSessions) => [payload, ...prevSessions])
      setEnrollFeedback({
        type: 'success',
        text: `Enrollment requested for ${course.title}.`,
      })
    } catch (error) {
      setEnrollFeedback({
        type: 'error',
        text: error.message || 'Enrollment failed. Opening the course browser instead.',
      })
      setActivePanel('courses')
    } finally {
      setEnrollingSkillId(null)
    }
  }

  return (
    <div className="alt-dashboard-page">
      <div className="alt-dashboard-shell" id="dashboard-top">
        <section className="alt-hero">
          <header className="alt-hero-nav">
            <div className="alt-brand">SkillSwap</div>
            <button type="button" className="alt-nav-chip" onClick={() => setActivePanel('courses')}>
              Credits
            </button>
            <div className="alt-hero-controls">
              <button
                type="button"
                className="alt-icon-chip"
                aria-label="Search skills"
                onClick={focusDashboardSearch}
              >
                <Search size={15} />
              </button>
              <button type="button" className="alt-user-chip" onClick={() => setActivePanel('profile')}>
                <CircleUserRound size={15} />
                {user.name}
              </button>
            </div>
          </header>

          <div className="alt-hero-body">
            <div className="alt-hero-figure alt-hero-figure-left" aria-hidden="true">
              <SittingDoodle accent="#f5a524" ink="#1f2a44" />
            </div>

            <div className="alt-hero-copy">
              <h1>Your Learning Journey</h1>
              <p>
                Keep growing with peer-led classes, credit rewards, and guided skill pathways.
              </p>
              <button type="button" className="alt-cta" onClick={() => setActivePanel('courses')}>
                Get Started
              </button>
            </div>

            <div className="alt-hero-figure alt-hero-figure-right" aria-hidden="true">
              <StrollingDoodle accent="#ffc35f" ink="#1f2a44" />
            </div>
          </div>
        </section>

        <section className="alt-pillars" id="dashboard-features">
          <div className="alt-pillars-grid">
            {featurePillars.map((item, index) => {
              const Icon = item.icon
              return (
                <article key={item.title} className={`alt-pillar-card alt-pillar-${index}`}>
                  <div className="alt-pillar-icon">
                    <Icon size={30} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="alt-board" id="dashboard-overview">
          <header className="alt-board-head">
            <h2>Dashboard</h2>
            <button
              type="button"
              className="alt-search-button"
              aria-label="Find a course"
              onClick={focusDashboardSearch}
            >
              <Search size={16} />
            </button>
          </header>

          <div className="alt-search-inline">
            <Search size={15} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search skills, mentors, or level..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search skills"
            />
            {searchQuery ? (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                Clear
              </button>
            ) : null}
          </div>

          {loading ? <p className="alt-loading-note">Syncing your latest dashboard data...</p> : null}
          {enrollFeedback ? (
            <p className={`alt-enroll-feedback ${enrollFeedback.type}`}>{enrollFeedback.text}</p>
          ) : null}

          <div className="alt-board-grid">
            <aside className="alt-side-stack">
              <article className="alt-progress-card">
                <h3>My Progress</h3>
                <div className="alt-progress-ring" style={{ '--progress': `${progressPercent}%` }}>
                  <div>
                    <strong>{progressPercent}%</strong>
                    <span>Complete</span>
                  </div>
                </div>

                <ul>
                  <li>
                    <span>Courses Completed</span>
                    <strong>{completedSessions}</strong>
                  </li>
                  <li>
                    <span>Hours Learned</span>
                    <strong>{hoursLearned}</strong>
                  </li>
                  <li>
                    <span>Badges Earned</span>
                    <strong>{badgesEarned}</strong>
                  </li>
                </ul>
              </article>

              <article className="alt-activity-card">
                <h3>Recent Activity</h3>
                <ul>
                  {activities.map((item) => (
                    <li key={item.id}>
                      <span className={`alt-activity-dot ${item.tone}`} />
                      <div>
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="alt-quick-card">
                <h3>Quick Access</h3>
                <div className="alt-quick-list">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        type="button"
                        key={action.label}
                        onClick={() => handleActionClick(action.key)}
                      >
                        <Icon size={15} />
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </article>
            </aside>

            <div className="alt-course-grid" id="dashboard-courses">
              {filteredCourseCards.map((course, index) => {
                const isEnrolling =
                  course.skillId !== null && enrollingSkillId === String(course.skillId)

                return (
                  <article key={course.id || `${course.title}-${index}`} className={`alt-course-card ${course.tone}`}>
                    <header>
                      <div className="alt-course-avatar">{getNameInitial(course.mentor)}</div>
                      <button type="button" aria-label={`Save ${course.title}`}>
                        <Star size={13} />
                      </button>
                    </header>
                    <h4>{course.title}</h4>
                    <p>{course.mentor}</p>
                    <footer>
                      <span>{course.pace}</span>
                      <button
                        type="button"
                        onClick={() => handleEnrollClick(course)}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? 'Enrolling...' : 'Enroll'}
                      </button>
                    </footer>
                  </article>
                )
              })}
            </div>
            {searchQuery.trim() && filteredCourseCards.length === 0 ? (
              <p className="alt-search-empty">No matching skills found. Try another keyword.</p>
            ) : null}
          </div>
        </section>

        <section className="alt-tutors" id="dashboard-tutors">
          <div className="alt-tutor-figure" aria-hidden="true">
            <SittingReadingDoodle accent="#f8ab2f" ink="#1d2743" />
          </div>

          <div className="alt-tutor-panel">
            <header>
              <h3>Top Tutors</h3>
              <button type="button" onClick={() => setActivePanel('courses')}>
                Explore
              </button>
            </header>

            <div className="alt-tutor-grid">
              {tutorCards.map((tutor) => (
                <article key={tutor.id}>
                  <div className="alt-tutor-avatar">{getNameInitial(tutor.name)}</div>
                  <h4>{tutor.course}</h4>
                  <p>{tutor.name}</p>
                  <div>
                    <Star size={12} />
                    {tutor.rating}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="alt-tutor-figure alt-tutor-figure-right" aria-hidden="true">
            <ReadingDoodle accent="#ff8f45" ink="#1d2743" />
          </div>
        </section>

        {showWorkspace ? (
          <section className="alt-workspace" id="dashboard-workspace">
            <header>
              <div>
                <h3>{panelTitles[activePanel] || 'Workspace'}</h3>
                <p>Opened from quick access tools.</p>
              </div>
              <button type="button" onClick={() => setActivePanel('overview')}>
                Back to Dashboard
              </button>
            </header>
            <div className="alt-workspace-body">{renderWorkspace()}</div>
          </section>
        ) : null}

        <footer className="alt-dock-nav">
          {dockItems.map((item) => {
            const Icon = item.icon
            const isActive =
              (item.key === 'dashboard' && activePanel === 'overview') ||
              activePanel === item.target

            return (
              <button
                type="button"
                key={item.key}
                className={isActive ? 'is-active' : ''}
                onClick={() => handleActionClick(item.target)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}

          <div className="alt-credit-chip" role="status" aria-live="polite">
            <Trophy size={14} />
            {creditBalance || user.credits || 0} credits
          </div>
        </footer>
      </div>
    </div>
  )
}
```

## A.4 Skill Manager Component

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

## A.5 Skill Browser Component

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

## A.6 Session Manager Component

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

## A.7 Credit Panel Component

File: frontend\src\components\CreditPanel.jsx

```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export default function CreditPanel() {
  const { user } = useAuth()
  const [creditData, setcreditData] = useState({
    currentBalance: 0,
    transactions: [],
    expiringCredits: []
  })
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchCreditData()
  }, [user])

  const fetchCreditData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch credit balance
      const balanceRes = await fetch(`${API_BASE_URL}/api/credits/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      let balance = 0
      let transactions = []
      let expiringCredits = 0

      if (balanceRes.ok) {
        const data = await balanceRes.json()
        balance = data.currentBalance || 0
        transactions = data.transactions || []
        expiringCredits = data.expiringCredits?.length || 0
      }

      setcreditData({
        currentBalance: balance,
        transactions: transactions.slice(0, 5), // Last 5 transactions
        expiringCredits: expiringCredits
      })
    } catch (error) {
      console.error('Error fetching credit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTransactionIcon = (type) => {
    return type === 'earn' ? 'â¬†ï¸' : 'â¬‡ï¸'
  }

  const getTransactionColor = (type) => {
    return type === 'earn' ? '#22c55e' : '#ef4444'
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1f2e 0%, #242d3d 100%)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        borderRadius: '12px',
        padding: 'var(--spacing-2xl)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 48px rgba(79, 70, 229, 0.3)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)')}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ margin: 0, color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
          ðŸ’³ Credit Balance
        </h3>
        <button
          onClick={fetchCreditData}
          style={{
            background: 'transparent',
            color: '#a5b4fc',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)')}
        >
          ðŸ”„ Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#a5b4fc', textAlign: 'center' }}>Loading credit data...</p>
      ) : (
        <>
          {/* Main Balance Display */}
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-lg)', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: 'var(--spacing-lg)' }}>
            <p style={{ margin: '0 0 var(--spacing-xs)', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 'bold' }}>Current Balance</p>
            <p style={{ margin: 0, color: '#a78bfa', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {creditData.currentBalance}
            </p>
            <p style={{ margin: 'var(--spacing-xs) 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
              Credits available for learning
            </p>
          </div>

          {/* Expiring Credits Warning */}
          {creditData.expiringCredits > 0 && (
            <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: 'var(--spacing-md)', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.3)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>â°</span>
              <div>
                <p style={{ margin: '0 0 4px 0', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {creditData.expiringCredits} Credits Expiring
                </p>
                <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.75rem' }}>
                  Within 30 days - Use them soon!
                </p>
              </div>
            </div>
          )}

          {/* Transaction History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: '100%',
              background: showHistory ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
              color: '#a5b4fc',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              borderRadius: '8px',
              padding: 'var(--spacing-md)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              marginBottom: showHistory ? 'var(--spacing-lg)' : 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = showHistory ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)'
            }}
          >
            {showHistory ? 'â–¼ Recent Transactions' : 'â–¶ Recent Transactions'}
          </button>

          {/* Transaction History */}
          {showHistory && (
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              {creditData.transactions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {creditData.transactions.map((tx, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '6px',
                        border: '1px solid rgba(79, 70, 229, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>{getTransactionIcon(tx.type)}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 4px 0', color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {tx.reason || (tx.type === 'earn' ? 'Teaching Credit' : 'Learning')}
                          </p>
                          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          color: getTransactionColor(tx.type),
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}>
                          {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                        </p>
                        {tx.expiresAt && (
                          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>
                            Expires: {formatDate(tx.expiresAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center', margin: 'var(--spacing-lg) 0 0 0' }}>
                  No transactions yet
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

## A.8 Messaging Page

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
      })
    } catch (err) {
      console.error('Failed to ping online status:', err)
    }
  }

  // Mark conversation as read
  const markAsRead = async (otherUserId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE_URL}/api/conversations/${otherUserId}/mark-read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

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
  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId)
      markAsRead(selectedUserId)
    }
  }, [selectedUserId])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      console.error('Failed to send message:', err)
    }
  }

  const isUserOnline = (userId) => {
    const status = onlineUsers[userId]
    return status?.isOnline === true
  }

  return (
    <div className="messaging-container">
      <div className="conversations-panel">
        <h2>Messages</h2>
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations yet. Start a session to message someone!</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedUserId === conv.userId ? 'active' : ''}`}
                onClick={() => setSelectedUserId(conv.userId)}
              >
                <div className="conv-avatar">
                  <div className="avatar">{conv.name.charAt(0).toUpperCase()}</div>
                  {isUserOnline(conv.userId) && <div className="online-indicator"></div>}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{conv.name}</div>
                  {conv.lastMessage && (
                    <div className="conv-last-msg">
                      {conv.lastMessage.text.length > 40
                        ? conv.lastMessage.text.substring(0, 40) + '...'
                        : conv.lastMessage.text}
                    </div>
                  )}
                </div>
                <div className="conv-time">
                  {conv.lastMessage && (
                    <span>
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-panel">
        {selectedUserId ? (
          <>
            <div className="chat-header">
              <div className="header-user-info">
                <div className="header-avatar">
                  {conversations.find(c => c.userId === selectedUserId)?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="header-name">
                    {conversations.find(c => c.userId === selectedUserId)?.name}
                  </div>
                  <div className={`header-status ${isUserOnline(selectedUserId) ? 'online' : 'offline'}`}>
                    {isUserOnline(selectedUserId) ? 'ðŸŸ¢ Online' : 'âšª Offline'}
                  </div>
                </div>
              </div>
            </div>

            <div className="messages-view">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-bubble">
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {msg.senderId === user?.id && (
                            <span className="message-status"> âœ“âœ“</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form className="message-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" disabled={loading || !newMessage.trim()} className="send-btn">
                {loading ? 'â³' : 'ðŸ“¤'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-selection">
            <div className="no-selection-content">
              <div className="empty-icon">ðŸ’¬</div>
              <h3>Select a conversation</h3>
              <p>Choose someone from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## A.9 Backend Server and API Routes

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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
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
    res.status(500).json({ error: 'Verification failed: ' + error.message });
  }
});

/**
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

app.get('/api/info', (req, res) => {
  res.json({ 
    name: 'SkillSwap', 
    version: '0.1.0', 
    creditRules: { teachEarn: TEACH_EARN, learnCost: LEARN_COST } 
  });
});

app.get('/api/user/:id', async (req, res) => {
  const u = await getUser(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  res.json(u);
});

/**
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
  chatStore[req.params.sessionId].push(message);
  res.status(201).json(message);
});

// Online status endpoints
app.post('/api/online/ping', verifyToken, async (req, res) => {
  const now = Date.now();
  onlineStatus[req.userId] = { lastSeen: now, isOnline: true };
  res.json({ status: 'pong' });
});

app.get('/api/online/users', verifyToken, async (req, res) => {
  const now = Date.now();
  const users = {};
  for (const userId in onlineStatus) {
    const status = onlineStatus[userId];
    users[userId] = {
      lastSeen: status.lastSeen,
      isOnline: (now - status.lastSeen) < ONLINE_TIMEOUT
    };
  }
  res.json(users);
});

app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await getAllUsers(req.userId);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/conversations', verifyToken, async (req, res) => {
  try {
    // Get all users except current user
    const allUsers = await getAllUsers(req.userId);
    const conversationMap = {};
    
    // Initialize all users as potential conversations
    allUsers.forEach(user => {
      conversationMap[user.id] = {
        userId: user.id,
        name: user.name,
        lastMessage: null,
        unreadCount: 0,
        hasConversation: false
      };
    });
    
    // Get all people current user has sessions with and mark as having conversations
    const userSessions = await getUserSessions(req.userId);
    userSessions.forEach(s => {
      const otherUserId = s.learnerId === req.userId ? s.teacherId : s.learnerId;
      if (conversationMap[otherUserId]) {
        conversationMap[otherUserId].hasConversation = true;
      }
    });
    
    // Also add conversations from direct messages in database and mark as having conversations
    const conversationUserIds = await getConversationUsers(req.userId);
    conversationUserIds.forEach(otherUserId => {
      if (conversationMap[otherUserId]) {
        conversationMap[otherUserId].hasConversation = true;
      }
    });
    
    // Get last messages from database for conversations that exist
    for (const userId in conversationMap) {
      if (!conversationMap[userId].hasConversation) continue;
      
      const messages = await getDirectMessages(req.userId, userId);
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        conversationMap[userId].lastMessage = lastMsg;
      }
    }
    
    const conversations = Object.values(conversationMap).sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return bTime - aTime;
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

app.get('/api/direct-chat/:otherUserId', verifyToken, async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;
    const messages = await getDirectMessages(req.userId, otherUserId);
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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

    // Deduct credits from learner (via transaction)
    const deductResult = await deductLearningCredits(session.learnerId, req.params.id, LEARN_COST);
    if (!deductResult.success) {
      return res.status(400).json({ error: deductResult.error });
    }
    
    // Award credits to teacher (via transaction)
    await awardTeachingCredits(session.teacherId, req.params.id, TEACH_EARN);
  }

  await updateSessionStatus(req.params.id, status);
  const updatedSession = await getSession(req.params.id);
  res.json(updatedSession);
});

app.post('/api/reset-demo', async (req, res) => {
  await resetDemo();
  res.json({ success: true });
});

/**
 * Review System Routes (Anonymous)
 */
app.post('/api/reviews', verifyToken, async (req, res) => {
  const { rating, text, sessionId } = req.body;
  if (!rating || !sessionId) return res.status(400).json({ error: 'Rating and sessionId required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

  // Verify session exists and user is part of it
  const session = await getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status !== 'completed') {
    return res.status(400).json({ error: 'Can only review completed sessions' });
  }
  if (req.userId !== session.learnerId && req.userId !== session.teacherId) {
    return res.status(403).json({ error: 'Not part of this session' });
  }

  // Prevent multiple reviews from same user for same session
  if (await checkReviewExists(sessionId, req.userId)) {
    return res.status(409).json({ error: 'You already reviewed this session' });
  }

  // Determine who is being reviewed (the OTHER person in session)
  const targetUserId = req.userId === session.learnerId ? session.teacherId : session.learnerId;

  const reviewId = 'review_' + Date.now();
  await addReview(reviewId, sessionId, targetUserId, req.userId, rating, text || '');
  
  // Return anonymous version (no reviewer identity)
  res.status(201).json({
    id: reviewId,
    rating,
    text: text || '',
    createdAt: new Date().toISOString(),
    verified: 'from completed session'
  });
});

app.get('/api/reviews/:userId', async (req, res) => {
  // Get anonymous reviews for a user
  const userReviews = await getReviews(req.params.userId);
  
  // Return anonymous version
  const anonymousReviews = userReviews.map(r => ({
    id: r.id,
    rating: r.rating,
    text: r.text,
    createdAt: r.createdAt,
    verified: 'from completed session'
  }));

  // Calculate average rating
  const avgRating = userReviews.length > 0
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
    : null;

  res.json({
    reviews: anonymousReviews,
    totalReviews: userReviews.length,
    averageRating: avgRating
  });
});

/**
 * Credit Transaction Routes
 */
app.get('/api/credits/transactions', verifyToken, async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const transactions = await getTransactionHistory(req.userId, parseInt(limit));
    
    // Expire old credits before returning
    await expireOldCredits(req.userId);
    
    res.json(transactions);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions: ' + error.message });
  }
});

app.get('/api/credits/expiring', verifyToken, async (req, res) => {
  try {
    const expiringCredits = await getExpiringCredits(req.userId);
    res.json({ expiringCredits, count: expiringCredits.length });
  } catch (error) {
    console.error('Expiring credits fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch expiring credits: ' + error.message });
  }
});

app.post('/api/credits/award-teaching', verifyToken, async (req, res) => {
  try {
    const { sessionId, creditAmount = 10 } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }
    
    const success = await awardTeachingCredits(req.userId, sessionId, creditAmount);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to award teaching credits' });
    }
    
    const user = await getUser(req.userId);
    res.json({ success: true, newBalance: user.credits, creditAwarded: creditAmount });
  } catch (error) {
    console.error('Award teaching credits error:', error);
    res.status(500).json({ error: 'Failed to award credits: ' + error.message });
  }
});

app.post('/api/credits/deduct-learning', verifyToken, async (req, res) => {
  try {
    const { sessionId, creditAmount = 10 } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }
    
    const result = await deductLearningCredits(req.userId, sessionId, creditAmount);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    const user = await getUser(req.userId);
    res.json({ success: true, newBalance: user.credits, creditDeducted: creditAmount });
  } catch (error) {
    console.error('Deduct learning credits error:', error);
    res.status(500).json({ error: 'Failed to deduct credits: ' + error.message });
  }
});

app.get('/api/credits/balance', verifyToken, async (req, res) => {
  try {
    const user = await getUser(req.userId);
    const transactions = await getTransactionHistory(req.userId, 100);
    const expiringCredits = await getExpiringCredits(req.userId);
    
    res.json({
      currentBalance: user.credits,
      transactions,
      expiringCredits,
      expiringCount: expiringCredits.length
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch balance: ' + error.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("SkillSwap backend is live ðŸš€");
});

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

## A.10 Database Schema and Query Layer

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
    if (parseInt(userCount.rows[0].count) === 0) {
      await insertDemoData();
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function insertDemoData() {
  const now = new Date().toISOString();

  try {
    await pool.query(
      `INSERT INTO users (id, email, password, name, credits, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['1', 'alice@skillswap.com', 'alice123', 'Alice', 100, now]
    );

    await pool.query(
      `INSERT INTO users (id, email, password, name, credits, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['2', 'bob@skillswap.com', 'bob123', 'Bob', 100, now]
    );

    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId", "createdAt")
       VALUES ($1, $2, $3, $4, $5)`,
      ['skill_1', 'Guitar', 'Beginner guitar lessons', '1', now]
    );

    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId", "createdAt")
       VALUES ($1, $2, $3, $4, $5)`,
      ['skill_2', 'Cooking', 'Home cooking basics', '2', now]
    );

    await pool.query(
      `INSERT INTO sessions (id, "skillId", "teacherId", "learnerId", status, "requestedAt")
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['session_1', 'skill_1', '1', '2', 'pending', now]
    );

    console.log('Demo data inserted');
  } catch (error) {
    console.error('Demo data insertion error:', error);
  }
}

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
}

async function getAllSkills() {
  try {
    const result = await pool.query(`
      SELECT s.*, u.name as "teacherName", u.email as "teacherEmail"
      FROM skills s
      JOIN users u ON s."teacherId" = u.id
      ORDER BY s."createdAt" DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function getUserSkills(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM skills WHERE "teacherId" = $1 ORDER BY "createdAt" DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function addSkill(id, name, description, teacherId) {
  try {
    await pool.query(
      `INSERT INTO skills (id, name, description, "teacherId") VALUES ($1, $2, $3, $4)`,
      [id, name, description, teacherId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function deleteSkill(id) {
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    return { changes: 1 };
  } catch (error) {
    console.error('Delete error:', error);
    return { changes: 0 };
  }
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
      [status, completedAt, id]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Update error:', error);
    return { changes: 0 };
  }
}

async function updateUserCredits(userId, amount) {
  try {
    await pool.query(
      `UPDATE users SET credits = credits + $1 WHERE id = $2`,
      [amount, userId]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Update error:', error);
    return { changes: 0 };
  }
}

async function getUserCredits(userId) {
  try {
    const result = await pool.query('SELECT credits FROM users WHERE id = $1', [userId]);
    return result.rows[0] ? result.rows[0].credits : 0;
  } catch (error) {
    console.error('Query error:', error);
    return 0;
  }
}

async function getReviews(targetUserId) {
  try {
    const result = await pool.query(
      `SELECT id, rating, text, "createdAt" FROM reviews WHERE "targetUserId" = $1 ORDER BY "createdAt" DESC`,
      [targetUserId]
    );
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

async function addReview(id, sessionId, targetUserId, reviewerId, rating, text) {
  try {
    await pool.query(
      `INSERT INTO reviews (id, "sessionId", "targetUserId", "reviewerId", rating, text) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, sessionId, targetUserId, reviewerId, rating, text]
    );
    return { changes: 1 };
  } catch (error) {
    console.error('Insert error:', error);
    return { changes: 0 };
  }
}

async function checkReviewExists(sessionId, reviewerId) {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM reviews WHERE "sessionId" = $1 AND "reviewerId" = $2`,
      [sessionId, reviewerId]
    );
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Query error:', error);
    return false;
  }
}

async function resetDemo() {
  try {
    await pool.query('DELETE FROM reviews');
    await pool.query('DELETE FROM credit_transactions');
    await pool.query('DELETE FROM sessions');
    await pool.query('DELETE FROM skills');
    await pool.query('DELETE FROM users');
    await insertDemoData();
  } catch (error) {
    console.error('Reset error:', error);
  }
}

// Credit Transaction Functions
async function addCreditTransaction(userId, amount, type, reason, sessionId = null) {
  try {
    const id = 'txn_' + Date.now();
    // Credits earned from teaching expire after 6 months (180 days)
    const expiresAt = type === 'earn' ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) : null;
    
    const result = await pool.query(
      `INSERT INTO credit_transactions (id, "userId", amount, type, reason, "sessionId", "expiresAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, userId, amount, type, reason, sessionId, expiresAt]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Add credit transaction error:', error);
    return null;
  }
}

async function getTransactionHistory(userId, limit = 20) {
  try {
    const result = await pool.query(
      `SELECT * FROM credit_transactions 
       WHERE "userId" = $1 
       ORDER BY "createdAt" DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Get transaction history error:', error);
    return [];
  }
}

async function getActiveCredits(userId) {
  try {
    const result = await pool.query(
      `SELECT SUM(CASE WHEN type = 'earn' THEN amount ELSE -amount END) as "activeCredits"
       FROM credit_transactions
       WHERE "userId" = $1 AND status = 'active' AND (type = 'earn' OR type = 'spend')`,
      [userId]
    );
    return result.rows[0]?.activeCredits || 0;
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
    console.error('Award teaching credits error:', error);
    return false;
  }
}

async function deductLearningCredits(learnerId, sessionId, creditAmount = 10) {
  try {
    // Check if user has enough credits
    const user = await getUser(learnerId);
    if (user.credits < creditAmount) {
      return { success: false, error: 'Insufficient credits' };
    }
    
    // Deduct credits for learning
    await addCreditTransaction(learnerId, creditAmount, 'spend', 'Learning session started', sessionId);
    // Update total user credits
    await pool.query(
      `UPDATE users SET credits = credits - $1 WHERE id = $2`,
      [creditAmount, learnerId]
    );
    return { success: true };
  } catch (error) {
    console.error('Deduct learning credits error:', error);
    return { success: false, error: error.message };
  }
}

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
      `SELECT DISTINCT 
         CASE 
           WHEN "senderId" = $1 THEN "receiverId"
           ELSE "senderId"
         END as "otherUserId",
         MAX("createdAt") as "lastMessageTime"
       FROM direct_messages
       WHERE "senderId" = $1 OR "receiverId" = $1
       GROUP BY 
         CASE 
           WHEN "senderId" = $1 THEN "receiverId"
           ELSE "senderId"
         END
       ORDER BY "lastMessageTime" DESC`,
      [userId]
    );
    return result.rows.map(r => r.otherUserId);
  } catch (error) {
    console.error('Get conversation users error:', error);
    return [];
  }
}

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
  deductLearningCredits,
  saveDirectMessage,
  getDirectMessages,
  getConversationUsers
};
```

## A.11 Backend Package Configuration

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

## A.12 Frontend Package Configuration

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


