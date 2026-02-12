import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export default function DashboardNew() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [allSkills, setAllSkills] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePanel, setActivePanel] = useState('overview')

  // Fetch data on mount
  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch user skills
      const skillRes = await fetch(`${API_BASE_URL}/api/user/${user.id}/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (skillRes.ok) {
        const skillData = await skillRes.json()
        setSkills(skillData)
      }

      // Fetch all skills
      const allSkillsRes = await fetch(`${API_BASE_URL}/api/skills`)
      if (allSkillsRes.ok) {
        const allSkillsData = await allSkillsRes.json()
        setAllSkills(allSkillsData)
      }

      // Fetch user sessions
      const sessionsRes = await fetch(`${API_BASE_URL}/api/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <main style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>
        Please log in first
      </main>
    )
  }

  // Calculate metrics
  const skillsTaught = skills.filter(s => s.teacherId === user.id).length
  const skillsLearned = skills.filter(s => s.teacherId !== user.id).length
  const activeExchanges = sessions.filter(s => s.status === 'active').length
  const completedExchanges = sessions.filter(s => s.status === 'completed').length

  const skillScore = (skillsTaught * 10) + (skillsLearned * 5) + (completedExchanges * 20)
  const balanceScore = skillsTaught > 0 ? Math.round((skillsLearned / skillsTaught) * 100) : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1419' }}>
      {/* ========== SIDEBAR: IDENTITY ANCHOR ========== */}
      <aside
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)',
          borderRight: '1px solid rgba(79, 70, 229, 0.2)',
          padding: 'var(--spacing-2xl)',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          boxShadow: '2px 0 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Profile Section */}
        <div style={{ marginBottom: 'var(--spacing-3xl)', textAlign: 'center' }}>
          {/* Avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 auto var(--spacing-lg)',
              boxShadow: '0 0 30px rgba(79, 70, 229, 0.5)'
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <h3 style={{ margin: '0 0 var(--spacing-xs)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
            {user.name}
          </h3>

          {/* Skill Level Badge */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#a5b4fc',
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '1px solid rgba(79, 70, 229, 0.4)',
              marginTop: 'var(--spacing-xs)'
            }}
          >
            {skillsTaught > 5 ? '⭐ Expert' : skillsTaught > 2 ? '🎯 Intermediate' : '🌱 Beginner'}
          </div>

          {/* SkillSwap Score */}
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <p style={{ margin: '0 0 var(--spacing-xs)', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 'bold' }}>
              SkillScore
            </p>
            <p style={{ margin: '0', color: '#4ade80', fontSize: '2rem', fontWeight: 'bold' }}>
              {skillScore}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'skills', label: '🎓 My Skills', icon: '🎓' },
            { id: 'exchanges', label: '🔄 Exchanges', icon: '🔄' },
            { id: 'messages', label: '💬 Messages', icon: '💬' },
            { id: 'profile', label: '👤 Profile', icon: '👤' },
            { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActivePanel(item.id)}
              style={{
                background: activePanel === item.id ? 'rgba(79, 70, 229, 0.3)' : 'transparent',
                border: activePanel === item.id ? '1px solid rgba(79, 70, 229, 0.6)' : '1px solid transparent',
                color: activePanel === item.id ? '#a5b4fc' : '#6b7280',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: activePanel === item.id ? '600' : '500',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={e => !activePanel === item.id && (e.target.style.background = 'rgba(79, 70, 229, 0.1)')}
              onMouseLeave={e => !activePanel === item.id && (e.target.style.background = 'transparent')}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Credits Display */}
        <div
          style={{
            marginTop: 'var(--spacing-3xl)',
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(120, 58, 237, 0.1) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: '0 0 var(--spacing-xs)', color: '#6b7280', fontSize: '0.85rem' }}>Available Credits</p>
          <p style={{ margin: '0', color: '#fbbf24', fontSize: '1.5rem', fontWeight: 'bold' }}>💰 {user.credits}</p>
        </div>
      </aside>

      {/* ========== MAIN CONTENT AREA ========== */}
      <div style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ========== TOP BAR: COMMAND LAYER ========== */}
        <header
          style={{
            background: 'linear-gradient(90deg, #1a1f2e 0%, #242d3d 100%)',
            borderBottom: '1px solid rgba(79, 70, 229, 0.2)',
            padding: 'var(--spacing-lg) var(--spacing-2xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <h1 style={{ margin: '0', color: 'white', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
            Skill Intelligence Dashboard
          </h1>

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search skills or users..."
              style={{
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                color: 'white',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: '8px',
                width: '250px',
                placeholder: '#a0aec0'
              }}
            />

            {/* Add Skill Button */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)'
              }}
              onMouseEnter={e => (e.target.style.boxShadow = '0 0 40px rgba(79, 70, 229, 0.8)')}
              onMouseLeave={e => (e.target.style.boxShadow = '0 0 20px rgba(79, 70, 229, 0.4)')}
            >
              + Add Skill
            </button>

            {/* Notification Bell */}
            <button
              style={{
                background: 'transparent',
                color: '#a5b4fc',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              🔔
            </button>
          </div>
        </header>

        {/* ========== MAIN GRID: SKILL INTELLIGENCE PANELS ========== */}
        <main
          style={{
            flex: 1,
            padding: 'var(--spacing-2xl)',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--spacing-2xl)',
            alignContent: 'start'
          }}
        >
          {activePanel === 'overview' && (
            <>
              {/* Panel 1: Skill Growth Overview */}
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  📊 Growth Overview
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: 'var(--spacing-lg)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <p style={{ margin: '0 0 var(--spacing-xs)', color: '#86efac', fontSize: '0.85rem', fontWeight: 'bold' }}>Skills Taught</p>
                    <p style={{ margin: '0', color: '#22c55e', fontSize: '2rem', fontWeight: 'bold' }}>{skillsTaught}</p>
                  </div>
                  <div style={{ background: 'rgba(96, 165, 250, 0.1)', padding: 'var(--spacing-lg)', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                    <p style={{ margin: '0 0 var(--spacing-xs)', color: '#bfdbfe', fontSize: '0.85rem', fontWeight: 'bold' }}>Skills Learned</p>
                    <p style={{ margin: '0', color: '#60a5fa', fontSize: '2rem', fontWeight: 'bold' }}>{skillsLearned}</p>
                  </div>
                </div>
              </div>

              {/* Panel 2: Skill Balance Meter */}
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  ⚖️ Balance Meter
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ margin: '0 0 var(--spacing-xs)', color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 'bold' }}>Balance Score</p>
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: `conic-gradient(#4ade80 ${balanceScore}%, rgba(79, 70, 229, 0.2) 0%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontWeight: 'bold',
                        color: '#4ade80',
                        fontSize: '1.2rem'
                      }}
                    >
                      {balanceScore}%
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', fontSize: '0.85rem' }}>
                  <div><span style={{ color: '#a5b4fc' }}>Offered:</span> <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{skillsTaught}</span></div>
                  <div><span style={{ color: '#a5b4fc' }}>Received:</span> <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{skillsLearned}</span></div>
                </div>
              </div>

              {/* Panel 3: Active Exchanges */}
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  🔄 Active Exchanges
                </h3>
                {sessions.length === 0 ? (
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>No active exchanges yet. Start learning!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {sessions.slice(0, 3).map(session => (
                      <div
                        key={session.id}
                        style={{
                          background: 'rgba(79, 70, 229, 0.1)',
                          padding: 'var(--spacing-md)',
                          borderRadius: '8px',
                          border: '1px solid rgba(79, 70, 229, 0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#a5b4fc', fontWeight: 'bold' }}>{session.status === 'active' ? '🟢 Active' : '✅ Completed'}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{session.skillId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel 4: Skill Recommendations */}
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  💡 Recommended Skills
                </h3>
                <p style={{ margin: '0 0 var(--spacing-lg)', color: '#a5b4fc', fontSize: '0.9rem' }}>You may want to learn:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {['Machine Learning', 'UI Animation', 'Backend Development'].map((skill, idx) => (
                    <button
                      key={idx}
                      style={{
                        background: 'rgba(79, 70, 229, 0.1)',
                        border: '1px solid rgba(79, 70, 229, 0.3)',
                        color: '#a5b4fc',
                        padding: 'var(--spacing-md)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)'
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)'
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)'
                      }}
                    >
                      + Learn {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel 5: Skill Inventory */}
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  📚 Your Skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                  {skills.length === 0 ? (
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '0.9rem' }}>No skills added yet</p>
                  ) : (
                    skills.slice(0, 6).map((skill, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(79, 70, 229, 0.15)',
                          color: '#a5b4fc',
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          borderRadius: '20px',
                          border: '1px solid rgba(79, 70, 229, 0.3)',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        {skill.name || skill} ● {skill.teacherId === user.id ? '⭐ teaching' : '🌱 learning'}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Panel 6: Ecosystem Activity Feed (spans 2 columns) */}
              <div
                style={{
                  gridColumn: 'span 2',
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
                <h3 style={{ margin: '0 0 var(--spacing-lg)', color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  🌍 Ecosystem Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {[
                    { user: 'Rahul', action: 'started learning', skill: 'Python', emoji: '🐍' },
                    { user: 'Ananya', action: 'completed', skill: 'React exchange', emoji: '⚛️' },
                    { user: 'David', action: 'added new skill', skill: 'Figma', emoji: '🎨' },
                    { user: 'Priya', action: 'started teaching', skill: 'UI Design', emoji: '✨' }
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(79, 70, 229, 0.08)',
                        padding: 'var(--spacing-md)',
                        borderRadius: '8px',
                        border: '1px solid rgba(79, 70, 229, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{activity.emoji}</span>
                      <span style={{ color: '#a5b4fc', flex: 1 }}>
                        <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{activity.user}</span> {activity.action} <span style={{ fontWeight: 'bold', color: '#4ade80' }}>{activity.skill}</span>
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>2m ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* OTHER PANELS */}
          {activePanel === 'skills' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-2xl)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: 'white' }}>Your Skills Manager</h2>
                <p style={{ color: '#a5b4fc' }}>Manage and showcase your skills here</p>
              </div>
            </div>
          )}

          {activePanel === 'exchanges' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-2xl)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: 'white' }}>Exchanges</h2>
                <p style={{ color: '#a5b4fc' }}>View and manage your skill exchanges</p>
              </div>
            </div>
          )}

          {activePanel === 'messages' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-2xl)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: 'white' }}>Messages</h2>
                <p style={{ color: '#a5b4fc' }}>Your conversations</p>
              </div>
            </div>
          )}

          {activePanel === 'profile' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-2xl)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: 'white' }}>Profile</h2>
                <p style={{ color: '#a5b4fc' }}>Your profile information</p>
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-2xl)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                <h2 style={{ color: 'white' }}>Settings</h2>
                <p style={{ color: '#a5b4fc' }}>Configure your preferences</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
