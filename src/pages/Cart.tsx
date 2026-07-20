import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EnquiryModal from '../components/ui/EnquiryModal';
import { calculateDiscountedPrice } from '../utils/priceUtils';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotalCount } = useCart();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartTotalValue = cartItems.reduce((total, item) => {
    return total + calculateDiscountedPrice(item.price, item.discount) * item.quantity;
  }, 0);

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Your <span className="text-gradient">Selection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mt-4 text-lg"
          >
            Review the items you've added to your cart before sending an enquiry.
          </motion.p>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-3xl"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your enquiry list yet. Explore our collection to find what you need.</p>
            <Link to="/products" className="inline-flex px-8 py-3 rounded-full bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-bold hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all">
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-white/5 hover:border-brand-gold/20 transition-colors"
                >
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    {item.discount && (
                      <div className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.discount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow w-full text-center sm:text-left">
                    <div className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-1">{item.category}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      {item.discount ? (
                        <>
                          <p className="text-brand-gold font-bold text-xl">₹{calculateDiscountedPrice(item.price, item.discount)}</p>
                          <p className="text-gray-500 line-through text-sm">{item.price}</p>
                        </>
                      ) : (
                        <p className="text-brand-gold font-bold text-xl">{item.price}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-white font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-transparent"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 sticky top-32 border border-white/10"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Enquiry Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Total Items</span>
                    <span className="text-white font-bold">{cartTotalCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Estimated Total</span>
                    <span className="text-brand-gold font-bold text-xl">₹{cartTotalValue}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * The actual total may vary based on bulk discounts and current stock. Submit the enquiry to get a final quote.
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-4 rounded-xl font-bold transition-all bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center justify-center space-x-2"
                >
                  <span>Submit Enquiry</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Link to="/products" className="text-brand-orange hover:text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center transition-colors group">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Browsing
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <EnquiryModal 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setIsEnquiryModalOpen(false)} 
        cartItems={cartItems}
      />
    </div>
  );
}
