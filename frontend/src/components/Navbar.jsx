import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-900/80 border-b border-white/10 shadow-xl backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-dark-900 hidden sm:inline">SkillSwap</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-dark-200 hover:text-blue-400 transition font-medium">How It Works</a>
            <a href="#why-join" className="text-dark-200 hover:text-blue-400 transition font-medium">Why Join</a>
            <a href="#browse" className="text-dark-200 hover:text-blue-400 transition font-medium">Browse Skills</a>
            <a href="#faq" className="text-dark-200 hover:text-blue-400 transition font-medium">FAQ</a>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">
              <LogIn size={18} />
              Login
            </button>
            <motion.button 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Free
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="md:hidden overflow-hidden bg-dark-800/95 backdrop-blur-md"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-2 border-t border-white/10">
            <a href="#how-it-works" className="block px-3 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">How It Works</a>
            <a href="#why-join" className="block px-3 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">Why Join</a>
            <a href="#browse" className="block px-3 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">Browse Skills</a>
            <a href="#faq" className="block px-3 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">FAQ</a>
            <div className="border-t border-white/10 pt-2 mt-2 space-y-2">
              <button className="w-full px-3 py-2 text-dark-200 hover:bg-white/10 rounded-lg transition">Login</button>
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">Join Free</button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
