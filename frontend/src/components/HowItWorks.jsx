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
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">How SkillSwap Works</h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
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
                  className="text-center"
                  variants={stepVariants}
                >
                  {/* Step number circle */}
                  <motion.div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 cursor-pointer`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="text-white" size={40} />
                  </motion.div>

                  <h3 className="text-xl font-bold text-dark-900 mb-2">{step.title}</h3>
                  <p className="text-dark-600 mb-4">{step.description}</p>

                  {/* Credit animation */}
                  <motion.div
                    className="inline-block px-4 py-2 bg-dark-100 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className={`font-bold ${step.credits.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                      {step.credits}
                    </span>
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
