"use client";
import { useState } from 'react';
import { useCart } from '../../components/store/CartContext';
import { formatPrice } from '../../lib/stripe';
import CheckoutForm from '../../components/ui/CheckoutForm';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import CloseIcon from '../../components/ui/CloseIcon';

export default function CheckoutPage() {
  const [orderComplete, setOrderComplete] = useState(false);
  const { cart, dispatch } = useCart();
  
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 500; // $5.00 shipping
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    setOrderComplete(true);
    // Clear the cart after successful payment
    dispatch({ type: 'CLEAR_CART' });
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Handle payment error (show toast, etc.)
  };

  const handleStartOver = () => {
    dispatch({ type: 'CLEAR_CART' });
    window.location.href = '/';
  };

  if (cart.items.length === 0 && !orderComplete) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-20 px-2">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-8 pb-4">Checkout</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your cart is empty. Please add some items to your cart before checkout.
            </p>
            <a
              href="/store"
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto py-20 px-2">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-8 pb-4">Order Complete!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your purchase! You will receive a confirmation email shortly.
            </p>
            <a
              href="/store"
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-20 px-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold pb-4">Checkout</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartOver}
                className="text-black hover:text-gray-600 transition-colors font-medium"
              >
                Start Over
              </button>
              <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity">
                <CloseIcon className="w-8 h-8" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-white/20">
                    <div className="flex items-start gap-4 flex-1">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-black">{item.name}</div>
                        <div className="text-gray-300 text-sm mb-2">${(item.price / 100).toFixed(2)}</div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          >
                            -
                          </button>
                          <span className="text-black text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
                          >
                            +
                          </button>
                          <button
                            className="ml-2 text-red-500 hover:text-red-400 text-sm transition-colors"
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-black font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-white/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal:</span>
                  <span className="text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping:</span>
                  <span className="text-black">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2">
                  <span className="text-black">Total:</span>
                  <span className="text-black">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
              <CheckoutForm 
                amount={total} 
                onSuccess={handlePaymentSuccess} 
                onError={handlePaymentError} 
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 