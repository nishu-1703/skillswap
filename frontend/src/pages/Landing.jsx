import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  GraduationCap, 
  TrendingUp, 
  Rocket, 
  Check,
  Users,
  ArrowRight,
  ChevronDown
} from 'lucide-react'

// Animated SVG Component for Credit Flow Visualization
function CreditFlowVisualization() {
  return (
    <svg viewBox="0 0 400 500" style={{ width: '100%', height: 'auto', maxWidth: '500px' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientFlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="1" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
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
      <circle cx="60" cy="150" r="30" fill="#6366F1" opacity="0.1" stroke="#6366F1" strokeWidth="2" />
      <circle cx="60" cy="150" r="20" fill="#6366F1" />
      <text x="60" y="160" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">👨‍🏫</text>
      
      {/* Right User - Learner */}
      <circle cx="340" cy="350" r="30" fill="#14B8A6" opacity="0.1" stroke="#14B8A6" strokeWidth="2" />
      <circle cx="340" cy="350" r="20" fill="#14B8A6" />
      <text x="340" y="360" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">🎓</text>
      
      {/* Credit Flow - Animated particles */}
      <circle cx="100" cy="240" r="8" className="credit-particle pulse-circle" />
      <circle cx="150" cy="280" r="8" className="credit-particle pulse-circle" />
      <circle cx="200" cy="300" r="8" className="credit-particle pulse-circle" />
      <circle cx="250" cy="320" r="8" className="credit-particle pulse-circle" />
      <circle cx="300" cy="335" r="8" className="credit-particle pulse-circle" />
      
      {/* Path showing flow direction */}
      <path d="M 80 170 Q 200 240 320 330" stroke="url(#gradientFlow)" strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="5,5" />
      
      {/* Connection nodes */}
      <circle cx="80" cy="170" r="6" fill="#6366F1" opacity="0.5" />
      <circle cx="320" cy="330" r="6" fill="#14B8A6" opacity="0.5" />
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
    <main className="min-h-screen flex flex-col bg-dark-900 dark:bg-dark-900">
      {/* Hero Section - Premium Redesign */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 25%, #1a2a52 50%, #0a2a4a 75%, #062d3d 100%)'
        }}
        role="region"
        aria-label="Hero section"
      >
        {/* Animated background gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl opacity-50 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl w-full relative z-10">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Master New Skills by Sharing What You Already Know
            </h1>
            
            <p className="text-xl sm:text-2xl mb-8 text-dark-200 leading-relaxed font-light">
              No money. Just credits. Real people helping each other grow.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {user ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Go to your dashboard"
                >
                  Go to Dashboard <ArrowRight size={20} />
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-primary rounded-xl shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Create a new SkillSwap account"
                  >
                    Join Free <ArrowRight size={20} />
                  </button>
                  
                  <button 
                    onClick={scrollToSection}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white border-2 border-white rounded-xl bg-transparent hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label="Scroll down to see how it works"
                  >
                    See How It Works <ChevronDown size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Trust Bar - Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-lg font-semibold"
                    style={{
                      backgroundColor: ['#6366F1', '#14B8A6', '#06b6d4', '#f59e0b', '#ef4444'][i]
                    }}
                  >
                    {['👨', '👩', '🧑', '👨', '👩'][i]}
                  </div>
                ))}
              </div>
              <p className="text-dark-200 text-sm font-medium">
                Join <span className="text-lg font-bold text-white">8,400+</span> learners & teachers
              </p>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <CreditFlowVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="how-it-works"
        className="bg-dark-800 dark:bg-dark-800 py-20 px-4 sm:px-6 lg:px-8"
        role="region"
        aria-label="How SkillSwap works"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            How SkillSwap Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Rounded-xl Cards with Icons */}
            <div className="bg-dark-700 border border-dark-600 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Teach Your Skills
              </h3>
              <p className="text-dark-300 leading-relaxed">
                Share your expertise with others. You set your own schedule and pick what to teach.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-dark-700 border border-dark-600 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/50 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Earn Credits
              </h3>
              <p className="text-dark-300 leading-relaxed">
                Get rewarded for sharing knowledge. Every completed session earns you credits to spend on learning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-dark-700 border border-dark-600 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Rocket size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Learn New Skills
              </h3>
              <p className="text-dark-300 leading-relaxed">
                Access a diverse community of experts ready to teach. Browse hundreds of skills and start learning today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SkillSwap Section */}
      <section 
        className="bg-dark-900 py-20 px-4 sm:px-6 lg:px-8"
        role="region"
        aria-label="Why join SkillSwap"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Join SkillSwap?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'No Payment Required', desc: 'Exchange skills using credits instead of money. Fair for everyone.' },
              { title: 'Flexible Scheduling', desc: 'Teach and learn on your own time. No rigid classes or commitments.' },
              { title: 'Community Driven', desc: 'Join thousands of learners and teachers building together.' },
              { title: 'Verified Teachers', desc: 'Learn from trusted members with proven teaching experience.' },
              { title: 'Wide Range of Skills', desc: 'From coding to cooking, music to marketing — find it all here.' },
              { title: 'Safe & Secure', desc: 'Ratings, reviews, and verified accounts keep everyone accountable.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <Check size={24} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-dark-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section 
          className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #14B8A6 100%)',
          }}
          role="region"
          aria-label="Call to action"
        >
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join SkillSwap today and start exchanging knowledge with our community. No credit card required.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-primary bg-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              aria-label="Create your account now"
            >
              Create Account Free <ArrowRight size={20} />
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
