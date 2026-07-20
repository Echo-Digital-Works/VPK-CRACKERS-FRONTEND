import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiShoppingCart } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Products', href: '#products' },
  { name: 'Videos', href: '#videos' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Location', href: '#location' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartTotalCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate(`/${href}`);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center relative group">
          <motion.div
            animate={{ 
              filter: [
                'drop-shadow(0 0 8px rgba(255,215,0,0.6))',
                'drop-shadow(0 0 20px rgba(255,215,0,1))',
                'drop-shadow(0 0 8px rgba(255,215,0,0.6))'
              ] 
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img 
              src="/images.png" 
              alt="Luminary Logo" 
              width="80" 
              height="80" 
              className="h-16 w-auto object-contain rounded-xl bg-white/10 p-1.5 backdrop-blur-sm border border-white/20" 
            />
          </motion.div>
          
          {/* Sparkles */}
          <motion.div 
            className="absolute -top-3 -left-3 w-4 h-4 bg-brand-gold rounded-full blur-[2px]"
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div 
            className="absolute -bottom-2 -right-3 w-3 h-3 bg-white rounded-full blur-[1px]"
            animate={{ scale: [0, 1.8, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
          <motion.div 
            className="absolute top-1/2 -right-6 w-2.5 h-2.5 bg-brand-orange rounded-full blur-[1px]"
            animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-gray-300 hover:text-brand-gold transition-colors text-sm uppercase tracking-widest relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] backdrop-blur-md"
          >
            Enquiry
          </a>
          <Link to="/cart" aria-label="Shopping Cart" className="relative p-2 text-white hover:text-brand-gold transition-colors">
            <HiShoppingCart className="w-6 h-6" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cartTotalCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Icons (Cart + Menu Toggle) */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link to="/cart" aria-label="Shopping Cart" className="relative p-2 text-white hover:text-brand-gold transition-colors">
            <HiShoppingCart className="w-6 h-6" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                {cartTotalCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle Mobile Menu"
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-nav flex flex-col items-center py-8 space-y-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-white text-lg tracking-widest hover:text-brand-gold"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-semibold mt-4"
            >
              Enquiry
            </a>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
