import { motion } from 'framer-motion';
import { BookOpen, Coins, Award } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: BookOpen,
      title: 'Teach a Skill',
      description: 'Share your expertise with others',
      credits: '+5',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Coins,
      title: 'Earn Credits',
      description: 'Get rewarded in skill credits',
      credits: 'Credits',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Award,
      title: 'Learn Skills',
      description: 'Use credits to learn from others',
      credits: '-5',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">How SkillSwap Works</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            A simple 3-step process to exchange skills and grow together
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  className="text-center relative"
                  variants={stepVariants}
                >
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white border-2 border-dark-200 rounded-full flex items-center justify-center font-bold text-dark-900 shadow-lg">
                    {idx + 1}
                  </div>

                  {/* Step number circle */}
                  <motion.div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 cursor-pointer shadow-lg`}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="text-white" size={48} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-dark-900 mb-3">{step.title}</h3>
                  <p className="text-dark-600 mb-6 min-h-12">{step.description}</p>

                  {/* Credit animation */}
                  <motion.div
                    className={`inline-block px-6 py-3 rounded-full font-bold text-white shadow-md ${step.credits.startsWith('-') ? 'bg-red-500' : 'bg-green-500'}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step.credits}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
