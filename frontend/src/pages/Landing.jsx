import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Import all new components
import Navbar from '../components/Navbar';
import StatsBar from '../components/StatsBar';
import HowItWorks from '../components/HowItWorks';
import WhyJoin from '../components/WhyJoin';
import BrowseSkills from '../components/BrowseSkills';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToSection = () => {
    const featuresSection = document.getElementById('how-it-works');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky Navbar */}
      <Navbar />

      <main className="min-h-screen flex flex-col bg-white">
        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"
          role="region"
          aria-label="Hero section"
        >
          {/* Animated background gradient orbs */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl w-full relative z-10">
            {/* Left Content */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl sm:text-6xl font-bold mb-6 text-white leading-tight"
                style={{ letterSpacing: '-0.02em' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Master New Skills by Sharing What You Already Know
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl mb-8 text-dark-200 leading-relaxed font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                No money. Just credits. Real people helping each other grow.
              </motion.p>

              {/* Call-to-Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {user ? (
                  <motion.button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Dashboard <ArrowRight size={20} />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={() => navigate('/signup')}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-600/50 hover:shadow-xl hover:shadow-blue-600/60 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Join Free <ArrowRight size={20} />
                    </motion.button>

                    <motion.button
                      onClick={scrollToSection}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white border-2 border-white rounded-xl bg-transparent hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      See How It Works <ChevronDown size={20} />
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* Trust Bar - Social Proof */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-lg font-semibold"
                      style={{
                        backgroundColor: ['#6366F1', '#14B8A6', '#06b6d4', '#f59e0b', '#ef4444'][i],
                      }}
                    >
                      {['👨', '👩', '🧑', '👨', '👩'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-dark-200 text-sm font-medium">
                  Join <span className="text-lg font-bold text-white">12,400+</span> learners & teachers
                </p>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <CreditFlowVisualization />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <StatsBar />

        {/* How It Works */}
        <HowItWorks />

        {/* Why Join */}
        <WhyJoin />

        {/* Browse Skills */}
        <BrowseSkills />

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <FinalCTA />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

