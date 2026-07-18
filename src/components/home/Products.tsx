import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { type Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { calculateDiscountedPrice } from '../../utils/priceUtils';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

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
      .catch(err => console.error(err));
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
            className="grid grid-cols-5 md:flex md:flex-wrap justify-center items-stretch gap-1.5 md:gap-4 mt-8 md:mt-12 px-1 md:px-0 w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {Array.from(new Set(['All', ...products.map(p => p.category)])).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-center text-center px-1 py-2 md:px-8 md:py-3 rounded-xl md:rounded-full text-[9px] sm:text-[10px] md:text-sm font-bold tracking-tighter md:tracking-wider uppercase transition-all duration-300 leading-[1.1] md:leading-normal ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark shadow-[0_0_10px_rgba(255,107,0,0.5)] md:shadow-[0_0_20px_rgba(255,107,0,0.5)] transform md:scale-105' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredProducts.slice(0, 6).map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, type: "spring" }}
                key={product.id}
                onClick={() => navigate('/products')}
                className="glass-card rounded-3xl overflow-hidden group cursor-pointer border border-white/5 hover:border-brand-orange/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,107,0,0.15)] relative"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-[50px] rounded-full group-hover:bg-brand-orange/40 transition-colors duration-500 pointer-events-none" />

                <div className="relative h-72 overflow-hidden p-2">
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity z-10" />
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    {product.discount && (
                      <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider">
                        {product.discount}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-8 relative z-20">
                  <div className="absolute -top-8 right-8 w-14 h-14 bg-brand-dark rounded-full flex items-center justify-center border-[4px] border-brand-dark group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all duration-500 shadow-xl group-hover:shadow-[0_0_15px_rgba(255,107,0,0.5)] transform group-hover:rotate-90">
                    <span className="text-white text-2xl group-hover:text-brand-dark" aria-label="Add to cart">+</span>
                  </div>
                  
                  <div className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">{product.category}</div>
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-gold group-hover:to-brand-orange transition-all">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-light">{product.desc}</p>
                  
                  <div className="flex justify-between items-end border-t border-white/10 pt-6">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Price</div>
                      {product.discount ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white">₹{calculateDiscountedPrice(product.price, product.discount)}</span>
                          <span className="text-sm text-gray-500 line-through">{product.price}</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-black text-white">{product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInCart(product.id)) addToCart(product);
                      }} 
                      disabled={isInCart(product.id)}
                      className={`text-sm uppercase tracking-widest font-bold transition-all pb-1 border-b-2 flex items-center ${
                        isInCart(product.id) 
                          ? 'text-green-400 border-green-400 cursor-default' 
                          : 'text-brand-gold hover:text-white border-brand-gold hover:border-white'
                      }`}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Added
                        </>
                      ) : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
