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
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-dark-600">
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
              className="border border-dark-200 rounded-lg overflow-hidden"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-6 py-4 flex items-center justify-between bg-dark-50 hover:bg-dark-100 transition"
              >
                <span className="font-semibold text-dark-900 text-left">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} className="text-dark-600" />
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
                    <div className="px-6 py-4 bg-white border-t border-dark-200 text-dark-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-dark-900 font-semibold mb-2">Still have questions?</p>
          <p className="text-dark-700 mb-4">Reach out to our support team at support@skillswap.com</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
