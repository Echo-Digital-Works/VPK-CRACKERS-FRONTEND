import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { type Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { calculateDiscountedPrice } from '../utils/priceUtils';
import { Link } from 'react-router-dom';

export default function BuyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { cartItems, setItemQuantity, cartTotalCount } = useCart();

  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, loadingMore, hasMore]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      if (page === 1) setIsLoading(true);
      else setLoadingMore(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?page=${page}&limit=20`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        if (isMounted) {
          if (Array.isArray(data)) {
            const formattedData = data.map((item: any) => ({
              ...item,
              id: item._id,
            }));
            
            if (page === 1) {
              setProducts(formattedData);
            } else {
              setProducts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newProducts = formattedData.filter((p: any) => !existingIds.has(p.id));
                return [...prev, ...newProducts];
              });
            }
            
            setHasMore(data.length === 20);
          } else {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setLoadingMore(false);
        }
      }
    };
    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [page]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Calculate totals
  const getProductQuantity = (productId: number) => {
    return cartItems.find(item => item.id === productId)?.quantity || 0;
  };

  const getProductAmount = (product: Product) => {
    const qty = getProductQuantity(product.id);
    if (qty === 0) return 0;
    const finalRate = calculateDiscountedPrice(product.price, product.discount);
    return finalRate * qty;
  };

  const grandTotal = products.reduce((sum, product) => sum + getProductAmount(product), 0);

  const getOriginalPrice = (priceStr: string) => parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;

  return (
    <div className="pt-28 pb-32 bg-brand-dark min-h-screen relative font-sans text-white overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-2 md:px-6 relative z-10">
        
        {/* Header Template */}
        <div className="text-center mb-8 border-b border-brand-gold/20 pb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-orange uppercase mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            VPK PREM CRACKERS
          </motion.h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Standard Fireworks, Sivakasi, Tamil Nadu 626 123<br />
            E-mail: contact@vpkcrackers.com &nbsp;&nbsp;|&nbsp;&nbsp; Phone: +91 99999 00000
          </p>
        </div>

        <div className="text-center mb-10 bg-brand-gold/10 py-3 rounded-lg border border-brand-gold/30">
          <h2 className="text-2xl font-bold tracking-widest text-brand-gold uppercase" style={{ fontFamily: 'Georgia, serif' }}>
            PRICE LIST
          </h2>
        </div>

        {/* Table Container */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
              <thead>
                <tr className="bg-brand-darker text-gray-300 font-bold border-b border-white/20 uppercase tracking-wider text-[10px] md:text-xs">
                  <th className="p-3 md:p-4 text-center w-16">S.No</th>
                  <th className="p-3 md:p-4 min-w-[200px]">Product Name</th>
                  <th className="p-3 md:p-4 text-center">Content</th>
                  <th className="p-3 md:p-4 text-right">Rate / Qty</th>
                  <th className="p-3 md:p-4 text-right">Discount</th>
                  <th className="p-3 md:p-4 text-right">Final Rate</th>
                  <th className="p-3 md:p-4 text-center min-w-[120px]">Quantity</th>
                  <th className="p-3 md:p-4 text-right min-w-[100px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-brand-gold animate-pulse">Loading Products...</td>
                  </tr>
                ) : (
                  categories.map((category, catIdx) => {
                    const catProducts = products.filter(p => p.category === category);
                    if (catProducts.length === 0) return null;

                    const isLastCategory = catIdx === categories.length - 1;

                    return (
                      <React.Fragment key={category}>
                        {/* Category Header Row */}
                        <tr className="bg-gradient-to-r from-brand-gold/20 to-brand-orange/20 border-y border-brand-gold/30">
                          <td colSpan={8} className="p-3 text-center font-bold text-brand-gold uppercase tracking-widest text-xs md:text-sm">
                            {category}
                          </td>
                        </tr>
                        
                        {/* Products under Category */}
                        {catProducts.map((product, idx) => {
                          const isLastProduct = isLastCategory && idx === catProducts.length - 1;
                          const originalPrice = getOriginalPrice(product.price);
                          const finalPrice = calculateDiscountedPrice(product.price, product.discount);
                          const discountAmount = originalPrice - finalPrice;
                          const quantity = getProductQuantity(product.id);
                          const amount = finalPrice * quantity;

                          return (
                            <tr 
                              key={product.id} 
                              ref={isLastProduct ? lastElementRef : null}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                            >
                              <td className="p-3 text-center text-gray-400">{idx + 1}</td>
                              <td className="p-3 flex items-center gap-3">
                                <img src={product.img} alt={product.name} className="w-10 h-10 object-cover rounded-md border border-white/10" />
                                <span className="font-semibold text-white group-hover:text-brand-gold transition-colors">{product.name}</span>
                              </td>
                              <td className="p-3 text-center text-gray-400 text-xs">
                                {product.desc || '1 Box'}
                              </td>
                              <td className="p-3 text-right text-gray-400">
                                {originalPrice.toFixed(2)}
                              </td>
                              <td className="p-3 text-right text-brand-orange/80">
                                {discountAmount > 0 ? discountAmount.toFixed(2) : '-'}
                              </td>
                              <td className="p-3 text-right font-bold text-white">
                                {finalPrice.toFixed(2)}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2 bg-brand-darker rounded-full border border-white/10 p-1 w-max mx-auto">
                                  <button 
                                    onClick={() => setItemQuantity(product, quantity - 1)}
                                    className="w-6 h-6 rounded-full bg-white/5 hover:bg-brand-orange hover:text-white flex items-center justify-center text-gray-400 transition-colors"
                                  >
                                    -
                                  </button>
                                  <input 
                                    type="number"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      setItemQuantity(product, val);
                                    }}
                                    className="w-10 bg-transparent text-center text-white font-bold outline-none no-spinners"
                                  />
                                  <button 
                                    onClick={() => setItemQuantity(product, quantity + 1)}
                                    className="w-6 h-6 rounded-full bg-white/5 hover:bg-brand-gold hover:text-brand-dark flex items-center justify-center text-gray-400 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-right font-black text-brand-gold">
                                {amount > 0 ? amount.toFixed(2) : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                )}
                {loadingMore && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-brand-gold animate-pulse text-xs">
                      Loading more products...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Checkout */}
      {cartTotalCount > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-darker border-t border-brand-gold/30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="container mx-auto px-2 md:px-6 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mb-1">Total Items: <span className="text-white font-bold">{cartTotalCount}</span></p>
              <p className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-orange">
                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} className="mr-1">₹</span>{grandTotal.toFixed(2)}
              </p>
            </div>
            <Link 
              to="/cart"
              className="bg-gradient-to-r from-brand-gold to-brand-orange text-brand-dark font-black px-6 py-3 md:px-12 md:py-4 rounded-full uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:scale-105 transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              View Cart / Submit Enquiry
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      )}

      <style>{`
        /* Hide number input spinners */
        .no-spinners::-webkit-outer-spin-button,
        .no-spinners::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinners {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
