import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CartItem, useCart } from '../../context/CartContext';
import { calculateDiscountedPrice } from '../../utils/priceUtils';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  enquiryType?: 'product' | 'offer';
  overrideTotal?: number;
}

export default function EnquiryModal({ isOpen, onClose, cartItems, enquiryType = 'product', overrideTotal }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    place: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { clearCart } = useCart();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const enquiryMessage = formData.message || 'No additional message provided.';

    const formattedCartItems = cartItems.map(item => {
      const finalPrice = calculateDiscountedPrice(item.price, item.discount);
      return {
        name: item.name,
        price: `₹${finalPrice}`,
        quantity: item.quantity,
        total: finalPrice * item.quantity
      };
    });
    
    const calculatedTotal = formattedCartItems.reduce((acc, curr) => acc + curr.total, 0);
    const cartTotal = overrideTotal !== undefined ? overrideTotal : calculatedTotal;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ...formData, 
          message: enquiryMessage, 
          type: enquiryType,
          cartItems: formattedCartItems,
          cartTotal
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        window.dispatchEvent(new CustomEvent('launchRocket'));
        
        let text = `*New ${enquiryType === 'product' ? 'Order' : 'Offer'} Enquiry*\n`;
        text += `Name: ${formData.name}\nPhone: ${formData.phone}\nPlace: ${formData.place}\n\n`;
        if (enquiryType === 'product' && formattedCartItems.length > 0) {
          text += `*Order Details:*\n`;
          formattedCartItems.forEach(item => {
            text += `- ${item.name} x${item.quantity} (${item.price})\n`;
          });
          text += `\n*Total Estimate: ₹${cartTotal}*\n\n`;
        }
        text += `Message: ${enquiryMessage}`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/919003371335?text=${encodedText}`, '_blank');

        setFormData({ name: '', phone: '', email: '', place: '', message: '' });
        clearCart();
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 3000);
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-brand-darker border border-white/10 shadow-2xl rounded-2xl z-[101] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h3 className="text-2xl font-bold text-white">{enquiryType === 'offer' ? 'Offer Enquiry' : 'Product Enquiry'}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-brand-orange transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cartItems.length > 0 && (
                <div className="mb-6 flex flex-col bg-white/5 p-4 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                  <h4 className="text-white font-semibold mb-2">
                    {enquiryType === 'offer' ? 'Combo Details:' : `Enquiring about ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`}
                  </h4>
                  <div className="text-sm text-gray-400 space-y-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between border-b border-white/5 pb-1 last:border-0 last:pb-0">
                        <span className="pr-4">{item.name} <span className="text-gray-500">x {item.quantity}</span></span>
                        <span className="text-brand-gold whitespace-nowrap">₹{calculateDiscountedPrice(item.price, item.discount)}</span>
                      </div>
                    ))}
                    {overrideTotal !== undefined ? (
                      <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                        <div className="flex justify-between text-gray-400">
                          <span>Original Total</span>
                          <span className="line-through">₹{cartItems.reduce((acc, curr) => acc + (parseInt(curr.price.replace(/[^\d]/g, ''), 10) || 0) * curr.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-lg">
                          <span>Offer Price</span>
                          <span className="text-brand-gold">₹{overrideTotal}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between font-bold text-white mt-2 pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span className="text-brand-gold">₹{cartItems.reduce((acc, curr) => acc + calculateDiscountedPrice(curr.price, curr.discount) * curr.quantity, 0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {submitStatus === 'success' ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h4>
                  <p className="text-gray-400">Thank you! We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors" placeholder="Name" />
                    </div>
                    <div className="relative group">
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors" placeholder="Mobile Number" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors" placeholder="Email ID (Optional)" />
                    </div>
                    <div className="relative group">
                      <input type="text" name="place" required value={formData.place} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors" placeholder="Place / City" />
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors resize-none" placeholder="Message or specific requirements (Optional)..." />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                      Failed to send enquiry. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      isSubmitting ? 'bg-gray-600 text-gray-300' : 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
