import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Crop } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (crop: Crop, quantity_kg?: number) => void;
  updateQuantity: (cropId: number, quantity_kg: number) => void;
  removeFromCart: (cropId: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  totalWeightKg: number;
  subtotalAmount: number;
  deliveryFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY_CART = 'agriconnect_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart state', e);
    }
  }, [items]);

  const addToCart = (crop: Crop, quantity_kg?: number) => {
    const qty = quantity_kg && quantity_kg > 0 ? quantity_kg : crop.min_order_kg || 1;
    setItems(prev => {
      const existing = prev.find(i => i.crop.id === crop.id);
      if (existing) {
        return prev.map(i =>
          i.crop.id === crop.id
            ? { ...i, quantity_kg: Math.min(crop.stock_quantity_kg, i.quantity_kg + qty) }
            : i
        );
      }
      return [...prev, { crop, quantity_kg: Math.min(crop.stock_quantity_kg, qty) }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cropId: number, quantity_kg: number) => {
    if (quantity_kg <= 0) {
      removeFromCart(cropId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.crop.id === cropId
          ? { ...i, quantity_kg: Math.min(i.crop.stock_quantity_kg, quantity_kg) }
          : i
      )
    );
  };

  const removeFromCart = (cropId: number) => {
    setItems(prev => prev.filter(i => i.crop.id !== cropId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.length;
  const totalWeightKg = items.reduce((sum, item) => sum + item.quantity_kg, 0);
  const subtotalAmount = items.reduce(
    (sum, item) => sum + item.crop.price_per_kg * item.quantity_kg,
    0
  );
  // Free delivery for orders over ₹500
  const deliveryFee = subtotalAmount > 500 || subtotalAmount === 0 ? 0 : 40;
  const grandTotal = subtotalAmount + deliveryFee + (subtotalAmount > 0 ? 5 : 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        totalWeightKg,
        subtotalAmount,
        deliveryFee,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
