import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoSrc = isMobile 
    ? "https://res.cloudinary.com/dowsywzrx/video/upload/v1784175977/WhatsApp_Video_2026-07-16_at_9.55.58_AM_rjmy3k.mp4"
    : "https://res.cloudinary.com/dowsywzrx/video/upload/v1784095103/pattasubalu_3_jwlt7x.mp4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <video
          autoPlay
          muted
          playsInline
          onEnded={onComplete}
          onError={onComplete}
          src={videoSrc}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 right-10 z-50">
          <button 
            onClick={onComplete}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full backdrop-blur-sm transition-all font-bold tracking-wider text-sm"
          >
            Skip Intro
          </button>
        </div>
      </motion.div>
    </div>
  );
}
