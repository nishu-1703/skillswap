import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Code2,
  Coins,
  PenTool,
  Repeat2,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import './Landing.css';

const navItems = [
  { label: 'Features', target: 'features' },
  { label: 'Skills', target: 'preview' },
  { label: 'How It Works', target: 'features' },
];

const previewSkills = [
  { icon: Code2, name: 'Web Development', credits: 20 },
  { icon: Sparkles, name: 'Python Programming', credits: 15 },
  { icon: PenTool, name: 'UI Design', credits: 10 },
];

const featureCards = [
  {
    icon: Repeat2,
    title: 'Skill Exchange',
    description: 'Exchange your skills with learners worldwide using a simple request flow.',
  },
  {
    icon: Coins,
    title: 'Credit System',
    description: 'Earn credits by teaching and spend credits to learn from other members.',
  },
  {
    icon: UserCircle2,
    title: 'User Profiles',
    description: 'Build a clear teaching profile with skills, reviews, and session history.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Platform',
    description: 'Reliable access, verified accounts, and structured skill request workflows.',
  },
];

const dashboardRows = [
  { name: 'Web Development', details: 'Available | Friends: 20' },
  { name: 'Graphic Design', details: 'Available | Friends: 15' },
];

const benefits = ['Track credits', 'Browse skills', 'Exchange knowledge easily'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="cosmic-landing">
      <div className="cosmic-bg" aria-hidden="true">
        <div className="cosmic-stars" />
        <div className="cosmic-nebula nebula-a" />
        <div className="cosmic-nebula nebula-b" />
        <div className="cosmic-nebula nebula-c" />
        <div className="cosmic-trail trail-a" />
        <div className="cosmic-trail trail-b" />
        <div className="cosmic-trail trail-c" />
      </div>

      <div className="cosmic-shell">
        <motion.header
          className="cosmic-topbar cosmic-glass"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="cosmic-brand" onClick={() => navigate('/')}>
            <Sparkles size={18} />
            <span>SkillSwap</span>
          </button>

          <nav className="cosmic-nav" aria-label="Landing navigation">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => scrollToSection(item.target)}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="cosmic-auth">
            <button className="cosmic-link-btn" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="cosmic-mini-cta" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </motion.header>

        <section className="cosmic-hero" id="top">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.65 }}
            className="cosmic-hero-copy"
          >
            <h1>Learn & Teach Skills Without Money</h1>
            <p>Exchange knowledge using credits. Grow your skills together.</p>

            <div className="cosmic-actions">
              <button className="cosmic-primary-btn" onClick={() => navigate('/signup')}>
                Get Started <ArrowRight size={16} />
              </button>
              <button className="cosmic-secondary-btn" onClick={() => scrollToSection('preview')}>
                Explore Skills
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="cosmic-dashboard-wrap"
          >
            <div className="planet-orb" aria-hidden="true" />
            <div className="cosmic-dashboard cosmic-glass">
              <div className="dashboard-head">
                <span>SkillSwap</span>
                <span>Credits</span>
              </div>

              <div className="dashboard-balance cosmic-glass-soft">
                <p>Credits Balance</p>
                <h3>
                  120 <span>Credits</span>
                </h3>
              </div>

              <div className="dashboard-list">
                {dashboardRows.map((row) => (
                  <div className="dashboard-row cosmic-glass-soft" key={row.name}>
                    <div>
                      <h4>{row.name}</h4>
                      <p>{row.details}</p>
                    </div>
                    <button>Request Skill</button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="cosmic-section" id="preview">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            See SkillSwap in Action
          </motion.h2>

          <div className="cosmic-card-grid">
            {previewSkills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.article
                  key={skill.name}
                  className="cosmic-skill-card cosmic-glass"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="skill-title">
                    <Icon size={24} />
                    <div>
                      <h3>{skill.name}</h3>
                      <p>Credits: {skill.credits}</p>
                    </div>
                  </div>
                  <button>Request Skill</button>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="cosmic-section" id="features">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            How SkillSwap Works
          </motion.h2>

          <div className="cosmic-feature-grid">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  className="cosmic-feature-card cosmic-glass"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="cosmic-section cosmic-showcase">
          <motion.div
            className="cosmic-showcase-panel cosmic-glass"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
          >
            <div className="showcase-ring" aria-hidden="true" />
            <div className="dashboard-head">
              <span>SkillSwap</span>
              <span>Dashboard</span>
            </div>
            <div className="dashboard-balance cosmic-glass-soft">
              <p>Credits Balance</p>
              <h3>
                120 <span>Credits</span>
              </h3>
            </div>
            <div className="dashboard-list">
              {dashboardRows.map((row) => (
                <div className="dashboard-row cosmic-glass-soft" key={`show-${row.name}`}>
                  <div>
                    <h4>{row.name}</h4>
                    <p>{row.details}</p>
                  </div>
                  <button>Request Skill</button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="cosmic-showcase-copy"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true }}
          >
            <h2>Manage your skills effortlessly</h2>
            <p>Join the future of skill exchange and keep learning momentum every week.</p>
            <ul>
              {benefits.map((item) => (
                <li key={item}>
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        <footer className="cosmic-footer">
          <p>SkillSwap • Learn and teach skills without money</p>
          <div className="cosmic-footer-links">
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Signup</button>
            <a href="mailto:contact@skillswap.com">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
