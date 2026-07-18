import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { type Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { calculateDiscountedPrice } from '../utils/priceUtils';

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedData = data.map((p: any) => ({ ...p, id: p._id }));
          mappedData.sort((a: any, b: any) => {
            const orderA = a.sortOrder && a.sortOrder > 0 ? a.sortOrder : 999999;
            const orderB = b.sortOrder && b.sortOrder > 0 ? b.sortOrder : 999999;
            return orderA - orderB;
          });
          setProducts(mappedData);
        } else {
          console.error('API response is not an array:', data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const sections = Array.from(new Set([
    ...products.map(p => p.category)
  ]));

  if (loading) {
    return <div className="min-h-screen pt-32 pb-20 text-center text-white">Loading products...</div>;
  }

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Our Complete <span className="text-gradient">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Browse through our premium, safe, and highly vibrant fireworks categorized for your convenience.
          </motion.p>
        </div>

        {sections.map((category) => {
          const categoryProducts = products.filter(p => p.category === category);
          
          if (categoryProducts.length === 0) return null; // Skip empty categories

          return (
            <div key={category} className="mb-24 last:mb-0">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">{category}</h2>
                <div className="flex-grow h-[1px] bg-gradient-to-r from-brand-gold/50 to-transparent ml-8" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProducts.map((product, pIdx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: pIdx * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-gold/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(255,215,0,0.2)]"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      {product.discount && (
                        <div className="absolute top-4 right-4 z-20 bg-brand-orange text-white text-xs font-black tracking-wider px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]">
                          {product.discount}
                        </div>
                      )}
                    </div>
                    <div className="p-8 relative bg-brand-darker/50 backdrop-blur-md -mt-4 rounded-t-3xl z-20">
                      <div className="absolute -top-6 right-8 w-12 h-12 bg-brand-darker rounded-full flex items-center justify-center border border-white/10 group-hover:bg-brand-gold group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">{product.desc}</p>
                      
                      <div className="flex justify-between items-end border-t border-white/5 pt-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Price</p>
                          {product.discount ? (
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all">
                                ₹{calculateDiscountedPrice(product.price, product.discount)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">{product.price}</span>
                            </div>
                          ) : (
                            <span className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all">{product.price}</span>
                          )}
                        </div>
                        <button 
                          onClick={() => !isInCart(product.id) && addToCart(product)} 
                          disabled={isInCart(product.id)}
                          className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center ${
                            isInCart(product.id) 
                              ? 'text-green-400 cursor-default' 
                              : 'text-brand-orange hover:text-white group-hover:translate-x-1'
                          }`}
                        >
                          {isInCart(product.id) ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Added
                            </>
                          ) : (
                            <>
                              Add to Cart
                              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
