import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, User, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Features data
  const features = [
    {
      icon: Code,
      title: 'Skill Exchange',
      description: 'Exchange skills directly',
    },
    {
      icon: Zap,
      title: 'Credit System',
      description: 'Earn and spend credits',
    },
    {
      icon: User,
      title: 'User Profiles',
      description: 'Show your expertise',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Safe and reliable system',
    },
  ];

  const skills = [
    'Web Development',
    'Graphic Design',
    'Python Programming',
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col bg-black overflow-x-hidden">
        {/* ========== SECTION 1: HERO ========== */}
        <section
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-black"
          role="region"
          aria-label="Hero section"
        >
          {/* Gradient background orbs */}
          <motion.div
            className="absolute -right-40 -top-40 w-96 h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute -left-40 bottom-0 w-96 h-96 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 18, repeat: Infinity }}
          />

          {/* Hero content */}
          <motion.div
            className="relative z-10 text-center max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo/Brand */}
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6">
              SkillSwap
            </h1>

            {/* Tagline */}
            <h2 className="text-2xl sm:text-4xl font-semibold text-white mb-6">
              Learn & Teach Skills Without Money
            </h2>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Exchange knowledge. Earn credits. Grow together.
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => scrollToSection('skills-preview')}
                className="px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
              >
                Browse Skills
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ========== SECTION 2: PROBLEM → SOLUTION ========== */}
        <section
          id="problem-solution"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-slate-900 relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
              Why SkillSwap?
            </h2>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-xl text-gray-300">
                  <span className="font-semibold text-white">Learning shouldn't be limited by money.</span>
                </p>
                <p className="text-lg text-gray-400 mt-2">
                  SkillSwap lets students exchange skills freely using a credit system.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-xl text-gray-300">
                  <span className="font-semibold text-white">Teach what you know.</span>
                </p>
                <p className="text-lg text-gray-400 mt-2">
                  Learn what you need.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 3: FEATURES ========== */}
        <section
          id="features"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black relative"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-white text-center mb-16">
              Our Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <Icon size={40} className="text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== SECTION 4: SKILLS PREVIEW ========== */}
        <section
          id="skills-preview"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-purple-900/40 to-black"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
              Available Skills
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  <p className="text-xl font-semibold text-white">{skill}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              onClick={() => navigate('/browse')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Browse All Skills
            </motion.button>
          </div>
        </section>

        {/* ========== SECTION 5: FINAL CTA ========== */}
        <section
          id="final-cta"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-black relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-6xl font-bold text-white mb-12"
            >
              Start Your SkillSwap <br /> Journey Today
            </motion.h2>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110"
            >
              Create Free Account <ArrowRight size={20} />
            </motion.button>
          </div>
        </section>

        {/* ========== SECTION 6: FOOTER ========== */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">SkillSwap</h3>
                <p className="text-gray-400 text-sm">
                  Learn & Teach Skills Without Money
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 sm:justify-end">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Signup
                </button>
                <a
                  href="mailto:contact@skillswap.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8">
              <p className="text-center text-gray-500 text-sm">
                © 2026 SkillSwap. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
