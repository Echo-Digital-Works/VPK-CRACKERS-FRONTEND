import { motion } from 'framer-motion';

export default function Founders() {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none" />
      
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
            <h4 className="text-brand-orange tracking-[0.2em] uppercase text-xs font-bold">The Visionaries</h4>
            <div className="w-12 h-[2px] bg-brand-orange" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Meet Our <span className="text-gradient">Founders</span>
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
          {/* Founder 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/5 relative group hover:border-brand-gold/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white/10 group-hover:border-brand-gold/50 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">John Doe</h3>
              <p className="text-brand-gold font-medium uppercase tracking-widest text-sm mb-6">Co-Founder & CEO</p>
              <p className="text-gray-400 italic">
                "Our mission has always been to bring joy and light to every celebration, ensuring that families can create magical memories with complete peace of mind."
              </p>
            </div>
          </motion.div>

          {/* Founder 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/5 relative group hover:border-brand-gold/30 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white/10 group-hover:border-brand-gold/50 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Jane Smith</h3>
              <p className="text-brand-gold font-medium uppercase tracking-widest text-sm mb-6">Co-Founder & COO</p>
              <p className="text-gray-400 italic">
                "Quality and safety are the cornerstones of our business. We meticulously source our products so your festive nights are always spectacular and secure."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
