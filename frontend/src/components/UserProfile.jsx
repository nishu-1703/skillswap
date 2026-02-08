import React, { useState, useEffect } from 'react'
import ReviewsDisplay from './ReviewsDisplay'
import { API_BASE_URL } from '../config'

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${userId}`)
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('Failed to load user:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (!user) return <p>User not found</p>

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <strong>{user.skills?.length || 0}</strong>
          <span>Skills Listed</span>
        </div>
        <div className="stat">
          <strong>{user.credits}</strong>
          <span>Credits</span>
        </div>
      </div>

      <div className="profile-section">
        <h3>Community Reviews</h3>
        <ReviewsDisplay userId={userId} />
      </div>
    </div>
  )
}
