import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export default function Location() {
  return (
    <section id="location" className="py-24 bg-brand-darker relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-orange tracking-widest uppercase text-sm font-bold mb-3"
          >
            Visit Our Store
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Our <span className="text-gradient">Location</span>
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Map */}
          <motion.div 
            className="w-full lg:w-2/3 h-[500px] rounded-2xl overflow-hidden glass-card p-2 relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Overlay to prevent accidental scrolling on map initially, until clicked or hovered deeply */}
            <div className="absolute inset-0 bg-brand-dark/20 pointer-events-none group-hover:bg-transparent transition-colors z-10" />
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15663.856950346894!2d77.78168235!3d9.45864145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cee15a96a92b%3A0xc0fb1df92694b7cc!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '0.75rem', filter: 'invert(90%) hue-rotate(180deg)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Animated Pin Overlay (Custom design element over the map) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                 className="text-brand-orange text-4xl drop-shadow-[0_0_10px_rgba(255,107,0,0.8)]"
               >
                 <FaMapMarkerAlt />
               </motion.div>
               <div className="w-4 h-1 bg-black/50 rounded-full blur-[2px] mt-2"></div>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div 
            className="w-full lg:w-1/3 flex flex-col gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8 rounded-2xl flex-grow border-t-2 border-t-brand-gold/50">
              <h3 className="text-2xl font-bold text-white mb-6">Shop Details</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold mt-1 shrink-0">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Address</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      123 Fireworks Street, Industrial Estate, Sivakasi, Tamil Nadu 626123
                    </p>
                    <p className="text-brand-orange text-xs mt-1">Landmark: Near Main Factory Outlet</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaPhoneAlt />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Contact</h5>
                    <p className="text-gray-400 text-sm">+91 98765 43210</p>
                    <p className="text-gray-400 text-sm">+91 87654 32109</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Email</h5>
                    <p className="text-gray-400 text-sm">sales@luminarycrackers.com</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaClock />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Working Hours</h5>
                    <p className="text-gray-400 text-sm">Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-400 text-sm">Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a href="tel:+919876543210" className="glass-card py-4 text-center rounded-xl hover:bg-brand-orange hover:text-white transition-colors group cursor-pointer border border-white/5 hover:border-transparent">
                <FaPhoneAlt className="mx-auto mb-2 text-brand-gold group-hover:text-white transition-colors" />
                <span className="font-semibold text-sm">Call Now</span>
              </a>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="glass-card py-4 text-center rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-colors group cursor-pointer border border-white/5 hover:border-transparent text-white">
                <FaMapMarkerAlt className="mx-auto mb-2 text-brand-orange group-hover:text-brand-dark transition-colors" />
                <span className="font-semibold text-sm">Directions</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
