"use client";
import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import CartWidget from '../store/CartWidget';
import HamburgerMenu from '../ui/HamburgerMenu';

const navLinks = [
  { href: '#store', label: 'Store' },
];

export default function HeaderClient({ siteName }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <header className="bg-transparent p-2 fixed top-0 left-0 right-0 z-40 flex justify-between items-center">
        <a 
          href="/" 
          className="font-brigends font-bold text-black hover:opacity-75 transition-opacity cursor-pointer leading-none mix-blend-difference header-logo"
        >
          {siteName || 'ZEKEULTRA'}
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCartToggle}
            className={`relative hover:opacity-75 transition-all duration-300 mix-blend-difference ${isCartOpen ? 'transform translate-x-[10px]' : ''}`}
          >
            {!isCartOpen ? (            
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="0.2rem" strokeLinecap="butt" strokeLinejoin="miter"><path d="M6 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 18h-13v-16h-2"></path><path d="M7 3l18 2l-4 10h-14"></path></svg>

            ) : (
              // X icon (white when open) - same as hamburger menu
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
              
            )}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-none h-5 w-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <div className="mix-blend-difference">
            <HamburgerMenu navLinks={navLinks} />
          </div>
        </div>
      </header>
      {isCartOpen && (
        <CartWidget onCheckout={handleCheckout} onClose={handleCloseCart} />
      )}
    </>
  );
} 