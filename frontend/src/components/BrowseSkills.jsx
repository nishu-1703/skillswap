import { motion } from 'framer-motion';
import { Code, Palette, Globe, Music, ChefHat, Camera, Briefcase, BookOpen } from 'lucide-react';

export default function BrowseSkills() {
  const categories = [
    { icon: Code, name: 'Coding', count: 2840 },
    { icon: Palette, name: 'Design', count: 1950 },
    { icon: Globe, name: 'Languages', count: 3120 },
    { icon: Music, name: 'Music', count: 1450 },
    { icon: ChefHat, name: 'Cooking', count: 980 },
    { icon: Camera, name: 'Photography', count: 1320 },
    { icon: Briefcase, name: 'Business', count: 1840 },
    { icon: BookOpen, name: 'Writing', count: 1260 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section id="browse" className="py-24 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4">Browse Popular Skills</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-indigo-600 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Explore thousands of skills in diverse categories
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                className="group cursor-pointer"
                variants={cardVariants}
                whileHover={{ y: -8 }}
              >
                <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl border-2 border-indigo-100 hover:border-indigo-400 transition h-full flex flex-col items-center justify-center text-center group-hover:shadow-2xl shadow-lg">
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: 20, scale: 1.3 }}
                  >
                    <Icon className="text-indigo-600" size={40} />
                  </motion.div>
                  <h3 className="font-bold text-dark-900 mb-2 text-lg">{category.name}</h3>
                  <p className="text-sm text-dark-600 font-medium">{category.count} skills</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition font-bold text-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Skills
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
