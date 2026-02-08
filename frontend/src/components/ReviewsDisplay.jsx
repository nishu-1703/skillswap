import React, { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'

export default function ReviewsDisplay({ userId }) {
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [userId])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${userId}`)
      const data = await res.json()
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading reviews...</div>
  if (!reviews || reviews.totalReviews === 0) {
    return <p className="empty-state">No reviews yet</p>
  }

  return (
    <div className="reviews-display">
      <div className="rating-summary">
        <div className="avg-rating">
          <span className="big-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(reviews.averageRating) ? 'star filled' : 'star'}>
                ★
              </span>
            ))}
          </span>
          <div className="rating-stats">
            <strong>{reviews.averageRating}</strong> / 5
            <p>({reviews.totalReviews} {reviews.totalReviews === 1 ? 'review' : 'reviews'})</p>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.text && <p className="review-text">{review.text}</p>}
            <p className="review-badge">Anonymous Review • {review.verified}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
