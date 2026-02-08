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
        <h3>📥 Teaching Requests ({incomingRequests.length})</h3>
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
        <h3>📤 Learning Requests ({outgoingRequests.length})</h3>
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
        <h3>✅ Accepted Sessions ({acceptedSessions.length})</h3>
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
          <h3>✨ Completed Transactions ({completed.length})</h3>
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
                  {reviewingSessionId === s.id ? '✕ Close' : '⭐ Review'}
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
