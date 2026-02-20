import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, User, Shield, TrendingUp, Award, Check } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Code, title: 'Skill Exchange', description: 'Exchange skills directly' },
    { icon: Zap, title: 'Credit System', description: 'Earn and spend credits' },
    { icon: User, title: 'User Profiles', description: 'Show your expertise' },
    { icon: Shield, title: 'Secure Auth', description: 'Safe and reliable system' },
  ];

  const exampleSkills = [
    { name: 'Web Development', credits: 20, learners: 234 },
    { name: 'Graphic Design', credits: 15, learners: 189 },
    { name: 'Python Programming', credits: 18, learners: 412 },
  ];

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <main className="min-h-screen flex flex-col bg-black overflow-x-hidden">
        {/* ========== SECTION 1: HERO WITH VISUAL CENTERPIECE ========== */}
        <section
          className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-black"
          role="region"
          aria-label="Hero section"
        >
          {/* Background orbs - large, subtle */}
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 to-blue-600/20 rounded-full blur-3xl pointer-events-none"
            animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/30 rounded-full blur-3xl pointer-events-none"
            animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity }}
          />

          {/* Hero Grid: Text Left + Visual Right */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Subtitle badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-purple-200">The future of learning</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
              >
                Exchange Skills.
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Build Your Future.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed"
              >
                A decentralized platform where students teach, learn, and earn credits. No money needed — just knowledge and passion.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => scrollToSection('product-preview')}
                  className="px-8 py-4 bg-white/10 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                >
                  Explore Skills
                </button>
              </motion.div>
            </motion.div>

            {/* RIGHT: VISUAL DASHBOARD PREVIEW */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="relative h-96 hidden lg:flex items-center justify-center"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-2xl" />

              {/* Dashboard card with glass effect */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl p-6">
                {/* Top bar */}
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="space-y-4"
                >
                  {/* Your Credits */}
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-1">Your Credits</p>
                    <p className="text-3xl font-bold text-white">120</p>
                  </div>

                  {/* Skills Preview */}
                  <div className="space-y-3">
                    {exampleSkills.map((skill, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">{skill.name}</p>
                            <p className="text-xs text-gray-400">{skill.learners} learners</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-purple-300">{skill.credits} credits</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Floating accent spheres */}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 2: PRODUCT PREVIEW ========== */}
        <section
          id="product-preview"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-slate-950 relative overflow-hidden"
        >
          <motion.div
            className="absolute -right-40 top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                See SkillSwap in Action
              </h2>
              <p className="text-lg text-gray-400">
                Real students, real skills, real growth
              </p>
            </motion.div>

            {/* Live Skills Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {exampleSkills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card */}
                  <div className="relative rounded-xl backdrop-blur-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 group-hover:border-purple-500/60 p-6 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{skill.learners} active learners</p>
                      </div>
                      <Award className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                    </div>

                    {/* Credit badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-600/40 border border-purple-500/50 mb-4">
                      <p className="text-sm font-bold text-purple-200">{skill.credits} credits</p>
                    </div>

                    {/* Growth indicator */}
                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                      <TrendingUp size={16} />
                      <span>Growing 12% weekly</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 3: FEATURE CARDS WITH DEPTH ========== */}
        <section
          id="features"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden"
        >
          <motion.div
            className="absolute -left-40 -top-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-white text-center mb-16"
            >
              Powerful Features
            </motion.h2>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Glass card with border glow */}
                    <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border border-purple-500/30 group-hover:border-purple-500/60 p-8 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-3 group-hover:shadow-2xl shadow-lg shadow-purple-900/20">
                      {/* Icon container */}
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/40 to-blue-600/40 border border-purple-500/50 mb-6 group-hover:scale-125 transition-transform">
                        <Icon className="text-purple-300" size={24} />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Hover accent */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========== SECTION 4: PLATFORM PREVIEW ========== */}
        <section
          id="platform"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-purple-950/30 to-black relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-purple-600/5 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Visual */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-96 hidden lg:flex items-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/20 rounded-2xl blur-2xl" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-2xl flex flex-col p-6">
                  <div className="text-center flex-1 flex items-center justify-center">
                    <div className="space-y-4">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mx-auto shadow-lg shadow-purple-500/50"
                      />
                      <p className="text-white font-semibold">Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Text Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
                  Manage Your Skills Effortlessly
                </h2>

                <div className="space-y-6">
                  {[
                    { title: 'Track Credits', desc: 'Monitor earnings and spending in real-time' },
                    { title: 'Browse Skills', desc: 'Discover thousands of learners and experts' },
                    { title: 'Exchange Knowledge', desc: 'Seamless peer-to-peer skill sharing' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 mt-1">
                        <Check className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 5: STRONG CTA ========== */}
        <section
          id="cta"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-purple-900/40 to-black relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-radial-gradient from-purple-600/20 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-5xl sm:text-6xl font-extrabold text-white mb-6"
            >
              Join the Future of Learning
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-8"
            >
              Start exchanging skills today. No payment required.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-110"
            >
              Create Free Account <ArrowRight size={22} />
            </motion.button>
          </div>
        </section>

        {/* ========== SECTION 6: PREMIUM FOOTER ========== */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/80 border-t border-white/5 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">SkillSwap</h3>
                <p className="text-gray-500 text-sm">© 2026 SkillSwap. All rights reserved.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 sm:justify-end">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Signup
                </button>
                <a
                  href="mailto:contact@skillswap.com"
                  className="text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
