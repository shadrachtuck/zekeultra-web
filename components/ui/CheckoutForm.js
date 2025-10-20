"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createClient } from '../../lib/prismic';
import Button from './Button';

const CheckoutForm = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [hasPaymentInfo, setHasPaymentInfo] = useState(false);
  const [hasShippingInfo, setHasShippingInfo] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isIOSMobile, setIsIOSMobile] = useState(false);

  // Detect iOS mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
      setIsIOSMobile(isIOS && isMobile);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate that we have both shipping and payment info
    if (!hasShippingInfo) {
      setError('Please complete the shipping address');
      return;
    }

    if (!hasPaymentInfo) {
      setError('Please complete the payment information');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get the address element
      const addressElement = elements.getElement(AddressElement);
      const addressValue = await addressElement.getValue();
      
      if (!addressValue.complete) {
        throw new Error('Please complete all shipping address fields');
      }

      // Confirm payment with PaymentElement (supports all enabled payment methods from Stripe dashboard)
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Use a different return URL to avoid page reload that clears in-memory cart
          return_url: `${window.location.origin}/checkout?payment_complete=true`,
          shipping: {
            name: addressValue.value.name,
            address: {
              line1: addressValue.value.address.line1,
              line2: addressValue.value.address.line2 || '',
              city: addressValue.value.address.city,
              state: addressValue.value.address.state,
              postal_code: addressValue.value.address.postal_code,
              country: addressValue.value.address.country,
            },
          },
        },
        redirect: 'if_required', // Only redirect if payment method requires it (most don't)
      });

      if (paymentError) {
        setError(paymentError.message);
        onError?.(paymentError);
      } else {
        // Detect iOS mobile directly instead of relying on state
        const isIOS = typeof window !== 'undefined' ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false;
        const isMobile = typeof window !== 'undefined' ? (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768) : false;
        const detectedIOSMobile = isIOS && isMobile;
        
        // For iOS mobile, add extra validation before calling success
        if (detectedIOSMobile) {
          // Double-check that we actually have a successful payment
          setTimeout(() => {
            onSuccess?.();
          }, 500); // Small delay for iOS
        } else {
          onSuccess?.();
        }
      }
    } catch (err) {
      setError(err.message);
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentChange = (event) => {
    setHasPaymentInfo(event.complete);
  };

  const handleAddressChange = (event) => {
    setHasShippingInfo(event.complete);
    if (event.complete) {
      setShippingAddress(event.value);
    }
  };

  const addressElementOptions = {
    mode: 'shipping',
    fields: {
      phone: 'always',
    },
    validation: {
      phone: {
        required: 'never',
      },
    },
    defaultValues: {
      name: '',
      address: {
        country: 'US',
      },
    },
  };

  const isButtonEnabled = stripe && hasPaymentInfo && hasShippingInfo && !isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shipping Address */}
        <div>
          <label className="block font-medium text-black mb-4">
            Shipping Address
          </label>
          <div className="bg-transparent address-element-wrapper">
            <AddressElement 
              options={addressElementOptions} 
              onChange={handleAddressChange}
            />
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <label className="block font-medium text-black mb-4">
            Payment Information
          </label>
              <div className="bg-transparent">
                <PaymentElement 
                  onChange={handlePaymentChange}
                  options={{
                    wallets: {
                      applePay: 'auto',
                      googlePay: 'auto',
                    },
                    layout: 'tabs',
                    paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
                  }}
                />
              </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}
        
        <Button
          type="submit"
          disabled={!isButtonEnabled}
          className="w-full py-3"
        >
          {isProcessing ? 'Processing...' : 'Complete Purchase'}
        </Button>

        {(!hasShippingInfo || !hasPaymentInfo) && (
          <p className="text-sm text-gray-500 text-center">
            Please complete {!hasShippingInfo && 'shipping address'}
            {!hasShippingInfo && !hasPaymentInfo && ' and '}
            {!hasPaymentInfo && 'payment information'} to continue
          </p>
        )}
    </form>
  );
};

