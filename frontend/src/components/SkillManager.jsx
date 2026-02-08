import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export function SkillManager({ onSkillAdded }) {
  const { user } = useAuth()
  const [skills, setSkills] = useState([])
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillDesc, setNewSkillDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.id) {
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

      setSkills([...skills, data])
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
      setSkills(skills.filter(s => s.id !== skillId))
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

