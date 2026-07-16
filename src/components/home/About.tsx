import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        ".about-counter", 
        { innerText: 0 }, 
        {
          innerText: (_i: number, el: Element) => el.getAttribute('data-target'),
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
          }
        }
      );
    }
  }, []);

  const stats = [
    { label: "Years Experience", value: "5", suffix: "+" },
    { label: "Happy Customers", value: "5000", suffix: "+" },
    { label: "Products", value: "300", suffix: "+" },
    { label: "Quality", value: "100", suffix: "%" },
  ];

  return (
    <section id="about" className="py-16 lg:py-20 bg-brand-darker relative overflow-hidden" ref={sectionRef}>
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-orange/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              className="relative rounded-2xl overflow-hidden glass-card p-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Fireworks Celebration" 
                className="w-full aspect-square lg:aspect-[4/3] rounded-xl object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Floating badge */}
            <motion.div 
              className="absolute -bottom-6 -right-6 glass-card p-4 md:p-6 rounded-2xl border-b-4 border-b-brand-orange animate-[float_5s_ease-in-out_infinite] shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-brand-gold font-black text-3xl md:text-4xl mb-1">#1</div>
              <div className="text-white text-[10px] md:text-xs font-bold tracking-widest uppercase">Premium Quality</div>
            </motion.div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-[2px] bg-brand-orange" />
                <h4 className="text-brand-orange tracking-[0.2em] uppercase text-[10px] md:text-xs font-bold">About Our Heritage</h4>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Welcome to <span className="text-gradient">VPK PREM CRACKERS</span>
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed text-sm md:text-base font-light">
                This is a 5-year-old cracker shop, actively selling in Tamil Nadu, Karnataka, and Hyderabad. We are a licensed, premium crackers provider dedicated to making your festivals vibrant and safe. We believe in delivering only the highest quality fireworks that ensure maximum joy with uncompromised safety standards at affordable prices.
              </p>
              
              <ul className="space-y-2 mb-8">
                {['Premium Quality Licensed Products', '100% Safe & Tested Fireworks', 'Affordable Wholesale Pricing', 'Guaranteed Customer Satisfaction'].map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center text-gray-300 font-medium text-sm md:text-base"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-orange/30 flex items-center justify-center mr-3 text-brand-gold shadow-[0_0_10px_rgba(255,215,0,0.2)] text-xs">✓</div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Counters */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  className="relative overflow-hidden glass-card p-3 lg:p-4 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-colors group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-3xl lg:text-4xl font-black text-white mb-1 flex items-baseline">
                      <span className="about-counter drop-shadow-lg" data-target={stat.value}>0</span>
                      <span className="text-brand-gold ml-1 text-2xl">{stat.suffix}</span>
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
