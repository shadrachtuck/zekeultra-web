"use client";
import React from 'react';
import { useCart } from './CartContext';

export default function CartWidget({ onCheckout, onClose }) {
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-64 min-w-64 h-full bg-black shadow-lg flex flex-col items-start p-6 gap-6 z-50 backdrop-blur-lg">
        {/* Close button in top right corner */}
        <button
          className="z-50 absolute top-7 right-4 hover:opacity-75 transition-opacity"
          onClick={onClose}
          aria-label="Close cart"
        >
          <div className="relative flex flex-col gap-[0.2rem] mb-[4px]">
            <span 
              className="block w-[1.5em] h-[0.2rem] transition-all duration-300 bg-white" 
              style={{ transform: 'rotate(45deg) translateY(9px)' }} 
            />
            <span className="block w-[1.5em] h-[0.2rem] transition-all duration-300 opacity-0 bg-white" />
            <span 
              className="block w-[1.5em] h-[0.2rem] transition-all duration-300 bg-white" 
              style={{ transform: 'rotate(-45deg) translateY(-9px)' }} 
            />
          </div>
        </button>
        
        <div className="w-full">
          <h2 className="text-xl font-bold text-white mb-6">Cart</h2>
          
          <div className="flex items-center space-x-2 mb-4">
            <button
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Your cart is empty.</p>
              <a
                href="/#store"
                className="text-white hover:opacity-75 transition-opacity text-sm underline"
                onClick={onClose}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-white/50">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-gray-300 text-sm">${(item.price / 100).toFixed(2)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 bg-white text-black text-sm hover:opacity-75 transition-opacity"
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    >
                      -
                    </button>
                    <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      className="px-2 bg-white text-black text-sm hover:opacity-75 transition-opacity"
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 text-red-400 hover:text-red-300 text-sm transition-colors"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="w-full border-t border-white/50 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-white">Total:</span>
            <span className="text-lg font-bold text-white">${(total / 100).toFixed(2)}</span>
          </div>
          <button
            className="w-full py-3 bg-white text-black font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.items.length === 0}
            onClick={onCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
} 