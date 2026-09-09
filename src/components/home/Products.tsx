import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type Product } from '../../data/products';
import { calculateDiscountedPrice } from '../../utils/priceUtils';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mappedData = data.map((p: any) => ({ ...p, id: p._id }));
          mappedData.sort((a: any, b: any) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            
            const orderA = Number(a.sortOrder) || 999999;
            const orderB = Number(b.sortOrder) || 999999;
            return orderA - orderB;
          });
          setProducts(mappedData);
        } else {
          console.error('API response is not an array:', data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-brand-dark relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent to-brand-gold" />
            <h4 className="text-brand-gold tracking-[0.2em] uppercase text-xs font-bold">Premium Collection</h4>
            <div className="w-12 h-[2px] bg-gradient-to-l from-transparent to-brand-gold" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-xl"
          >
            Explore Our <span className="text-gradient">Products</span>
          </motion.h2>
          
          {/* Categories */}
          <motion.div 
            className="flex flex-wrap justify-center items-stretch gap-2 md:gap-4 mt-8 md:mt-12 px-2 md:px-0 w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <div key={`cat-skeleton-${idx}`} className="h-8 md:h-12 w-20 md:w-32 bg-white/10 rounded-xl md:rounded-full animate-pulse border border-white/5" />
              ))
            ) : (
              Array.from(new Set(['All', ...products.map(p => p.category)])).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-center text-center px-3 py-2 md:px-8 md:py-3 rounded-xl md:rounded-full text-[10px] md:text-sm font-bold tracking-tighter md:tracking-wider uppercase transition-all duration-300 leading-tight md:leading-normal ${
                    activeCategory === cat 
                      ? 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark shadow-[0_0_10px_rgba(255,107,0,0.5)] md:shadow-[0_0_20px_rgba(255,107,0,0.5)] transform md:scale-105' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              ))
            )}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6 lg:gap-8">
          <AnimatePresence>
            {isLoading ? (
              [...Array(8)].map((_, idx) => (
                <div key={`skeleton-${idx}`} className="glass-card rounded-xl md:rounded-2xl overflow-hidden animate-pulse border border-white/5 h-[150px] md:h-auto">
                  <div className="h-24 md:h-48 bg-white/5" />
                  <div className="p-2 md:p-5">
                    <div className="h-2 md:h-3 bg-white/10 rounded w-1/4 mb-2 md:mb-3" />
                    <div className="h-3 md:h-5 bg-white/10 rounded w-3/4 mb-2 md:mb-3" />
                    <div className="hidden md:block h-3 bg-white/5 rounded w-full mb-2" />
                    <div className="hidden md:block h-3 bg-white/5 rounded w-2/3 mb-4" />
                    <div className="flex justify-between border-t border-white/10 pt-2 md:pt-4 mt-4 md:mt-2">
                      <div className="h-4 md:h-6 bg-white/10 rounded w-1/3" />
                      <div className="h-3 md:h-5 bg-white/10 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredProducts.slice(0, 8).map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring" }}
                key={product.id}
                className="glass-card rounded-xl md:rounded-2xl overflow-hidden group border border-white/5 hover:border-brand-orange/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,107,0,0.15)] relative flex flex-col h-full"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-[50px] rounded-full group-hover:bg-brand-orange/40 transition-colors duration-500 pointer-events-none" />
                
                <Link to="/products" className="relative h-24 md:h-48 overflow-hidden p-1 md:p-2 block shrink-0">
                  <div className="w-full h-full rounded-lg md:rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity z-10" />
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    {product.discount && (
                      <div className="absolute top-1 right-1 md:top-3 md:right-3 z-20 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg tracking-wider">
                        {product.discount}
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-2 md:p-5 relative z-20 flex flex-col flex-grow">
                  <Link to="/buyproducts" className="hidden md:flex absolute -top-5 right-5 w-10 h-10 bg-brand-dark rounded-full items-center justify-center border-[2px] border-brand-dark group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all duration-500 shadow-xl group-hover:shadow-[0_0_15px_rgba(255,107,0,0.5)] transform group-hover:translate-x-1">
                    <svg className="w-4 h-4 text-white group-hover:text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  
                  <div className="text-brand-orange text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-1 md:mb-1.5 truncate">{product.category}</div>
                  <Link to="/products"><h3 className="text-[10px] md:text-lg font-black text-white mb-1 md:mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all leading-tight line-clamp-2">{product.name}</h3></Link>
                  <p className="hidden md:block text-gray-400 text-[10px] md:text-xs mb-3 line-clamp-2 font-light">{product.desc}</p>
                  
                  <div className="flex flex-row justify-between items-center border-t border-white/10 pt-2 md:pt-4 mt-auto">
                    <div>
                      <div className="hidden md:block text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Price</div>
                      {product.discount ? (
                        <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-1.5">
                          <span className="text-xs md:text-xl font-black text-white leading-none">
                            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }} className="mr-0.5 md:mr-1">₹</span>{calculateDiscountedPrice(product.price, product.discount)}
                          </span>
                          <span className="text-[8px] md:text-xs text-gray-500 line-through mt-0.5 md:mt-0">
                            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }} className="mr-0.5">₹</span>{product.price.replace(/[^\d]/g, '')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs md:text-xl font-black text-white leading-none">
                          <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }} className="mr-0.5 md:mr-1">₹</span>{product.price.replace(/[^\d]/g, '')}
                        </span>
                      )}
                    </div>
                    <Link 
                      to="/buyproducts"
                      onClick={(e) => e.stopPropagation()} 
                      className="text-[9px] md:text-sm uppercase tracking-widest font-bold transition-all md:pb-1 md:border-b-2 flex items-center self-end md:self-auto text-brand-gold hover:text-white md:border-brand-gold md:hover:border-white"
                    >
                      <span className="hidden md:inline">Buy Now</span>
                      <span className="md:hidden">BUY</span>
                      <svg className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-20 text-center relative z-20">
          <Link to="/products" className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-dark font-bold transition-all duration-300 tracking-widest uppercase text-sm group">
            View All Products
            <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
