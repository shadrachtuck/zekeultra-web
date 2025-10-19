"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../store/CartContext';
import CartWidget from '../store/CartWidget';
import HamburgerMenu from '../ui/HamburgerMenu';
import CloseIcon from '../ui/CloseIcon';

const navLinks = [
  { href: '#store', label: 'Store' },
];

export default function HeaderClient({ siteName }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    console.log('iOS Debug - Cart checkout button clicked, using router.push instead of window.location.href');
    setIsCartOpen(false); // Close cart drawer first
    router.push('/checkout'); // Use Next.js router to avoid page reload
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <header className="bg-transparent py-2 px-2 fixed top-0 left-0 right-0 z-40 flex justify-between items-center">
        <a 
          href="/" 
          className="font-brigends font-bold text-black hover:opacity-75 transition-opacity cursor-pointer leading-none header-logo"
        >
          {siteName || 'ZEKEULTRA'}
        </a>
        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={handleCartToggle}
            className={`relative hover:opacity-75 transition-all duration-300 mix-blend-difference ${isCartOpen ? 'transform translate-x-[10px]' : ''}`}
          >
            {!isCartOpen ? (            
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="0.17rem" strokeLinecap="butt" strokeLinejoin="miter"><path d="M6 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 18h-13v-16h-2"></path><path d="M7 3l18 2l-4 10h-14"></path></svg>

            ) : (
              <CloseIcon className="w-6 h-6 text-white" />
            )}
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-none h-4 w-4 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          {navLinks.length > 1 && (
          <div className="mix-blend-difference">
            <HamburgerMenu navLinks={navLinks} />
          </div>
          )}
        </div>
      </header>
      {isCartOpen && (
        <CartWidget onCheckout={handleCheckout} onClose={handleCloseCart} />
      )}
    </>
  );
} 