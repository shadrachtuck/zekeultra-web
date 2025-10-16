"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
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

      // Create payment intent with shipping info
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          shipping: addressValue.value
        }),
      });

      const { clientSecret, error: intentError } = await response.json();

      if (intentError) {
        throw new Error(intentError);
      }

      // Confirm payment with shipping info
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: addressValue.value.name,
            address: {
              line1: addressValue.value.address.line1,
              line2: addressValue.value.address.line2,
              city: addressValue.value.address.city,
              state: addressValue.value.address.state,
              postal_code: addressValue.value.address.postal_code,
              country: addressValue.value.address.country,
            },
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message);
        onError?.(paymentError);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError(err.message);
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setHasPaymentInfo(event.complete);
  };

  const handleAddressChange = (event) => {
    setHasShippingInfo(event.complete);
    if (event.complete) {
      setShippingAddress(event.value);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#000000',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
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
          <div className="bg-transparent px-2 py-2 border-b border-black">
            <CardElement 
              options={cardElementOptions} 
              onChange={handleCardChange}
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchStripeKey = async () => {
      try {
        const client = createClient();
        const siteSettings = await client.getSingle('site_settings');
        
        const publishableKey = siteSettings?.data?.stripe_public_api_key;
        
        if (mounted) {
          if (publishableKey) {
            setStripePromise(loadStripe(publishableKey));
          } else {
            // Fallback to environment variable
            const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
            if (envKey) {
              setStripePromise(loadStripe(envKey));
            } else {
              console.error('No Stripe publishable key found');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Stripe key:', error);
        if (mounted) {
          // Fallback to environment variable
          const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
          if (envKey) {
            setStripePromise(loadStripe(envKey));
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStripeKey();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading payment form...</div>;
  }

  if (!stripePromise) {
    return <div className="text-center py-8 text-red-500">Payment processing not configured</div>;
  }

  // Appearance configuration for all Elements
  const appearance = {
    theme: 'stripe',
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
        outline: 'none',
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
      },
      '.Tab': {
        border: 'none',
        borderBottom: '2px solid transparent',
        boxShadow: 'none',
      },
      '.Tab:hover': {
        borderBottom: '2px solid #000000',
      },
      '.Tab--selected': {
        borderBottom: '2px solid #000000',
        boxShadow: 'none',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={{ appearance }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
} 