import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section 
        style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 'var(--spacing-5xl) var(--spacing-lg)', 
          textAlign: 'center', 
          color: 'white',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
        }}
        role="region"
        aria-label="Hero section"
      >
        <div style={{ maxWidth: '700px' }}>
          <h1 style={{ 
            fontSize: 'var(--font-size-7xl)', 
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--spacing-lg)', 
            lineHeight: 'var(--line-height-tight)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Teach → Earn → Learn
          </h1>
          
          <p style={{ 
            fontSize: 'var(--font-size-xl)', 
            marginBottom: 'var(--spacing-2xl)',
            opacity: '0.98',
            lineHeight: 'var(--line-height-relaxed)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            Exchange skills instead of money. Teach what you know, earn credits, and learn from others in our peer-to-peer community.
          </p>

          {/* Call-to-Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-lg)', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary btn-lg"
                aria-label="Go to your dashboard"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signup')}
                  className="btn btn-primary btn-lg"
                  aria-label="Create a new SkillSwap account"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-secondary btn-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    borderColor: 'white'
                  }}
                  aria-label="Sign in to your existing account"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        style={{ 
          background: 'white', 
          padding: 'var(--spacing-5xl) var(--spacing-lg)'
        }}
        role="region"
        aria-label="How SkillSwap works"
      >
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--spacing-5xl)',
            color: 'var(--color-text)'
          }}>How SkillSwap Works</h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'var(--spacing-2xl)'
          }}>
            <>
              {/* Feature 1: Teaching */}
              <article className="card">
                <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }} aria-hidden="true">
                  🎓
                </div>
                <h3 style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: 'var(--spacing-md)' }}>
                  Teach Your Skills
                </h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  Share your expertise with others. You set your own schedule and pick what to teach.
                </p>
              </article>

              {/* Feature 2: Earning */}
              <article className="card">
                <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }} aria-hidden="true">
                  💰
                </div>
                <h3 style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: 'var(--spacing-md)' }}>
                  Earn Credits
                </h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  Get rewarded for sharing knowledge. Every completed session earns you credits to spend on learning.
                </p>
              </article>

              {/* Feature 3: Learning */}
              <article className="card">
                <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)', textAlign: 'center' }} aria-hidden="true">
                  🚀
                </div>
                <h3 style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: 'var(--spacing-md)' }}>
                  Learn New Skills
                </h3>
                <p style={{ color: 'var(--color-text-light)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  Access a diverse community of experts ready to teach. Browse hundreds of skills and start learning today.
                </p>
              </article>
            </>
          </div>
        </div>
      </section>

      {/* Why SkillSwap Section */}
      <section 
        style={{ 
          background: 'var(--color-bg)', 
          padding: 'var(--spacing-5xl) var(--spacing-lg)'
        }}
        role="region"
        aria-label="Why join SkillSwap"
      >
        <div className="container">
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: 'var(--spacing-5xl)',
            color: 'var(--color-text)'
          }}>Why Join SkillSwap?</h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 'var(--spacing-2xl)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }} aria-hidden="true">
                ✓
              </div>
              <h3 style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                No Payment Required
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Exchange skills using credits instead of money. Fair for everyone.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }} aria-hidden="true">
                ✓
              </div>
              <h3 style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                Flexible Scheduling
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Teach and learn on your own time. No rigid classes or commitments.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-md)' }} aria-hidden="true">
                ✓
              </div>
              <h3 style={{ color: 'var(--color-text)', marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                Community Driven
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>
                Join thousands of learners and teachers building together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section 
          style={{ 
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            padding: 'var(--spacing-5xl) var(--spacing-lg)',
            color: 'white',
            textAlign: 'center'
          }}
          role="region"
          aria-label="Call to action"
        >
          <div className="container">
            <h2 style={{ color: 'white', marginBottom: 'var(--spacing-xl)' }}>
              Ready to Start Learning?
            </h2>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-2xl)', maxWidth: '500px', margin: '0 auto var(--spacing-2xl)' }}>
              Join SkillSwap today and start exchanging knowledge with our community.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="btn"
              style={{ 
                background: 'white',
                color: '#4f46e5',
                fontWeight: 'var(--font-weight-bold)'
              }}
              aria-label="Create your account now"
            >
              Create Account Free
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
