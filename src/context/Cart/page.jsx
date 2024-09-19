"use client";

// import { createContext, useState, useContext } from "react";

// const CartContext = createContext();

// export function useCartState() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }) {
//   const [cartState, setCartState] = useState(0);
//   return (
//     <CartContext.Provider value={{ cartState, setCartState }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Cart Context
const CartContext = createContext();

// Custom Hook to use the Cart Context
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add an item to the cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.title,
            price: Math.ceil(product.price * 1500),
            image: product.images[0],
            quantity: 1,
          },
        ];
      }
    });

    setCartCount(count);
  };

  // Remove a specific item from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );

    setCartCount(count);
  };

  // Clear all items from the cart
  // const clearCart = () => {
  //   setCartItems([]);

  //   setCartCount(count);
  // };

  // Update the cart count whenever the cartItems array changes
  // useEffect(() => {
  // const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  // setCartCount(count);
  // }, [cartItems]);

  // Provide the cart state and actions to children
  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
