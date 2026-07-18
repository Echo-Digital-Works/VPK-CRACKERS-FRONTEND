import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from 'react-icons/fa';

export default function Location() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

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
            {!isMapLoaded ? (
              <div 
                className="w-full h-full rounded-xl bg-[#1a1a1a] flex flex-col items-center justify-center cursor-pointer hover:bg-[#222] transition-colors border border-white/5 relative overflow-hidden"
                onClick={() => setIsMapLoaded(true)}
              >
                {/* Decorative map grid background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-brand-orange text-6xl drop-shadow-[0_0_15px_rgba(255,107,0,0.8)] mb-6 relative z-10"
                >
                  <FaMapMarkerAlt />
                </motion.div>
                
                <div className="relative z-10 bg-brand-gold text-brand-dark font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  <span>Load Interactive Map</span>
                </div>
                <p className="text-gray-500 text-sm mt-4 relative z-10">Loads from Google Maps</p>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-brand-dark/20 pointer-events-none group-hover:bg-transparent transition-colors z-10" />
                <iframe
                  src="https://maps.google.com/maps?q=9.4039280,77.8784930&hl=en&z=14&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '0.75rem', filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="VPK Prem Crackers Location Map"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </>
            )}
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
                      Sattur to Sivakasi main Road<br />Opp southside International school<br />Anu and Athira Hotel Backside
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaPhoneAlt />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Contact</h5>
                    <p className="text-gray-400 text-sm">+91 93630 36803</p>
                    <p className="text-gray-400 text-sm">+91 93631 36803</p>

                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Email</h5>
                    <a href="mailto:vpkpremcracrkers@gmail.com" className="text-gray-400 text-sm hover:text-brand-gold transition-colors">vpkpremcracrkers@gmail.com</a>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <FaClock />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-white font-semibold mb-1">Business Hours</h5>
                    <p className="text-gray-400 text-sm">24/7 (Open All Days)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a href="tel:+919363036803" className="glass-card py-4 text-center rounded-xl hover:bg-brand-orange hover:text-white transition-colors group cursor-pointer border border-white/5 hover:border-transparent">
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
