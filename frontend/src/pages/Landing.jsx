import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Animated SVG Component for Credit Flow Visualization
function CreditFlowVisualization() {
  return (
    <svg viewBox="0 0 400 500" style={{ width: '100%', height: 'auto', maxWidth: '500px' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </linearGradient>
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-300px); opacity: 0; }
          }
          @keyframes pulse {
            0%, 100% { r: 8; opacity: 0.8; }
            50% { r: 12; opacity: 1; }
          }
          .credit-particle {
            animation: floatUp 3s ease-in infinite;
            fill: url(#gradientFlow);
          }
          .credit-particle:nth-child(2) { animation-delay: 0.3s; }
          .credit-particle:nth-child(3) { animation-delay: 0.6s; }
          .credit-particle:nth-child(4) { animation-delay: 0.9s; }
          .credit-particle:nth-child(5) { animation-delay: 1.2s; }
          .pulse-circle {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}</style>
      </defs>
      
      {/* Left User - Teacher */}
      <circle cx="60" cy="150" r="30" fill="#4f46e5" opacity="0.1" stroke="#4f46e5" strokeWidth="2" />
      <circle cx="60" cy="150" r="20" fill="#4f46e5" />
      <text x="60" y="155" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">👨‍🏫</text>
      
      {/* Right User - Learner */}
      <circle cx="340" cy="350" r="30" fill="#06b6d4" opacity="0.1" stroke="#06b6d4" strokeWidth="2" />
      <circle cx="340" cy="350" r="20" fill="#06b6d4" />
      <text x="340" y="355" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">🎓</text>
      
      {/* Credit Flow - Animated particles */}
      <circle cx="100" cy="240" r="8" className="credit-particle pulse-circle" />
      <circle cx="150" cy="280" r="8" className="credit-particle pulse-circle" />
      <circle cx="200" cy="300" r="8" className="credit-particle pulse-circle" />
      <circle cx="250" cy="320" r="8" className="credit-particle pulse-circle" />
      <circle cx="300" cy="335" r="8" className="credit-particle pulse-circle" />
      
      {/* Path showing flow direction */}
      <path d="M 80 170 Q 200 240 320 330" stroke="url(#gradientFlow)" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="5,5" />
      
      {/* Credit symbols */}
      <text x="200" y="80" textAnchor="middle" fontSize="48" opacity="0.15">💎</text>
      <text x="200" y="450" textAnchor="middle" fontSize="48" opacity="0.15">✨</text>
      
      {/* Connection nodes */}
      <circle cx="80" cy="170" r="6" fill="#4f46e5" opacity="0.5" />
      <circle cx="320" cy="330" r="6" fill="#06b6d4" opacity="0.5" />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [hoveredButton, setHoveredButton] = useState(null)

  const scrollToSection = () => {
    const featuresSection = document.getElementById('how-it-works')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section - Premium Redesign */}
      <section 
        style={{ 
          minHeight: '100vh',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #0c4a6e 75%, #164e63 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
        role="region"
        aria-label="Hero section"
      >
        {/* Animated background gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite 1s'
        }} />
        
        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-5xl)',
          maxWidth: '1400px',
          width: '100%',
          zIndex: 1,
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div>
            <h1 style={{ 
              fontSize: 'clamp(32px, 6vw, 56px)',
              fontWeight: '800',
              marginBottom: 'var(--spacing-lg)', 
              lineHeight: '1.1',
              color: 'white',
              letterSpacing: '-0.02em'
            }}>
              Master New Skills by Sharing What You Already Know
            </h1>
            
            <p style={{ 
              fontSize: 'clamp(16px, 2vw, 20px)',
              marginBottom: 'var(--spacing-2xl)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              No money. Just credits. Real people helping each other grow.
            </p>

            {/* Call-to-Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-lg)', 
              flexWrap: 'wrap',
              marginBottom: 'var(--spacing-3xl)'
            }}>
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  style={{
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: hoveredButton === 'dashboard' 
                      ? '0 20px 40px rgba(16, 185, 129, 0.4)' 
                      : '0 10px 20px rgba(16, 185, 129, 0.2)',
                    transform: hoveredButton === 'dashboard' ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                  onMouseEnter={() => setHoveredButton('dashboard')}
                  onMouseLeave={() => setHoveredButton(null)}
                  aria-label="Go to your dashboard"
                >
                  Go to Dashboard →
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/signup')}
                    style={{
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredButton === 'join' 
                        ? '0 20px 50px rgba(79, 70, 229, 0.5)' 
                        : '0 10px 25px rgba(79, 70, 229, 0.3)',
                      transform: hoveredButton === 'join' ? 'translateY(-2px) scale(1.05)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredButton('join')}
                    onMouseLeave={() => setHoveredButton(null)}
                    aria-label="Create a new SkillSwap account"
                  >
                    Join Free →
                  </button>
                  
                  <button 
                    onClick={scrollToSection}
                    style={{
                      padding: '14px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      border: '2px solid white',
                      background: 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredButton === 'learn' 
                        ? '0 10px 30px rgba(255, 255, 255, 0.2)' 
                        : 'none',
                      transform: hoveredButton === 'learn' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                    onMouseEnter={() => setHoveredButton('learn')}
                    onMouseLeave={() => setHoveredButton(null)}
                    aria-label="Scroll down to see how it works"
                  >
                    See How It Works ↓
                  </button>
                </>
              )}
            </div>

            {/* Trust Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              opacity: 0.85
            }}>
              <div style={{
                display: 'flex',
                marginRight: 'var(--spacing-md)'
              }}>
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i],
                      marginLeft: i > 0 ? '-8px' : '0',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {['👨', '👩', '🧑', '👨', '👩'][i]}
                  </div>
                ))}
              </div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500',
                margin: 0
              }}>
                Join <strong style={{ fontSize: '16px' }}>8,400+</strong> learners & teachers
              </p>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div style={{
            display: 'none',
            '@media (min-width: 1024px)': {
              display: 'block'
            },
            animation: 'float 4s ease-in-out infinite'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: 'var(--spacing-2xl)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <CreditFlowVisualization />
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section 
        id="how-it-works"
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
