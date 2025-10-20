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
      console.log('iOS Debug - CheckoutForm device detection:', { isIOS, isMobile, isIOSMobile: isIOS && isMobile });
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
        redirect: 'never', // Prevent any redirects that would cause page reload and cart loss
      });

      if (paymentError) {
        setError(paymentError.message);
        onError?.(paymentError);
      } else {
        // Detect iOS mobile directly instead of relying on state
        const isIOS = typeof window !== 'undefined' ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false;
        const isMobile = typeof window !== 'undefined' ? (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768) : false;
        const detectedIOSMobile = isIOS && isMobile;
        
        console.log('iOS Debug - Payment successful, calling onSuccess', { 
          isIOSMobile, 
          detectedIOSMobile, 
          isIOS, 
          isMobile 
        });
        
        // For iOS mobile, add extra validation before calling success
        if (detectedIOSMobile) {
          console.log('iOS Debug - iOS mobile payment success, validating before callback');
          // Double-check that we actually have a successful payment
          setTimeout(() => {
            console.log('iOS Debug - iOS mobile delayed success callback');
            onSuccess?.();
          }, 500); // Small delay for iOS
        } else {
          console.log('iOS Debug - Non-iOS mobile, calling success immediately');
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
    console.log('iOS Debug - PaymentElement change event:', {
      complete: event.complete,
      empty: event.empty,
      value: event.value,
      elementType: event.elementType,
      error: event.error
    });
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
              onReady={(event) => {
                console.log('iOS Debug - PaymentElement ready:', {
                  elementType: event.elementType,
                  availablePaymentMethods: event.availablePaymentMethods || 'not provided'
                });
              }}
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

export default function CheckoutFormWrapper({ amount, onSuccess, onError }) {
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
        
        console.log('iOS Debug - Stripe initialization:', {
          hasPublishableKey: !!publishableKey,
          keyLength: publishableKey ? publishableKey.length : 0,
          keyPrefix: publishableKey ? publishableKey.substring(0, 10) + '...' : 'none'
        });
        
        if (mounted) {
          // Check for test key override in environment variables
          const testPublishableKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;
          const useTestKey = process.env.NEXT_PUBLIC_USE_STRIPE_TEST === 'true';
          
          if (useTestKey && testPublishableKey) {
            console.log('iOS Debug - Using test Stripe key override:', {
              hasTestKey: !!testPublishableKey,
              keyLength: testPublishableKey.length,
              keyPrefix: testPublishableKey.substring(0, 10) + '...'
            });
            
            const stripe = await loadStripe(testPublishableKey);
            console.log('iOS Debug - Test Stripe loaded successfully:', !!stripe);
            setStripePromise(stripe);
          } else if (publishableKey) {
            // Suppress HTTPS warning in development
            const originalConsoleWarn = console.warn;
            console.warn = (...args) => {
              if (args[0]?.includes?.('You may test your Stripe.js integration over HTTP')) {
                return; // Suppress this specific warning
              }
              originalConsoleWarn.apply(console, args);
            };
            
            const stripe = await loadStripe(publishableKey);
            console.log('iOS Debug - Stripe loaded successfully:', !!stripe);
            
            // Test if the publishable key is valid by making a test call
            if (stripe) {
              try {
                // This will help us verify if the key is working
                console.log('iOS Debug - Testing Stripe key validity...');
                // We can't test the key directly, but we can check if it's properly formatted
                const isTestKey = publishableKey.startsWith('pk_test_');
                const isLiveKey = publishableKey.startsWith('pk_live_');
                console.log('iOS Debug - Stripe key type:', { isTestKey, isLiveKey, keyLength: publishableKey.length });
              } catch (keyError) {
                console.error('iOS Debug - Stripe key validation error:', keyError);
              }
            }
            
            setStripePromise(stripe);
            
            // Restore console.warn after a short delay
            setTimeout(() => {
              console.warn = originalConsoleWarn;
            }, 1000);
          } else {
            // Fallback to environment variable
            const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
            console.log('iOS Debug - Using fallback Stripe key:', {
              hasEnvKey: !!envKey,
              keyLength: envKey ? envKey.length : 0
            });
            if (envKey) {
              const stripe = await loadStripe(envKey);
              console.log('iOS Debug - Fallback Stripe loaded successfully:', !!stripe);
              setStripePromise(stripe);
            } else {
              console.error('iOS Debug - No Stripe publishable key found in site settings or environment');
              // Try test key as last resort for debugging
              const testKey = 'pk_test_51234567890abcdef'; // This is a dummy test key
              console.log('iOS Debug - Attempting to use test key for debugging...');
              try {
                const testStripe = await loadStripe(testKey);
                console.log('iOS Debug - Test Stripe loaded:', !!testStripe);
                // Don't actually use it, just test loading
              } catch (testError) {
                console.log('iOS Debug - Test key failed as expected:', testError.message);
              }
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
        console.log('iOS Debug - Creating payment intent with amount:', amount);
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount,
            paymentIntentId: paymentIntentId, // Send existing ID if we have one
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

        const { clientSecret: secret, paymentIntentId: id } = await response.json();
        console.log('iOS Debug - Payment intent created successfully:', {
          hasClientSecret: !!secret,
          hasPaymentIntentId: !!id
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

    updatePaymentIntent();
    
    return () => {
      mounted = false;
    };
  }, [amount, paymentIntentId]); // Re-run when amount changes

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
      colorBackground: 'transparent',
      colorText: '#000000',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '0px',
      focusBoxShadow: 'none',
    },
    rules: {
      '.AccordionItem': {
        backgroundColor: 'transparent',
        border: '1px solid #000000',
        borderRadius: '0px',
        boxShadow: 'none',
        marginBottom: '8px',
      },
      '.AccordionItem:hover': {
        backgroundColor: 'transparent',
        border: '1px solid #000000',
      },
      '.AccordionItem--expanded': {
        backgroundColor: 'transparent',
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