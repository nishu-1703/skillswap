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
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-12 border-b border-blue-500/30 shadow-xl"
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
                  <Icon className="text-white" size={20} />
                  <div>
                    <p className="text-sm text-blue-100">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
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
