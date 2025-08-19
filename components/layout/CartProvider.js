"use client";
import React from 'react';
import { CartProvider as CartContextProvider } from '../store/CartContext';

export default function CartProvider({ children }) {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  );
} 