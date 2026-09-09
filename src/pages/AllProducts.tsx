import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { type Product } from '../data/products';
import { calculateDiscountedPrice } from '../utils/priceUtils';
import { Link } from 'react-router-dom';

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?page=${page}&limit=10`);
        const data = await res.json();
        
        if (isMounted) {
          if (Array.isArray(data)) {
            const mappedData = data.map((p: any) => ({ ...p, id: p._id }));
            
            if (page === 1) {
              setProducts(mappedData);
            } else {
              setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newProducts = mappedData.filter((p: any) => !existingIds.has(p.id));
                return [...prev, ...newProducts];
              });
            }
            
            setHasMore(data.length === 10);
          } else {
            console.error('API response is not an array:', data);
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setHasMore(false);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchProducts();
    
    return () => { isMounted = false; };
  }, [page]);

  const sections = Array.from(new Set([
    ...products.map(p => p.category)
  ]));

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-brand-dark min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 animate-pulse">
            <div className="h-12 bg-white/10 rounded w-64 mx-auto mb-6" />
            <div className="h-4 bg-white/10 rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={`all-skeleton-${idx}`} className="glass-card rounded-2xl overflow-hidden animate-pulse border border-white/5 h-[450px]">
                <div className="h-72 w-full bg-white/5" />
                <div className="p-8">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/5 rounded w-full mb-2" />
                  <div className="h-4 bg-white/5 rounded w-2/3 mb-6" />
                  <div className="flex justify-between border-t border-white/10 pt-6">
                    <div className="h-8 bg-white/10 rounded w-1/3" />
                    <div className="h-6 bg-white/10 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6 lg:gap-8">
                {categoryProducts.map((product, pIdx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: pIdx * 0.1 }}
                    className="glass-card rounded-lg md:rounded-xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-gold/30 transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(255,215,0,0.2)] flex flex-col h-full"
                  >
                    <div className="relative h-24 sm:h-32 md:h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                      {product.discount && (
                        <div className="absolute top-1 right-1 md:top-3 md:right-3 z-20 bg-brand-orange text-white text-[8px] md:text-[10px] font-black tracking-wider px-1.5 py-0.5 md:px-3 md:py-1 rounded-full shadow-[0_0_15px_rgba(255,107,0,0.5)]">
                          {product.discount}
                        </div>
                      )}
                    </div>
                    <div className="p-2 md:p-5 relative bg-brand-darker/50 backdrop-blur-md -mt-2 md:-mt-4 rounded-t-xl md:rounded-t-2xl z-20 flex flex-col justify-between flex-grow">
                      <Link to="/buyproducts" className="hidden md:flex absolute -top-5 right-5 w-10 h-10 bg-brand-darker rounded-full items-center justify-center border border-white/10 group-hover:bg-brand-gold group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-110">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-brand-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                      <h3 className="text-[10px] sm:text-xs md:text-lg font-bold text-white mb-1 md:mb-2 group-hover:text-brand-gold transition-colors leading-tight line-clamp-2">{product.name}</h3>
                      <p className="hidden md:block text-gray-400 text-[10px] md:text-xs mb-4 line-clamp-2 leading-relaxed">{product.desc}</p>
                      
                      <div className="flex flex-row justify-between items-center border-t border-white/5 pt-2 md:pt-4 mt-auto">
                        <div>
                          <p className="hidden md:block text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Price</p>
                          {product.discount ? (
                            <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-1.5">
                              <span className="text-xs sm:text-sm md:text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all leading-none">
                                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }} className="mr-0.5 md:mr-1">₹</span>{calculateDiscountedPrice(product.price, product.discount)}
                              </span>
                              <span className="text-[8px] md:text-xs text-gray-500 line-through mt-0.5 md:mt-0">
                                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }}>₹</span>{product.price.replace(/[^\d]/g, '')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs sm:text-sm md:text-xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all leading-none">
                              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 500 }} className="mr-0.5 md:mr-1">₹</span>{product.price.replace(/[^\d]/g, '')}
                            </span>
                          )}
                        </div>
                        <Link 
                          to="/buyproducts"
                          onClick={(e) => e.stopPropagation()} 
                          className="text-[9px] md:text-sm font-bold uppercase tracking-widest transition-colors flex items-center text-brand-orange hover:text-white group-hover:translate-x-1"
                        >
                          <span className="hidden md:inline">Buy Now</span>
                          <span className="md:hidden">BUY</span>
                          <svg className="w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
        
        {loadingMore && <div className="text-center text-white py-8 font-bold">Loading more products...</div>}
        <div ref={lastElementRef} style={{ height: '20px' }} />
      </div>
    </div>
  );
}
