import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

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

      <main className="min-h-screen flex flex-col bg-black overflow-x-hidden">
        {/* Hero Section - Premium Dark Theme */}
        <section
          className="premium-hero relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden bg-black"
          role="region"
          aria-label="Hero section"
        >
          {/* Background orbs for depth (subtle) */}
          <motion.div
            className="absolute -right-20 top-32 w-80 h-80 bg-gradient-to-br from-purple-700 to-indigo-600 rounded-full blur-3xl opacity-30 pointer-events-none"
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-40 bottom-40 w-96 h-96 bg-gradient-to-br from-pink-600 to-orange-500 rounded-full blur-3xl opacity-20 pointer-events-none"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          {/* Cleaner layout: two-column hero */}
          <div className="hero-grid max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left visual card */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full max-w-md rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black shadow-2xl p-10">
                <div className="h-60 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-black/30 shadow-inner flex items-center justify-center">
                  <div className="text-left px-6">
                    <h3 className="text-3xl font-extrabold text-white leading-tight">Your Keys.<br/>Your Chats.<br/>Your Security.</h3>
                    <p className="mt-4 text-sm text-gray-300 max-w-xs">Premium privacy-focused interactions designed with beautiful, secure UX.</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white font-medium hover:bg-white/5">Learn More</button>
                  <button onClick={() => navigate('/signup')} className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-semibold">Get Started</button>
                </div>
              </div>
            </motion.div>

            {/* Right content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/10 backdrop-blur-sm mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Sparkles size={16} className="text-pink-400" />
                <span className="text-sm font-medium text-pink-200">Welcome to the skill revolution</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white leading-tight"
                style={{ letterSpacing: '-0.02em' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 }}
              >
                Learn <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">anything</span> from <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">anyone</span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                Exchange skills without friction — connect with real people and grow together. Built with a premium, privacy-first design.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
              >
                {user ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl shadow-2xl"
                  >
                    Go to Dashboard <ArrowRight size={18} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/signup')}
                      className="inline-flex items-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-2xl"
                    >
                      Get Started Free <ArrowRight size={18} />
                    </button>

                    <button
                      onClick={scrollToSection}
                      className="inline-flex items-center gap-2 px-6 py-4 text-lg font-semibold text-white border-2 border-white/20 rounded-xl bg-white/3 hover:bg-white/6"
                    >
                      See How It Works <ChevronDown size={18} />
                    </button>
                  </>
                )}
              </motion.div>
            </div>
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

