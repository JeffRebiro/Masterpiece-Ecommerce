import React, { createContext, useState, useEffect, useMemo, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    let storedCart = [];
    try {
      storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.warn("Invalid cart data in localStorage");
    }
    setCartItems(Array.isArray(storedCart) ? storedCart : []);
    setCartLoading(false);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Compute total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const isHire =
        "hire_price_per_day" in item || "hire_price_per_hour" in item;

      if (isHire) {
        const duration = item.duration || 1;
        const durationType = item.durationType || "day";
        const rate =
          durationType === "hour"
            ? item.hire_price_per_hour || 0
            : item.hire_price_per_day || 0;
        return sum + duration * rate;
      } else {
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        return sum + price * quantity;
      }
    }, 0);
  }, [cartItems]);


  // Add or update cart item
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove a specific item
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalPrice,
      cartLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy consumption
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
