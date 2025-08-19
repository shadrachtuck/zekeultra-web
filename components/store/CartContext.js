"use client";
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

// Load cart from localStorage on initial render
const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('zekeultra-cart');
      return savedCart ? JSON.parse(savedCart) : { items: [] };
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return { items: [] };
    }
  }
  return { items: [] };
};

const initialState = { items: [] };

function cartReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.item.id);
      if (existing) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.item, quantity: 1 }],
        };
      }
      break;
    }
    case 'REMOVE_ITEM': {
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
      break;
    }
    case 'UPDATE_QUANTITY': {
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        ),
      };
      break;
    }
    case 'CLEAR_CART': {
      newState = { items: [] };
      break;
    }
    case 'RESTORE_CART': {
      newState = { items: action.items };
      break;
    }
    default:
      return state;
  }
  
  // Save to localStorage whenever cart changes
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('zekeultra-cart', JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
  
  return newState;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isClient, setIsClient] = useState(false);
  
  // Only load from localStorage after client-side hydration
  useEffect(() => {
    setIsClient(true);
    const savedCart = loadCartFromStorage();
    if (savedCart.items.length > 0) {
      dispatch({ type: 'RESTORE_CART', items: savedCart.items });
    }
  }, []);
  
  return (
    <CartContext.Provider value={{ cart: state, dispatch, isClient }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 