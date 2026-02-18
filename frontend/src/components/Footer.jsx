import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-dark-900 text-dark-50 py-12 border-t border-dark-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg">SkillSwap</span>
            </div>
            <p className="text-dark-400 text-sm">
              Exchange skills, not money. Learn from anyone, teach everyone.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-400 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Security</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Roadmap</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-400 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Community</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Contact</a></li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-400 hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Terms</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">Cookies</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition">License</a></li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Left side */}
            <motion.p
              className="text-dark-400 text-sm flex items-center gap-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Made with
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={14} className="text-red-500 fill-red-500" />
              </motion.span>
              in Hyderabad
            </motion.p>

            {/* Social links */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {socials.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-dark-800 hover:bg-blue-600 flex items-center justify-center transition"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Right side */}
            <motion.p
              className="text-dark-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {currentYear} SkillSwap. All rights reserved.
            </motion.p>
          </div>
        </div>

        {/* Tech stack badge */}
        <motion.div
          className="text-center mt-8 text-xs text-dark-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p>Built with React + Vite + Tailwind CSS</p>
        </motion.div>
      </div>
    </footer>
  );
}
