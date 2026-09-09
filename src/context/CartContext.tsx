import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setItemQuantity: (product: Product, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  cartTotalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev; // We just do 1 quantity per product for now if they click add again, or we can just let it add. Let's just say it's in the cart.
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const setItemQuantity = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product.id);
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (productId: number) => cartItems.some(item => item.id === productId);

  const cartTotalCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      setItemQuantity,
      clearCart,
      isInCart,
      cartTotalCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
