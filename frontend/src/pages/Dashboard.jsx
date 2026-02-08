import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SkillManager from '../components/SkillManager'
import SkillBrowser from '../components/SkillBrowser'
import SessionManager from '../components/SessionManager'
import UserProfile from '../components/UserProfile'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('browse')

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Please log in first</div>
  }

  const tabs = [
    { id: 'browse', label: '🔍 Browse Skills', icon: '🔍' },
    { id: 'teach', label: '📚 My Teaching', icon: '📚' },
    { id: 'sessions', label: '📅 My Sessions', icon: '📅' },
    { id: 'profile', label: '👤 My Profile', icon: '👤' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0', color: '#111' }}>Dashboard</h1>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '12px 20px', borderRadius: '8px', fontSize: '18px', fontWeight: '600' }}>
              💰 {user.credits} Credits
            </div>
          </div>

          {/* User Info Card */}
          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '13px' }}>Logged in as</p>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#111' }}>{user.name}</p>
              <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '13px' }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                background: activeTab === tab.id ? 'transparent' : 'transparent',
                color: activeTab === tab.id ? '#667eea' : '#666',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#667eea'}
              onMouseOut={(e) => e.target.style.color = activeTab === tab.id ? '#667eea' : '#666'}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }}>
        {activeTab === 'browse' && <SkillBrowser />}
        {activeTab === 'teach' && <SkillManager onSkillAdded={() => {}} />}
        {activeTab === 'sessions' && <SessionManager />}
        {activeTab === 'profile' && <UserProfile userId={user.id} />}
      </div>
    </div>
  )
}
