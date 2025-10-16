"use client";
import React from 'react';
import { useCart } from './CartContext';
import TrashIcon from '../ui/TrashIcon';
import CloseIcon from '../ui/CloseIcon';

export default function CartWidget({ onCheckout, onClose }) {
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-64 md:w-80 min-w-64 h-full bg-black shadow-lg flex flex-col items-start p-2 gap-2 z-50 backdrop-blur-lg">
        {/* Header with close button */}
        <div className="w-full flex justify-between items-start">
          <h2 className="text-xl font-bold text-white">Cart</h2>
          
          {/* Close button */}
          <button
            className="hover:opacity-75 transition-opacity"
            onClick={onClose}
            aria-label="Close cart"
          >
            <CloseIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        
        <div className="w-full">
          <div className="flex items-center space-x-2">
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
                Continue shopping
              </a>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="flex items-center gap-3 pb-2 border-b border-white/50">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-gray-300 text-sm">${(item.price / 100).toFixed(2)}</div>
                  <div className="flex items-center">
                    <button
                      className="px-2 bg-white text-black text-sm hover:opacity-75 transition-opacity"
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    >
                      -
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      className="px-2 bg-white text-black text-sm hover:opacity-75 transition-opacity"
                      onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 text-red-400 hover:text-red-300 transition-colors p-1"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                      aria-label="Remove item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="w-full border-t border-white/50 pt-2">
          <div className="flex justify-between items-center mb-2">
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