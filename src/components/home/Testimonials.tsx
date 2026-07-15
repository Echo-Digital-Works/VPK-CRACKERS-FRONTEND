import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Event Organizer",
      content: "Luminary Fireworks provided the most spectacular display for our grand festival. The quality is unmatched and their service is incredibly professional.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Happy Customer",
      content: "We buy our Diwali crackers from here every year. Safe, vibrant, and always reasonably priced. Highly recommend their gift boxes!",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Wedding Planner",
      content: "Their sky shots and flower pots are absolute crowd-pleasers. Whenever I need premium fireworks for a wedding, Luminary is my only go-to.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-brand-darker relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-brand-orange/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-brand-orange" />
            <h4 className="text-brand-orange tracking-[0.2em] uppercase text-xs font-bold">Client Stories</h4>
            <div className="w-12 h-[2px] bg-brand-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="glass-card p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-brand-gold/20 mb-6">
                <FaQuoteLeft className="w-10 h-10" />
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-brand-gold w-4 h-4 mr-1" />
                ))}
              </div>
              <p className="text-gray-300 font-light leading-relaxed mb-8">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center text-brand-dark font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-brand-orange text-xs uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
