import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Hyderabad',
      role: 'Web Developer',
      avatar: 'PS',
      text: 'SkillSwap helped me learn UI/UX design without spending money. I traded my coding skills and it\'s been fantastic!',
      rating: 5,
    },
    {
      name: 'Rahul Patel',
      location: 'Hyderabad',
      role: 'Designer',
      avatar: 'RP',
      text: 'The community is so welcoming. I\'ve learned Python and made friends from around the world. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Anjali Verma',
      location: 'Hyderabad',
      role: 'Content Creator',
      avatar: 'AV',
      text: 'Best decision ever. No payment required, just pure skill exchange. This is how learning should be!',
      rating: 5,
    },
    {
      name: 'Aditya Singh',
      location: 'Hyderabad',
      role: 'Music Producer',
      avatar: 'AS',
      text: 'I taught music production and learned graphic design. The credit system is elegant and fair.',
      rating: 5,
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
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-dark-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">What Our Community Says</h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Join thousands of happy learners from Hyderabad and beyond
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-xl border border-dark-200 hover:border-blue-400 transition"
              variants={cardVariants}
              whileHover={{ y: -8 }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-dark-700 mb-6 line-clamp-3">{testimonial.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                  whileHover={{ scale: 1.1 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-dark-900 text-sm">{testimonial.name}</p>
                  <p className="text-dark-600 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
