import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ReviewForm({ sessionId, targetUserName, onSubmit }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: parseInt(rating), text, sessionId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSubmitted(true)
      onSubmit && onSubmit()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="review-success">
        ✨ Thank you for your anonymous review!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Share Your Experience</h4>
      <p className="review-privacy">Your review is posted anonymously for authenticity</p>

      {error && <div className="error-message">{error}</div>}

      <div className="rating-input">
        <label>Rating</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(star => (
            <input
              key={star}
              type="radio"
              name="rating"
              value={star}
              checked={rating === star}
              onChange={(e) => setRating(e.target.value)}
              id={`star-${star}`}
            />
          ))}
          <div className="star-display">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
            ))}
          </div>
        </div>
      </div>

      <textarea
        placeholder="What was your experience? (optional)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
      />
      <p className="char-count">{text.length}/500</p>

      <button type="submit" disabled={loading} className="btn primary">
        {loading ? 'Posting...' : 'Post Anonymous Review'}
      </button>
    </form>
  )
}
