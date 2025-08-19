"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret, error: intentError } = await response.json();

      if (intentError) {
        throw new Error(intentError);
      }

      // Confirm payment
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const isButtonEnabled = stripe && hasPaymentInfo && !isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-4 rounded">
        <CardElement 
          options={cardElementOptions} 
          onChange={handleCardChange}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <Button
        type="submit"
        disabled={!isButtonEnabled}
        className="w-full py-3"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
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

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
} 