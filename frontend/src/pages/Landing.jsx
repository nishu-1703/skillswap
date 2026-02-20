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
    { icon: ArrowRight, title: 'Skill Exchange', description: 'Exchange your skills with students worldwide' },
    { icon: Zap, title: 'Credit System', description: 'Earn credits by teaching, spend them to learn' },
    { icon: User, title: 'User Profiles', description: 'Build and showcase your unique skill profile' },
    { icon: Shield, title: 'Secure Platform', description: 'Decentralized, secure, and reliable system' },
  ];

  const skillsPreview = [
    { name: 'Web Development', credits: 20, icon: Code },
    { name: 'Python Programming', credits: 15, icon: Code },
    { name: 'UI Design', credits: 10, icon: Award },
  ];

  const dashboardSkills = [
    { name: 'Web Development', type: 'Floating', friends: 20 },
    { name: 'Graphic Design', type: 'Floating', friends: 15 },
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col bg-black overflow-x-hidden relative">
        {/* Background sparkles/particles effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5
              }}
              animate={{
                opacity: [Math.random() * 0.5, Math.random() * 0.8, Math.random() * 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* ========== SECTION 1: HERO WITH VISUAL DASHBOARD ========== */}
        <section
          className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0015 0%, #1a0033 25%, #0f001a 50%, #1a0a33 75%, #0a0015 100%)',
          }}
          role="region"
          aria-label="Hero section"
        >
          {/* Large glowing orbs - much more vibrant */}
          <motion.div
            className="absolute top-10 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0.1) 70%, transparent 100%)',
            }}
            animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(236,72,153,0.1) 70%, transparent 100%)',
            }}
            animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity }}
          />

          {/* Hero Grid: Text Left + Visual Right */}
          <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT: TEXT CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
              >
                Learn & Teach Skills
                <br />
                Without Money
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed"
              >
                Exchange knowledge using credits. Grow your skills together.
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
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-500/50 hover:shadow-red-500/80 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => scrollToSection('product-preview')}
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300"
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
              {/* Glow background - strong neon effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 100%)',
                }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Dashboard card with neon glow border */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-purple-900/40 to-black/60 border-2 p-6 shadow-2xl"
                style={{
                  borderImage: 'linear-gradient(135deg, #0099ff 0%, #a855f7 50%, #ec489b 100%) 1',
                  boxShadow: '0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(236,72,153,0.2), inset 0 0 30px rgba(168,85,247,0.1)',
                }}
              >
                {/* Top header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-400 font-bold">☰</div>
                    <span className="text-white font-bold">SkillSwap</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                  </div>
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="space-y-4"
                >
                  {/* Your Credits */}
                  <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/40 rounded-lg p-4 border border-purple-500/40">
                    <p className="text-xs text-gray-400 mb-1">Credits Balance</p>
                    <p className="text-3xl font-bold text-white">120 <span className="text-lg">Credits</span></p>
                  </div>

                  {/* Skills with request buttons */}
                  <div className="space-y-3">
                    {dashboardSkills.map((skill, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="bg-gradient-to-r from-purple-900/30 to-transparent rounded-lg p-3 border border-purple-500/40 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{skill.name}</p>
                          <p className="text-xs text-gray-400">{skill.type} | Friends: {skill.friends}</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors">
                          Request Skill
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Floating glow elements */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                }}
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 2: PRODUCT PREVIEW ========== */}
        <section
          id="product-preview"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a0015 0%, #1a0a33 50%, #0a0015 100%)',
          }}
        >
          <motion.div
            className="absolute -right-40 top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
            }}
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
            </motion.div>

            {/* Skill cards with neon glow */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              viewport={{ once: true }}
            >
              {skillsPreview.map((skill, idx) => {
                const Icon = skill.icon;
                const colors = [
                  { from: '#0099ff', to: '#ec489b' },
                  { from: '#a855f7', to: '#0099ff' },
                  { from: '#ec489b', to: '#a855f7' },
                ];
                const color = colors[idx];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    {/* Border glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      }}
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Card */}
                    <div className="relative rounded-xl backdrop-blur-xl bg-gradient-to-br from-black/80 to-purple-900/20 border border-white/10 p-6 transition-all duration-300"
                      style={{
                        boxShadow: `0 0 20px ${color.from}60, 0 0 40px ${color.to}40`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/40 to-blue-600/40">
                          <Icon className="text-purple-300" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">Credits: <span className="text-purple-300 font-bold">{skill.credits}</span></span>
                      </div>

                      <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                        Request Skill
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ========== SECTION 3: FEATURES GRID ========== */}
        <section
          id="features"
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a0015 0%, #15003d 50%, #0a0015 100%)',
          }}
        >
          <motion.div
            className="absolute -left-40 -top-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
            }}
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
              How SkillSwap Works
            </motion.h2>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                const colors = [
                  { from: '#0099ff', to: '#a855f7' },
                  { from: '#ec489b', to: '#0099ff' },
                  { from: '#a855f7', to: '#ec489b' },
                  { from: '#0099ff', to: '#ec489b' },
                ];
                const color = colors[idx];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    {/* Border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      }}
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Card */}
                    <div className="relative rounded-xl backdrop-blur-xl bg-gradient-to-br from-black/80 to-purple-900/20 border border-white/10 p-8 transition-all duration-300"
                      style={{
                        boxShadow: `0 0 20px ${color.from}50, 0 0 40px ${color.to}30`,
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600/40 to-blue-600/40">
                          <Icon className="text-purple-300" size={28} />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
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
          className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a0015 0%, #1a0a33 100%)',
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(236,72,153,0.1) 0%, transparent 50%)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 12, repeat: Infinity }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Dashboard Mock */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative h-96 hidden lg:flex items-center"
              >
                <div className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)',
                  }}
                />
                <div className="relative w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-purple-900/40 to-black/60 border-2 p-6"
                  style={{
                    borderImage: 'linear-gradient(135deg, #0099ff 0%, #a855f7 100%) 1',
                    boxShadow: '0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(236,72,153,0.15)',
                  }}
                >
                  <div className="text-center flex-1 flex flex-col items-center justify-center">
                    <div className="space-y-4 w-full px-4">
                      <div className="text-xs text-gray-400 flex justify-between mb-3">
                        <span>☰</span>
                        <span>SkillSwap</span>
                        <span>⋯</span>
                      </div>

                      <div className="bg-purple-900/40 rounded-lg p-3 border border-purple-500/30">
                        <p className="text-xs text-gray-400">Credits Balance</p>
                        <p className="text-2xl font-bold text-white">120 Credits</p>
                      </div>

                      <div className="space-y-2">
                        <div className="bg-gradient-to-r from-purple-900/20 to-transparent rounded p-2 border border-purple-500/20 text-left">
                          <p className="text-xs font-semibold text-white">Web Development</p>
                          <p className="text-xs text-gray-400">Floating | Friends: 20</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-900/20 to-transparent rounded p-2 border border-purple-500/20 text-left">
                          <p className="text-xs font-semibold text-white">Graphic Design</p>
                          <p className="text-xs text-gray-400">Floating | Friends: 15</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Manage your skills
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  <span className="text-purple-300">effortlessly</span>
                </p>
                <p className="text-gray-400 mb-8">
                  Join the future of Skill exchange
                </p>

                <div className="space-y-4">
                  {[
                    'Track credits',
                    'Browse skills',
                    'Exchange knowledge easily',
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <Check className="text-green-400 flex-shrink-0" size={20} />
                      <span className="text-white font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 5: FOOTER ========== */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/80 border-t border-white/5 backdrop-blur-xl relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">SkillSwap</h3>
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
