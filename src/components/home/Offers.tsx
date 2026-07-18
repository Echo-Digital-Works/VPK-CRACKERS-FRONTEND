import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import EnquiryModal from '../ui/EnquiryModal';

export default function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers?activeOnly=true`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOffers(data);
        } else {
          console.error('API response for offers is not an array:', data);
          setOffers([]);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleClaimOffer = (offer: any) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return null; // or a loading skeleton
  }

  if (offers.length === 0) {
    return null; // Hide section if no active offers
  }

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-3"
          >
            <div className="w-8 h-[2px] bg-brand-orange" />
            <h4 className="text-brand-orange tracking-[0.2em] uppercase text-xs font-bold">Exclusive Deals</h4>
            <div className="w-8 h-[2px] bg-brand-orange" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white"
          >
            Special <span className="text-gradient">Offers</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="relative overflow-hidden glass-card rounded-2xl border border-white/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden w-full">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/40 to-transparent" />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r ${offer.gradient} text-white font-bold text-xs shadow-lg`}>
                  {offer.discount}
                </div>
              </div>

              {/* Top color bar */}
              <div className={`absolute top-0 left-0 w-full h-1 z-20 bg-gradient-to-r ${offer.gradient}`} />
              
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none`} />
              
              <div className="relative z-10 p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{offer.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                    {offer.description}
                  </p>
                  
                  {offer.products && offer.products.length > 0 && (
                    <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-white mb-4">
                      ✓ Includes {offer.products.length} Products
                    </div>
                  )}

                  {offer.price && (
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm line-through">M.R.P: {offer.price}</span>
                        <span className="text-2xl font-bold text-white">
                          {offer.discountPrice}
                        </span>
                      </div>
                      <div className="bg-brand-orange/20 text-brand-orange px-2 py-1 rounded text-xs font-bold border border-brand-orange/30">
                        {offer.discount}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleClaimOffer(offer)}
                    className="w-full py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20"
                  >
                  Claim Offer 
                  <span className="text-lg text-brand-orange">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedOffer && (
        <EnquiryModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setTimeout(() => setSelectedOffer(null), 300);
          }} 
          cartItems={selectedOffer.products && selectedOffer.products.length > 0 
            ? selectedOffer.products.map((p: any, index: number) => ({
                id: index + 1000, // fake ID for cart item
                name: p.name,
                category: p.category,
                price: p.price.toString(),
                discount: '', // product row doesn't have individual discount in UI
                quantity: p.quantity,
                img: selectedOffer.image,
                desc: ''
              }))
            : [{
                id: selectedOffer._id,
                name: selectedOffer.title,
                category: 'Offer',
                price: selectedOffer.price || '0', 
                discount: selectedOffer.discount,
                quantity: 1,
                img: selectedOffer.image,
                desc: selectedOffer.description
              }]
          }
          enquiryType="offer"
          overrideTotal={parseInt(selectedOffer.discountPrice.replace(/[^\d]/g, ''), 10) || 0}
        />
      )}
    </section>
  );
}
