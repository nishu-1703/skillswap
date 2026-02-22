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

const featurePillars = [
  {
    title: 'Learning',
    description: 'Track active courses, complete sessions, and grow your daily learning streak.',
    icon: GraduationCap,
  },
  {
    title: 'Skills',
    description: 'Teach what you know, learn from peers, and grow your credit balance faster.',
    icon: Wrench,
  },
  {
    title: 'Community',
    description: 'Connect with learners, exchange feedback, and collaborate on projects.',
    icon: MessageCircle,
  },
]

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
  { key: 'sessions', label: 'Calendar', icon: CalendarDays },
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
  sessions: 'Session Calendar',
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
