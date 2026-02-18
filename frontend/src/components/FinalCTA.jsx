import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-60 h-60 bg-white opacity-5 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            Ready to Swap Skills?
          </motion.h2>

          <motion.p
            className="text-xl opacity-95 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Join our community today and start exchanging skills with learners from around the world.
          </motion.p>

          {/* Benefits list */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
            variants={itemVariants}
          >
            {[
              'No credit card required',
              'Learn at your pace',
              'Get verified for skills',
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                className="flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Check size={20} className="flex-shrink-0" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Email signup form */}
          <motion.form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
            variants={itemVariants}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <motion.button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {submitted ? (
                <>
                  <Check size={20} />
                  Success!
                </>
              ) : (
                <>
                  Let's Go
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            className="text-sm opacity-90"
            variants={itemVariants}
          >
            No spam, just great learning opportunities. Unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
