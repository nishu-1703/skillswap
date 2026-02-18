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
    <section id="why-join" className="py-24 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">Why Join SkillSwap?</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6 rounded-full" />
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
                className="bg-white p-8 rounded-2xl border-2 border-dark-100 hover:border-blue-400 transition shadow-lg hover:shadow-2xl"
                variants={cardVariants}
                whileHover={{ y: -12, boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)' }}
              >
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360, backgroundColor: 'rgb(37, 99, 235)', color: 'white' }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="text-blue-600" size={24} />
                </motion.div>
                <h3 className="text-lg font-bold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