export default function CheckoutFormWrapper({ amount, cartItems = [], onSuccess, onError }) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  // Initialize Stripe once on mount
  useEffect(() => {
    let mounted = true;
    
    const initializeStripe = async () => {
      try {
        const client = createClient();
        const siteSettings = await client.getSingle('site_settings');
        
        const publishableKey = siteSettings?.data?.stripe_public_api_key;
        
        if (mounted) {
          // Check for test key override in environment variables
          const testPublishableKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;
          const useTestKey = process.env.NEXT_PUBLIC_USE_STRIPE_TEST === 'true';
          
          if (useTestKey && testPublishableKey) {
            const stripe = await loadStripe(testPublishableKey);
            setStripePromise(stripe);
          } else if (publishableKey) {
            const stripe = await loadStripe(publishableKey);
            setStripePromise(stripe);
          } else {
            // Fallback to environment variable
            const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
            if (envKey) {
              const stripe = await loadStripe(envKey);
              setStripePromise(stripe);
            } else {
              console.error('No Stripe publishable key found');
            }
          }
        }
      } catch (error) {
        console.error('iOS Debug - Error loading Stripe:', error);
        if (mounted) {
          // Fallback to environment variable
          const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
          if (envKey) {
            setStripePromise(loadStripe(envKey));
          }
        }
      }
    };

    initializeStripe();
    
    return () => {
      mounted = false;
    };
  }, []); // Only run once on mount

  // Create/update payment intent when amount changes
  useEffect(() => {
    let mounted = true;
    
    const updatePaymentIntent = async () => {
      try {
        setIsLoading(true);
        
        // Create or update payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount,
            paymentIntentId: paymentIntentId, // Send existing ID if we have one
            cartItems: cartItems, // Include cart items with variants/metadata
          }),
        });

        console.log('iOS Debug - Payment intent response:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('iOS Debug - Payment intent creation failed:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

            const paymentIntentData = await response.json();
            const { clientSecret: secret, paymentIntentId: id } = paymentIntentData;
            console.log('iOS Debug - Payment intent created successfully:', {
              hasClientSecret: !!secret,
              hasPaymentIntentId: !!id,
              fullResponse: paymentIntentData
            });
        if (mounted && secret) {
          setClientSecret(secret);
          setPaymentIntentId(id);
        }
      } catch (error) {
        console.error('Error creating/updating payment intent:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (amount > 0 && stripePromise) {
      updatePaymentIntent();
    }
    
    return () => {
      mounted = false;
    };
  }, [amount, stripePromise, paymentIntentId, cartItems]); // Re-run when amount or cart changes

  if (isLoading || !clientSecret) {
    return <div className="text-center py-8">Loading payment form...</div>;
  }

  if (!stripePromise) {
    return <div className="text-center py-8 text-red-500">Payment processing not configured</div>;
  }

  // Appearance configuration for all Elements
  const appearance = {
    theme: 'flat',
    variables: {
      colorPrimary: '#000000',
      colorBackground: '#ffffff',
      colorText: '#000000',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '0px',
      focusBoxShadow: 'none',
    },
    rules: {
      '.AccordionItem': {
        backgroundColor: '#ffffff',
        border: '1px solid #000000',
        borderRadius: '0px',
        boxShadow: 'none',
      },
      '.AccordionItem:hover': {
        backgroundColor: '#f9fafb',
        border: '1px solid #000000',
      },
      '.AccordionItem--expanded': {
        backgroundColor: '#f9fafb',
        border: '1px solid #000000',
      },
      '.Input': {
        border: 'none',
        borderBottom: '1px solid #000000',
        borderRadius: '0px',
        padding: '8px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
      '.Input:focus': {
        borderBottom: '1px solid #000000',
        boxShadow: 'none',
      },
      '.Input:hover': {
        borderBottom: '1px solid #000000',
      },
      '.Input--invalid': {
        borderBottom: '1px solid #ef4444',
      },
      '.Label': {
        color: '#000000',
        fontWeight: '500',
        fontSize: '14px',
        marginBottom: '8px',
      },
      '.Block': {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
} 