import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <div>
          <div style={{ fontSize: '56px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
            Teach → Earn → Learn
          </div>
          <p style={{ fontSize: '20px', marginBottom: '30px', opacity: '0.95', maxWidth: '600px', margin: '0 auto 30px' }}>
            Exchange skills instead of money. Teach what you know, earn credits, and learn from others in our peer-to-peer community.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                style={{ 
                  padding: '14px 40px', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  background: 'white', 
                  color: '#667eea', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signup')}
                  style={{ 
                    padding: '14px 40px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    background: 'white', 
                    color: '#667eea', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  style={{ 
                    padding: '14px 40px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white', 
                    border: '2px solid white', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'white', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '60px', color: '#111' }}>How SkillSwap Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {/* Feature 1 */}
            <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea15, #764ba215)', borderRadius: '12px', border: '1px solid #667eea30', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>Teach Your Skills</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Share your expertise with others. You set your own schedule and pick what to teach.</p>
            </div>
            {/* Feature 2 */}
            <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea15, #764ba215)', borderRadius: '12px', border: '1px solid #667eea30', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>Earn Credits</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Every completed teaching session earns you credits you can use to learn new skills.</p>
            </div>
            {/* Feature 3 */}
            <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea15, #764ba215)', borderRadius: '12px', border: '1px solid #667eea30', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#111' }}>Learn Anything</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>Spend your credits to book sessions and learn from talented instructors in your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>Ready to Start Learning?</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: '0.95', maxWidth: '500px', margin: '0 auto 30px' }}>
          Join thousands of learners exchanging skills and growing together, credit by credit.
        </p>
        {!user && <button 
          onClick={() => navigate('/signup')}
          style={{ 
            padding: '14px 40px', 
            fontSize: '16px', 
            fontWeight: '600',
            background: 'white', 
            color: '#667eea', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Create Free Account
        </button>}
      </section>
    </div>
  )
}
