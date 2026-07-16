import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, type: 'contact' })
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        let text = `*New General Enquiry*\n`;
        text += `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n`;
        text += `Message: ${formData.message}`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/919363036803?text=${encodedText}`, '_blank');

        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold tracking-widest uppercase text-sm font-bold mb-3"
          >
            Get In Touch
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Send an <span className="text-gradient">Enquiry</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Looking for wholesale rates or custom gift boxes? Fill out the form below and our team will get back to you with the best prices.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <motion.form 
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-12 rounded-3xl border-t border-t-white/20 shadow-2xl relative lg:col-span-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative group">
                <input 
                  type="text" 
                  name="name" 
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors peer placeholder-transparent"
                  placeholder="Your Name"
                />
                <label htmlFor="name" className="absolute left-0 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-orange peer-valid:-top-4 peer-valid:text-xs peer-valid:text-brand-gold cursor-text">
                  Your Name
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="tel" 
                  name="phone" 
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors peer placeholder-transparent"
                  placeholder="Phone Number"
                />
                <label htmlFor="phone" className="absolute left-0 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-orange peer-valid:-top-4 peer-valid:text-xs peer-valid:text-brand-gold cursor-text">
                  Phone Number
                </label>
              </div>
            </div>

            <div className="relative group mb-8">
              <input 
                type="email" 
                name="email" 
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors peer placeholder-transparent"
                placeholder="Email Address"
              />
              <label htmlFor="email" className="absolute left-0 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-orange peer-valid:-top-4 peer-valid:text-xs peer-valid:text-brand-gold cursor-text">
                Email Address (Optional)
              </label>
            </div>

            <div className="relative group mb-12">
              <textarea 
                name="message" 
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-white/20 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors peer placeholder-transparent resize-none"
                placeholder="Your Message/Requirements"
              ></textarea>
              <label htmlFor="message" className="absolute left-0 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-orange peer-valid:-top-4 peer-valid:text-xs peer-valid:text-brand-gold cursor-text">
                Your Message/Requirements
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full relative overflow-hidden group font-bold text-lg py-4 rounded-xl transition-all ${
                isSubmitting ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? 'Sending...' : 'Send Enquiry'} 
                {!isSubmitting && <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
              </span>
              {!isSubmitting && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
            </button>

            {submitStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center text-sm">
                Thank you! Your enquiry has been sent successfully. We will contact you soon.
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
                Oops! Something went wrong. Please try again later or call us directly.
              </motion.div>
            )}
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center glass-card p-8 rounded-3xl border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-6 text-center">Follow Us on Instagram</h3>
            <a href="https://www.instagram.com/vpkpremcrackers?utm_source=qr&igsh=MWJza2o0bzNzNmswOQ==" target="_blank" rel="noreferrer" className="w-56 h-56 block rounded-2xl overflow-hidden mb-6 border-2 border-brand-orange p-2 bg-white hover:border-brand-gold transition-colors shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              <img src="/qr.jpeg" alt="Instagram QR Code" className="w-full h-full object-contain rounded-xl" />
            </a>
            <p className="text-gray-400 text-sm text-center leading-relaxed">Scan or click this QR code to follow us and get the latest offers & festive updates!</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
