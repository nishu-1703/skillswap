import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, User, Shield, Check } from 'lucide-react';

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
    { name: 'Web Development', credits: 20, gradient: 'from-blue-500 to-pink-500' },
    { name: 'Python Programming', credits: 15, gradient: 'from-purple-500 to-blue-500' },
    { name: 'UI Design', credits: 10, gradient: 'from-pink-500 to-purple-500' },
  ];

  const dashboardSkills = [
    { name: 'Web Development', type: 'Floating', friends: 20 },
    { name: 'Graphic Design', type: 'Floating', friends: 15 },
  ];

  return (
    <>
      <main className="min-h-screen flex flex-col bg-black overflow-x-hidden relative">
        {/* ===== BACKGROUND DESIGN: 3 LAYERS ===== */}
        
        {/* Layer 1: Base color with slight gradient */}
        <div className="fixed inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, #0B0F1A 0%, #0a0015 50%, #0B0F1A 100%)',
            zIndex: 0,
          }}
        />

        {/* Layer 2: Radial gradient glow spots */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {/* Top right - purple glow */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0.1) 50%, transparent 100%)',
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          {/* Center - blue glow */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 60%, transparent 100%)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          
          {/* Bottom left - pink glow */}
          <motion.div
            className="absolute bottom-0 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(236,72,153,0.05) 60%, transparent 100%)',
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Layer 3: Subtle noise texture overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" /%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
            backgroundSize: '400px 400px',
            zIndex: 2,
          }}
        />

        {/* ===== CONTENT CONTAINER ===== */}
        <div className="relative z-10">
          {/* ========== SECTION 1: HERO WITH VISUAL DASHBOARD ========== */}
          <section
            className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8 py-32"
            role="region"
            aria-label="Hero section"
          >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                  className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
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
                  className="text-lg text-gray-300 mb-12 max-w-2xl leading-relaxed"
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
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      boxShadow: '0 0 20px rgba(220,38,38,0.6), 0 0 40px rgba(220,38,38,0.3)',
                    }}
                  >
                    Get Started <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => scrollToSection('product-preview')}
                    className="px-8 py-4 border border-white/15 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 backdrop-blur-md"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    Explore Skills
                  </button>
                </motion.div>
              </motion.div>

              {/* RIGHT: VISUAL DASHBOARD PREVIEW - FLOATING EFFECT */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9 }}
                className="relative h-96 hidden lg:flex items-center justify-center"
              >
                {/* Background glow behind card */}
                <div className="absolute inset-0 rounded-2xl blur-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.15) 60%, transparent 100%)',
                  }}
                />

                {/* Floating dashboard card - GLASSMORPHISM */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative w-full h-full"
                >
                  <div
                    className="w-full h-full rounded-2xl overflow-hidden border p-6 backdrop-blur-2xl"
                    style={{
                      background: 'rgba(20, 10, 40, 0.7)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      boxShadow: '0 8px 32px rgba(168,85,247,0.3), 0 0 60px rgba(236,72,153,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 text-lg">☰</span>
                        <span className="text-white font-bold text-sm">SkillSwap</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50" />
                      </div>
                    </div>

                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="space-y-4"
                    >
                      {/* Credits Card */}
                      <div
                        className="rounded-xl p-4 border-2"
                        style={{
                          background: 'rgba(168,85,247,0.1)',
                          borderColor: 'rgba(168,85,247,0.3)',
                          boxShadow: '0 0 15px rgba(168,85,247,0.2)',
                        }}
                      >
                        <p className="text-xs text-gray-400 mb-2">Credits Balance</p>
                        <p className="text-3xl font-bold text-white">120 <span className="text-sm text-gray-400">Credits</span></p>
                      </div>

                      {/* Skills with Request buttons */}
                      <div className="space-y-2">
                        {dashboardSkills.map((skill, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{
                              background: 'rgba(168,85,247,0.05)',
                              borderColor: 'rgba(168,85,247,0.2)',
                            }}
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">{skill.name}</p>
                              <p className="text-xs text-gray-400">{skill.type} • Friends: {skill.friends}</p>
                            </div>
                            <button
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-all duration-300"
                              style={{
                                boxShadow: '0 0 10px rgba(37,99,235,0.4)',
                              }}
                            >
                              Request
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ========== SECTION 2: PRODUCT PREVIEW ========== */}
          <section
            id="product-preview"
            className="py-32 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-white text-center mb-20"
              >
                See SkillSwap in Action
              </motion.h2>

              {/* Skill cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {skillsPreview.map((skill, idx) => {
                  const gradients = [
                    { from: '#0099ff', to: '#ec489b' },
                    { from: '#a855f7', to: '#0099ff' },
                    { from: '#ec489b', to: '#a855f7' },
                  ];
                  const grad = gradients[idx];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      {/* Glow background */}
                      <motion.div
                        className="absolute inset-0 rounded-xl blur-2xl pointer-events-none -z-10 group-hover:opacity-100 opacity-70 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                          boxShadow: `0 0 40px ${grad.from}80`,
                        }}
                        animate={{ opacity: [0.6, 0.9, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />

                      {/* CARD - GLASSMORPHISM */}
                      <div
                        className="relative rounded-xl border p-8 backdrop-blur-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                        style={{
                          background: 'rgba(15, 0, 30, 0.8)',
                          borderColor: 'rgba(255,255,255,0.08)',
                          boxShadow: `0 0 30px ${grad.from}60, inset 0 1px 0 rgba(255,255,255,0.1)`,
                        }}
                      >
                        <h3 className="text-xl font-bold text-white mb-4">{skill.name}</h3>
                        <div className="mb-6">
                          <span className="text-sm text-gray-400">Credits:</span>
                          <span className="text-2xl font-bold text-purple-300 ml-2">{skill.credits}</span>
                        </div>
                        <button
                          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                          style={{
                            boxShadow: '0 0 10px rgba(37,99,235,0.5)',
                          }}
                        >
                          Request Skill
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ========== SECTION 3: FEATURES GRID ========== */}
          <section
            id="features"
            className="py-32 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-5xl font-bold text-white text-center mb-20"
              >
                How SkillSwap Works
              </motion.h2>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  const gradients = [
                    { from: '#0099ff', to: '#a855f7' },
                    { from: '#ec489b', to: '#0099ff' },
                    { from: '#a855f7', to: '#ec489b' },
                    { from: '#0099ff', to: '#ec489b' },
                  ];
                  const grad = gradients[idx];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      {/* Glow background */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none -z-10 group-hover:opacity-100 opacity-60 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
                        }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />

                      {/* CARD - GLASSMORPHISM */}
                      <div
                        className="relative rounded-2xl border p-8 backdrop-blur-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-3"
                        style={{
                          background: 'rgba(15, 0, 30, 0.8)',
                          borderColor: 'rgba(255,255,255,0.08)',
                          boxShadow: `0 0 25px ${grad.from}50, inset 0 1px 0 rgba(255,255,255,0.1)`,
                        }}
                      >
                        <Icon className="text-purple-300 mb-4" size={32} />
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
            className="py-32 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Left: Dashboard Mock */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative h-96 hidden lg:flex items-center"
                >
                  {/* Background glow */}
                  <div className="absolute inset-0 rounded-2xl blur-3xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(168,85,247,0.25) 0%, transparent 70%)',
                    }}
                  />

                  {/* CARD - GLASSMORPHISM */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="relative w-full h-full"
                  >
                    <div
                      className="w-full h-full rounded-2xl overflow-hidden border p-6 backdrop-blur-2xl"
                      style={{
                        background: 'rgba(20, 10, 40, 0.7)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        boxShadow: '0 8px 32px rgba(168,85,247,0.3), 0 0 60px rgba(236,72,153,0.15)',
                      }}
                    >
                      <div className="text-center flex-1 flex flex-col items-center justify-center h-full">
                        <div className="space-y-4">
                          <div className="text-xs text-gray-400 mb-6">Dashboard Preview</div>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-20 h-20 rounded-full mx-auto"
                            style={{
                              background: 'linear-gradient(135deg, #a855f7, #ec489b)',
                              boxShadow: '0 0 30px rgba(168,85,247,0.6)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right: Benefits */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl font-bold text-white mb-4">
                    Manage your skills
                  </h2>
                  <p className="text-2xl text-purple-300 mb-8 font-semibold">
                    effortlessly
                  </p>
                  <p className="text-gray-400 mb-12">
                    Join the future of Skill exchange
                  </p>

                  <div className="space-y-6">
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
                        className="flex items-center gap-4"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            boxShadow: '0 0 10px rgba(34,197,94,0.4)',
                          }}
                        >
                          <Check size={16} className="text-white" />
                        </div>
                        <span className="text-white font-medium text-lg">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ========== SECTION 5: FOOTER ========== */}
          <footer
            className="py-12 px-4 sm:px-6 lg:px-8 border-t mt-20"
            style={{
              borderColor: 'rgba(255,255,255,0.05)',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white">SkillSwap</h3>
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
        </div>
      </main>
    </>
  );
}
