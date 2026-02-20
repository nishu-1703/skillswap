import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/8"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45 }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-lg font-semibold text-white/90 hover:opacity-90 transition"
            aria-label="Go to home"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-lg">
              <Sparkles size={20} className="text-white" />
            </span>
            <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/60">SkillSwap</span>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition font-medium">How It Works</a>
            <a href="#why-join" className="text-gray-300 hover:text-white transition font-medium">Why Join</a>
            <a href="#browse" className="text-gray-300 hover:text-white transition font-medium">Browse Skills</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition font-medium">FAQ</a>
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium shadow-xl"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm text-white/90 border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-xl"
                >
                  Join Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white/90"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="px-4 py-4 space-y-3 border-t border-white/8 bg-black/60 backdrop-blur">
            <a href="#how-it-works" className="block text-gray-300 hover:text-white py-2">How It Works</a>
            <a href="#why-join" className="block text-gray-300 hover:text-white py-2">Why Join</a>
            <a href="#browse" className="block text-gray-300 hover:text-white py-2">Browse Skills</a>
            <a href="#faq" className="block text-gray-300 hover:text-white py-2">FAQ</a>

            <div className="pt-2 mt-2 border-t border-white/8 space-y-2">
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg">Dashboard</button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="w-full px-4 py-3 text-white border border-white/10 rounded-lg">Sign In</button>
                  <button onClick={() => navigate('/signup')} className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">Join Free</button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}

