import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does the credit system work?',
      answer: 'When you teach a skill, you earn credits (typically +5 per session). When you learn a skill, you spend credits (typically -5 per session). This system ensures fair exchange between teachers and learners.',
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No! SkillSwap is completely free. We only operate on a credit-based system. No money changes hands—just pure skill exchange.',
    },
    {
      question: 'How do I get started?',
      answer: 'Sign up for free, add a skill you can teach, and start browsing skills others are offering. You can message instructors and book sessions at your convenience.',
    },
    {
      question: 'Is it safe to teach/learn with strangers?',
      answer: 'Yes! We have a community rating system, verified profiles, and reviews from previous sessions. Plus, video sessions are conducted through secure links.',
    },
    {
      question: 'Can I teach multiple skills?',
      answer: 'Absolutely! Many users teach 2-3 skills and learn others. You can add, update, or remove skills from your profile anytime.',
    },
    {
      question: 'What if I\'m in a different timezone?',
      answer: 'Our platform connects global learners. You can filter by timezone, use async learning (recorded sessions), or find flexible instructors.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-amber-900 via-orange-900 to-amber-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-300 to-amber-300 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-amber-100">
            Everything you need to know about SkillSwap
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className="border-2 border-amber-600 rounded-xl overflow-hidden hover:border-yellow-300 transition"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-6 py-5 flex items-center justify-between bg-orange-700 hover:bg-orange-600 transition"
              >
                <span className="font-semibold text-white text-left text-lg">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} className="text-yellow-300" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-amber-800 border-t-2 border-amber-600 text-amber-100 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 p-8 bg-gradient-to-r from-yellow-500 to-amber-500 border-2 border-yellow-400 rounded-2xl text-center shadow-2xl shadow-yellow-500/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-amber-900 font-bold text-lg mb-2">Still have questions?</p>
          <p className="text-amber-800 mb-6">Reach out to our support team at support@skillswap.com</p>
          <motion.button 
            className="px-8 py-3 bg-gradient-to-r from-amber-900 to-orange-900 text-yellow-300 rounded-lg hover:shadow-lg transition font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
