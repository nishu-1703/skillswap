import { motion } from 'framer-motion';
import { TrendingUp, Star, CheckCircle } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    { icon: CheckCircle, label: '12k+ Skills', value: '12k+' },
    { icon: Star, label: '4.9/5 Rating', value: '4.9/5' },
    { icon: TrendingUp, label: '98% Completion', value: '98%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-purple-50 py-8 border-b border-dark-200"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-6 sm:gap-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-dark-600">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-dark-900">{stat.value}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
