import { motion } from 'framer-motion';
import { Users, Clock, Zap, Award } from 'lucide-react';

export default function WhyJoin() {
  const features = [
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Learn from passionate experts in your area',
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Learn at your own pace, whenever you want',
    },
    {
      icon: Zap,
      title: 'No Money Required',
      description: 'Exchange skills through our credit system',
    },
    {
      icon: Award,
      title: 'Get Recognized',
      description: 'Build your profile and get verified for skills',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="why-join" className="py-20 bg-dark-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Why Join SkillSwap?</h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Join thousands of learners and educators building a global skill-sharing community
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-xl border border-dark-200 hover:border-blue-400 transition"
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
              >
                <motion.div
                  className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360, backgroundColor: 'rgb(37, 99, 235)' }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="text-blue-600 group-hover:text-white" size={24} />
                </motion.div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
