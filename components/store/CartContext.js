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

// Helper function to create a unique cart item key
const getCartItemKey = (item) => {
  return item.variant ? `${item.id}-${item.variant}` : item.id;
};

function cartReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      // Use composite key for items with variants
      const itemKey = getCartItemKey(action.item);
      const existing = state.items.find(item => getCartItemKey(item) === itemKey);
      
      if (existing) {
        newState = {
          ...state,
          items: state.items.map(item =>
            getCartItemKey(item) === itemKey
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
      // Support both id and cartItemKey for removal
      const removeKey = action.cartItemKey || action.id;
      newState = {
        ...state,
        items: state.items.filter(item => getCartItemKey(item) !== removeKey),
      };
      break;
    }
    case 'UPDATE_QUANTITY': {
      // Support both id and cartItemKey for quantity updates
      const updateKey = action.cartItemKey || action.id;
      newState = {
        ...state,
        items: state.items.map(item =>
          getCartItemKey(item) === updateKey ? { ...item, quantity: action.quantity } : item
        ),
      };
      break;
    }
    case 'CLEAR_CART': {
      console.log('iOS Debug - CLEAR_CART action dispatched, clearing cart');
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

// Export helper function for use in components
export { getCartItemKey }; 