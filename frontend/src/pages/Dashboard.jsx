import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SkillManager from '../components/SkillManager'
import SkillBrowser from '../components/SkillBrowser'
import SessionManager from '../components/SessionManager'
import UserProfile from '../components/UserProfile'
import Messaging from './Messaging'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('browse')

  if (!user) {
    return <main style={{ padding: 'var(--spacing-2xl)', textAlign: 'center', color: 'var(--color-text-light)' }}>Please log in first</main>
  }

  const tabs = [
    { id: 'browse', label: '🔍 Browse Skills', icon: '🔍' },
    { id: 'teach', label: '📚 My Teaching', icon: '📚' },
    { id: 'sessions', label: '📅 My Sessions', icon: '📅' },
    { id: 'messages', label: '💬 Messages', icon: '💬' },
    { id: 'profile', label: '👤 My Profile', icon: '👤' }
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg-secondary)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', padding: 'var(--spacing-2xl)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)', flexWrap: 'wrap', gap: 'var(--spacing-lg)' }}>
            <h1 style={{ 
              fontSize: 'var(--font-size-3xl)', 
              fontWeight: 'var(--font-weight-bold)', 
              margin: '0', 
              color: 'var(--color-text)' 
            }}>Dashboard</h1>
            <div style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
              color: 'white', 
              padding: 'var(--spacing-sm) var(--spacing-lg)', 
              borderRadius: 'var(--border-radius-md)', 
              fontSize: 'var(--font-size-lg)', 
              fontWeight: 'var(--font-weight-semibold)' 
            }}>
              💰 <span aria-label={`${user.credits} credits available`}>{user.credits} Credits</span>
            </div>
          </div>

          {/* User Info Card */}
          <article style={{ 
            background: 'var(--color-bg-secondary)', 
            padding: 'var(--spacing-lg)', 
            borderRadius: 'var(--border-radius-md)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--spacing-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div>
              <p style={{ 
                margin: '0 0 var(--spacing-xs) 0', 
                color: 'var(--color-text-light)', 
                fontSize: 'var(--font-size-sm)' 
              }}>Logged in as</p>
              <p style={{ 
                margin: '0', 
                fontSize: 'var(--font-size-base)', 
                fontWeight: 'var(--font-weight-semibold)', 
                color: 'var(--color-text)' 
              }}>{user.name}</p>
              <p style={{ 
                margin: 'var(--spacing-xs) 0 0 0', 
                color: 'var(--color-text-lighter)', 
                fontSize: 'var(--font-size-sm)' 
              }}>{user.email}</p>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-lg)', 
              alignItems: 'center' 
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontWeight: 'var(--font-weight-bold)',
                fontSize: 'var(--font-size-lg)',
                flexShrink: 0
              }} 
              aria-label={`${user.name} profile avatar`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </article>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav style={{ background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--spacing-2xl)' }} aria-label="Dashboard tabs">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0px', overflowX: 'auto' }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              style={{
                padding: 'var(--spacing-lg)',
                background: 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-light)',
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid var(--color-primary)` : '3px solid transparent',
                cursor: 'pointer',
                fontSize: 'var(--font-size-base)',
                fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <section 
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-2xl) var(--spacing-3xl)' }}>
        {activeTab === 'browse' && <SkillBrowser />}
        {activeTab === 'teach' && <SkillManager onSkillAdded={() => {}} />}
        {activeTab === 'sessions' && <SessionManager />}
        {activeTab === 'messages' && <Messaging />}
        {activeTab === 'profile' && <UserProfile userId={user.id} />}
      </section>
    </main>
  )
}
