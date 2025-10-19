"use client";
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

// Safe localStorage check for iOS Safari
const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.log('iOS Debug - localStorage not available (Private Browsing or Cross-Site Tracking Prevention)');
    return false;
  }
};

// Load cart from localStorage on initial render
const loadCartFromStorage = () => {
  if (isLocalStorageAvailable()) {
    try {
      const savedCart = localStorage.getItem('zekeultra-cart');
      console.log('iOS Debug - Cart loaded from localStorage:', savedCart ? 'found' : 'empty');
      return savedCart ? JSON.parse(savedCart) : { items: [] };
    } catch (error) {
      console.log('iOS Debug - Error parsing cart from localStorage:', error);
      return { items: [] };
    }
  }
  console.log('iOS Debug - localStorage not available, using in-memory cart');
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
      console.log('iOS Debug - ADD_ITEM:', { 
        itemKey, 
        existing: !!existing, 
        beforeCount: state.items.length, 
        afterCount: newState.items.length,
        itemName: action.item.name 
      });
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
      console.log('iOS Debug - RESTORE_CART:', { 
        beforeCount: state.items.length, 
        afterCount: newState.items.length,
        restoredItems: action.items.length 
      });
      break;
    }
    default:
      return state;
  }
  
  // Save to localStorage whenever cart changes (if available)
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem('zekeultra-cart', JSON.stringify(newState));
      console.log('iOS Debug - Cart saved to localStorage, items:', newState.items.length);
    } catch (error) {
      console.log('iOS Debug - Error saving cart to localStorage:', error);
      // Cart will work in-memory even if localStorage fails
    }
  } else {
    console.log('iOS Debug - localStorage not available, cart will be in-memory only (items:', newState.items.length, ')');
  }
  
  return newState;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isClient, setIsClient] = useState(false);
  
  // Only load from localStorage after client-side hydration
  useEffect(() => {
    console.log('iOS Debug - CartProvider useEffect running');
    setIsClient(true);
    const savedCart = loadCartFromStorage();
    console.log('iOS Debug - CartProvider initialization:', { 
      savedCartItems: savedCart.items.length,
      willRestore: savedCart.items.length > 0 
    });
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