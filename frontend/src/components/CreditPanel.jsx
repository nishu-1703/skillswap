import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config'

export default function CreditPanel() {
  const { user } = useAuth()
  const [creditData, setcreditData] = useState({
    currentBalance: 0,
    transactions: [],
    expiringCredits: []
  })
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchCreditData()
  }, [user])

  const fetchCreditData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch credit balance
      const balanceRes = await fetch(`${API_BASE_URL}/api/credits/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      let balance = 0
      let transactions = []
      let expiringCredits = 0

      if (balanceRes.ok) {
        const data = await balanceRes.json()
        balance = data.currentBalance || 0
        transactions = data.transactions || []
        expiringCredits = data.expiringCredits?.length || 0
      }

      setcreditData({
        currentBalance: balance,
        transactions: transactions.slice(0, 5), // Last 5 transactions
        expiringCredits: expiringCredits
      })
    } catch (error) {
      console.error('Error fetching credit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getTransactionIcon = (type) => {
    return type === 'earn' ? '⬆️' : '⬇️'
  }

  const getTransactionColor = (type) => {
    return type === 'earn' ? '#22c55e' : '#ef4444'
  }

  return (
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ margin: 0, color: 'white', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
          💳 Credit Balance
        </h3>
        <button
          onClick={fetchCreditData}
          style={{
            background: 'transparent',
            color: '#a5b4fc',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)')}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#a5b4fc', textAlign: 'center' }}>Loading credit data...</p>
      ) : (
        <>
          {/* Main Balance Display */}
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: 'var(--spacing-lg)', borderRadius: '8px', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: 'var(--spacing-lg)' }}>
            <p style={{ margin: '0 0 var(--spacing-xs)', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 'bold' }}>Current Balance</p>
            <p style={{ margin: 0, color: '#a78bfa', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {creditData.currentBalance}
            </p>
            <p style={{ margin: 'var(--spacing-xs) 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>
              Credits available for learning
            </p>
          </div>

          {/* Expiring Credits Warning */}
          {creditData.expiringCredits > 0 && (
            <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: 'var(--spacing-md)', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.3)', marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span>
              <div>
                <p style={{ margin: '0 0 4px 0', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {creditData.expiringCredits} Credits Expiring
                </p>
                <p style={{ margin: 0, color: '#fed7aa', fontSize: '0.75rem' }}>
                  Within 30 days - Use them soon!
                </p>
              </div>
            </div>
          )}

          {/* Transaction History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: '100%',
              background: showHistory ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
              color: '#a5b4fc',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              borderRadius: '8px',
              padding: 'var(--spacing-md)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              marginBottom: showHistory ? 'var(--spacing-lg)' : 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = showHistory ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)'
            }}
          >
            {showHistory ? '▼ Recent Transactions' : '▶ Recent Transactions'}
          </button>

          {/* Transaction History */}
          {showHistory && (
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              {creditData.transactions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {creditData.transactions.map((tx, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '6px',
                        border: '1px solid rgba(79, 70, 229, 0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>{getTransactionIcon(tx.type)}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 4px 0', color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {tx.reason || (tx.type === 'earn' ? 'Teaching Credit' : 'Learning')}
                          </p>
                          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>
                            {formatDate(tx.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          margin: '0 0 4px 0',
                          color: getTransactionColor(tx.type),
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}>
                          {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                        </p>
                        {tx.expiresAt && (
                          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem' }}>
                            Expires: {formatDate(tx.expiresAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center', margin: 'var(--spacing-lg) 0 0 0' }}>
                  No transactions yet
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
