"use client";
import { useState, useEffect, Suspense } from 'react';
import { useCart, getCartItemKey } from '../../components/store/CartContext';
import { formatPrice } from '../../lib/stripe';
import CheckoutForm from '../../components/ui/CheckoutForm';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import CloseIcon from '../../components/ui/CloseIcon';
import { useSearchParams } from 'next/navigation';

const SHIPPING_OPTIONS = [
  // { id: 'free', name: 'Free Shipping', price: 0, days: '5-7 business days' },
  { id: 'standard', name: 'Standard Shipping', price: 500, days: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 1500, days: '1-2 business days' },
];

function CheckoutPageContent() {
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
  const [hasProcessedSuccess, setHasProcessedSuccess] = useState(false);
  const { cart, dispatch } = useCart();
  const searchParams = useSearchParams();
  
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = selectedShipping.price;
  const total = subtotal + shippingCost;

  // Handle success parameter from Stripe redirect
  useEffect(() => {
    try {
      // Prevent multiple processing
      if (hasProcessedSuccess) return;
      
      const success = searchParams.get('success');
      const paymentIntentId = searchParams.get('payment_intent');
      
      console.log('iOS Debug - URL params:', { success, paymentIntentId, url: typeof window !== 'undefined' ? window.location.href : 'SSR', hasProcessedSuccess });
      
      // Check URL parameters first
      if (success === 'true') {
        console.log('iOS Debug - Success detected via URL params, completing order');
        setHasProcessedSuccess(true);
        setOrderComplete(true);
        dispatch({ type: 'CLEAR_CART' });
        // Clean up URL to prevent re-triggering (with iOS safety check)
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          window.history.replaceState({}, '', '/checkout');
        }
        return;
      }
      
      // iOS fallback: Check localStorage for payment success (with safety checks)
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const paymentSuccess = localStorage.getItem('payment_success');
          if (paymentSuccess === 'true') {
            console.log('iOS Debug - Success detected via localStorage, completing order');
            setHasProcessedSuccess(true);
            setOrderComplete(true);
            dispatch({ type: 'CLEAR_CART' });
            localStorage.removeItem('payment_success');
          }
        } catch (localStorageError) {
          console.log('iOS Debug - localStorage access failed:', localStorageError);
        }
      }
    } catch (error) {
      console.error('iOS Debug - Error in success handling:', error);
    }
  }, [searchParams, dispatch, hasProcessedSuccess]);

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
      <main className="min-h-screen flex items-center">
        <div className="container mx-auto px-2 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-bold mb-8">Checkout</h3>
            <p className="text-xl text-gray-300 mb-8">
              Your cart is empty. Please add some items to your cart before checkout.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (orderComplete) {
    return (
      <main className="min-h-screen flex items-center">
        <div className="container mx-auto px-2 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-8 pb-4">Order Complete!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for your purchase! You will receive a confirmation email shortly.
            </p>
            <a
              href="/store"
              className="inline-block px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Continue shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 mt-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Checkout</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartOver}
                className="text-black hover:text-gray-600 transition-colors font-medium underline"
              >
                Start over
              </button>
              <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity">
                <CloseIcon className="w-8 h-8" />
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h4 className="font-bold mb-6">Order Summary</h4>
              <div className="space-y-4 mb-6">
                {cart.items.map(item => {
                  const cartItemKey = getCartItemKey(item);
                  return (
                    <div key={cartItemKey} className="flex justify-between items-start border-b border-white/20">
                      <div className="flex items-start gap-4 flex-1">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-black">{item.name}</div>
                          {item.variant && (
                            <div className="text-gray-500 text-xs capitalize">
                              {item.variantType || 'Size'}: {item.variant}
                            </div>
                          )}
                          <div className="text-gray-300 text-sm mb-2">${(item.price / 100).toFixed(2)}</div>
                          <div className="flex items-center gap-2">
                            <button
                              className="px-2 py-1 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', cartItemKey, quantity: Math.max(1, item.quantity - 1) })}
                            >
                              -
                            </button>
                            <span className="text-black text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              className="px-2 py-1 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', cartItemKey, quantity: item.quantity + 1 })}
                            >
                              +
                            </button>
                            <button
                              className="ml-2 text-red-500 hover:text-red-400 text-sm transition-colors"
                              onClick={() => dispatch({ type: 'REMOVE_ITEM', cartItemKey })}
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
                  );
                })}
              </div>
              
              {/* Shipping Options */}
              <div className="space-y-3 border-t border-white/20 pt-4">
                <h4 className="font-bold text-black">Select Shipping Method</h4>
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                      selectedShipping.id === option.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping.id === option.id}
                        onChange={() => setSelectedShipping(option)}
                        className="w-4 h-4 text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-medium text-black">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.days}</div>
                      </div>
                    </div>
                    <div className="font-medium text-black">
                      {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 border-t border-white/20 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping:</span>
                  <span className="text-black">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/20 pt-2">
                  <span className="text-black">Total:</span>
                  <span className="text-black">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping & Payment Form */}
            <div>
              <h4 className="font-bold mb-6">Shipping & Payment</h4>
              <CheckoutForm 
                amount={total} 
                onSuccess={handlePaymentSuccess} 
                onError={handlePaymentError} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading checkout...</div>
          <div className="text-sm text-gray-500 mt-2">Please wait</div>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
} 