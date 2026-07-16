import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    // Basic GSAP parallax on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      gsap.to(".hero-parallax", {
        x,
        y,
        ease: "power2.out",
        duration: 1
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const titleText = "Celebrate Every Moment with Premium Crackers";
  
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-brand-dark" ref={containerRef}>
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          key={isMobile ? 'mobile' : 'desktop'}
          poster={isMobile ? "https://res.cloudinary.com/dowsywzrx/video/upload/v1784098424/WhatsApp_Video_2026-07-15_at_11.55.17_AM_p12fks.jpg" : "https://res.cloudinary.com/dowsywzrx/video/upload/v1784094044/pattasupalu2_njvvvl.jpg"}
          src={isMobile ? "https://res.cloudinary.com/dowsywzrx/video/upload/v1784098424/WhatsApp_Video_2026-07-15_at_11.55.17_AM_p12fks.mp4" : "https://res.cloudinary.com/dowsywzrx/video/upload/v1784094044/pattasupalu2_njvvvl.mp4"}
          className="w-full h-full object-cover opacity-80 scale-105"
          style={{ animation: 'zoom 20s infinite alternate linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark z-10" />
      </div>

      {/* Floating Particles Placeholder */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/20 via-transparent to-transparent mix-blend-screen animate-pulse" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto hero-parallax">
        {/* Decorative glowing sphere behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-brand-orange/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="overflow-hidden mb-6">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white drop-shadow-2xl font-heading tracking-wide"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.04, delayChildren: 0.2 }
              }
            }}
          >
            {titleText.split(" ").map((word, i) => (
              <span key={i} className="inline-block mr-4 md:mr-6">
                {word.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, y: 100, rotateX: -90, transformPerspective: 1000 },
                      visible: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000 }
                    }}
                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light tracking-wide border-t border-white/10 pt-6">
            Experience Safe, Colorful and High Quality Fireworks for Every Festival.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#products" className="relative overflow-hidden group bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-orange text-brand-dark font-extrabold px-10 py-5 rounded-full w-full sm:w-auto text-center hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transition-all duration-300 transform hover:-translate-y-1">
            <span className="relative z-10 tracking-wider uppercase text-sm">Explore Collection</span>
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a href="#contact" className="glass-card text-white font-bold px-10 py-5 rounded-full w-full sm:w-auto text-center hover:bg-white/10 transition-all duration-300 hover:border-brand-gold/50 transform hover:-translate-y-1 tracking-wider uppercase text-sm">
            Enquire Now
          </a>
        </motion.div>
      </div>


      <style>{`
        @keyframes zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}
