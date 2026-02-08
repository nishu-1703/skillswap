import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export default function SkillBrowser() {
  const { user } = useAuth()
  const [allSkills, setAllSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

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

  if (loading) return <div className="loading">Loading skills...</div>

  return (
    <section className="skill-browser">
      <h2>Browse & Learn Skills</h2>
      {error && <div className="error-message">{error}</div>}

      {allSkills.length === 0 ? (
        <p className="empty-state">No other skills available yet. Check back later!</p>
      ) : (
        <div className="skills-market">
          {allSkills.map(skill => (
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
              <div className="warning">⚠️ You don't have enough credits</div>
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
