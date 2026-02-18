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
    <section id="browse" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Browse Popular Skills</h2>
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
                whileHover={{ y: -4 }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-dark-200 hover:border-blue-400 transition h-full flex flex-col items-center justify-center text-center group-hover:shadow-lg">
                  <motion.div
                    className="mb-3"
                    whileHover={{ rotate: 20, scale: 1.2 }}
                  >
                    <Icon className="text-blue-600" size={32} />
                  </motion.div>
                  <h3 className="font-semibold text-dark-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-dark-600">{category.count} skills</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg">
            Explore All Skills
          </button>
        </motion.div>
      </div>
    </section>
  );
}
