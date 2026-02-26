import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Cog,
  Compass,
  GraduationCap,
  Home,
  MessageCircle,
  Search,
  Settings,
  Star,
} from 'lucide-react';
import './Landing.css';
import SittingDoodle from '../components/doodles/SittingDoodle.tsx';
import ReadingDoodle from '../components/doodles/ReadingDoodle.tsx';
import SittingReadingDoodle from '../components/doodles/SittingReadingDoodle.tsx';
import StrollingDoodle from '../components/doodles/StrollingDoodle.tsx';

const navLinks = [
  { label: 'Home', target: 'top' },
  { label: 'Courses', target: 'dashboard' },
  { label: 'About', target: 'features' },
  { label: 'Contact', target: 'footer' },
];

const featureCards = [
  {
    icon: GraduationCap,
    title: 'Learning',
   
  },
  {
    icon: Cog,
    title: 'Skills',
    
  },
  {
    icon: MessageCircle,
    title: 'Community',
    
  },
];

const dashboardCourses = [
  { tone: 'blue', title: 'Web Design', teacher: 'Alex Morgan', rating: '4.8', students: '220' },
  { tone: 'purple', title: 'UI Basics', teacher: 'Priya Das', rating: '4.7', students: '180' },
  { tone: 'teal', title: 'Python Core', teacher: 'Diana Stone', rating: '4.9', students: '265' },
  { tone: 'violet', title: 'Brand Visuals', teacher: 'Noah Reed', rating: '4.8', students: '210' },
];

const tutorCards = [
  { name: 'Emma Wilson', course: 'Modern Design', rating: '5.0' },
  { name: 'Ava Brown', course: 'React Essentials', rating: '4.9' },
  { name: 'Liam Jones', course: 'Communication', rating: '4.8' },
  { name: 'Noah Scott', course: 'Growth Strategy', rating: '4.9' },
];

const sideMenu = [
  { icon: Home, label: 'Home' },
  { icon: Compass, label: 'Explore' },
  { icon: BookOpen, label: 'Feed' },
  { icon: Settings, label: 'Settings' },
];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="edu-page" id="top">
      <div className="edu-shell">
        <section className="edu-hero">
          <header className="edu-nav">
            <button type="button" className="edu-logo" onClick={() => navigate('/')}>
              SkillSwap
            </button>

            <nav className="edu-nav-links" aria-label="Landing">
              {navLinks.map((link) => (
                <button type="button" key={link.label} onClick={() => scrollToSection(link.target)}>
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="edu-nav-right">
              <button type="button" className="edu-search-pill" aria-label="Search">
                <Search size={14} />
                <span>Search</span>
              </button>
              <button type="button" className="edu-signup-pill" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </header>

          <div className="edu-hero-body">
            <motion.div
              className="edu-figure-img edu-figure-left"
              initial={{ opacity: 0, y: 18, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              aria-hidden="true"
            >
              <SittingDoodle ink="#1f1f39" accent="#f6ad2a" />
            </motion.div>

            <motion.div
              className="edu-hero-copy"
              variants={reveal}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.55 }}
            >
              <h1>Landing Page for Skill Growth</h1>
              <p />
              <button type="button" className="edu-hero-cta" onClick={() => navigate('/signup')}>
                Get Started
              </button>
            </motion.div>

            <motion.div
              className="edu-figure-img edu-figure-right"
              initial={{ opacity: 0, y: 18, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              aria-hidden="true"
            >
              <ReadingDoodle ink="#1f1f39" accent="#f59d2a" />
            </motion.div>
          </div>
        </section>

        <section className="edu-features" id="features">
          <div className="edu-feature-grid">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  className="edu-feature-card"
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true }}
                >
                  <span className="edu-feature-icon">
                    <Icon size={27} />
                  </span>
                  <h2>{feature.title}</h2>
                  <p>{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="edu-dashboard-section" id="dashboard">
          <motion.div
            className="edu-dashboard"
            variants={reveal}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <aside className="edu-sidebar">
              <div className="edu-profile-dot">P</div>
              <nav>
                {sideMenu.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.label} type="button" className="edu-side-item">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <button type="button" className="edu-side-search" aria-label="Search dashboard">
                <Search size={16} />
              </button>
            </aside>

            <div className="edu-dash-main">
              <div className="edu-dash-head">
                <h3>Dashboard</h3>
                <div className="edu-dash-filters">
                  <button type="button">Details</button>
                  <button type="button">Courses</button>
                </div>
              </div>

              <div className="edu-dash-summary">
                <div>
                  <p>Weekly Progress</p>
                  <div className="edu-progress-row">
                    <span>Design</span>
                    <div>
                      <i style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div className="edu-progress-row">
                    <span>Code</span>
                    <div>
                      <i style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div className="edu-progress-row">
                    <span>Practice</span>
                    <div>
                      <i style={{ width: '66%' }} />
                    </div>
                  </div>
                </div>

                <div className="edu-credit-stack">
                  <div>
                    <strong>320</strong>
                    <span>Earned</span>
                  </div>
                  <div>
                    <strong>124</strong>
                    <span>Spent</span>
                  </div>
                </div>
              </div>

              <div className="edu-course-grid">
                {dashboardCourses.map((course) => (
                  <article key={course.title} className={`edu-course-card tone-${course.tone}`}>
                    <header>
                      <h4>{course.title}</h4>
                      <button type="button">Join</button>
                    </header>
                    <p>{course.teacher}</p>
                    <footer>
                      <span>
                        <Star size={13} /> {course.rating}
                      </span>
                      <span>{course.students} students</span>
                    </footer>
                  </article>
                ))}
              </div>

              <div className="edu-dash-tabs">
                <button type="button">Overview</button>
                <button type="button">Skill Plan</button>
                <button type="button">Courses</button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="edu-teachers">
          <div className="edu-mini-figure edu-mini-left" aria-hidden="true">
            <SittingReadingDoodle ink="#202043" accent="#f3b930" />
          </div>

          <div className="edu-teachers-panel">
            <header>
              <h3>Teachers</h3>
              <button type="button" onClick={() => navigate('/signup')}>
                Browse
              </button>
            </header>

            <div className="edu-teacher-grid">
              {tutorCards.map((teacher) => (
                <article key={teacher.name} className="edu-teacher-card">
                  <div className="edu-avatar">{teacher.name[0]}</div>
                  <h4>{teacher.name}</h4>
                  <p>{teacher.course}</p>
                  <span>
                    <Star size={12} /> {teacher.rating}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="edu-mini-figure edu-mini-right" aria-hidden="true">
            <StrollingDoodle ink="#202043" accent="#2fa9e8" />
          </div>
        </section>

        <footer className="edu-footer" id="footer">
          <div className="edu-footer-grid">
            <div>
              <h4>SkillSwap</h4>
              <p>Learn and teach smarter.</p>
              <div className="edu-socials">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Fb
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Tw
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Ig
                </a>
              </div>
            </div>

            <div>
              <h4>Links</h4>
              <a href="#top">Home</a>
              <a href="#dashboard">Courses</a>
              <a href="#features">About</a>
              <a href="mailto:contact@skillswap.com">Contact</a>
            </div>

            <div>
              <h4>Newsletter</h4>
              <p>Get weekly updates about new sessions and course recommendations.</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <input type="email" placeholder="Enter your email" aria-label="Email" />
                <button type="button" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
