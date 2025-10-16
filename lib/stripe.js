// lib/stripe.js
import Stripe from 'stripe';

// Server-side Stripe instance - now accepts API key as parameter
export const createStripeInstance = (apiKey) => {
  if (!apiKey) {
    throw new Error('Stripe API key is required');
  }
  return new Stripe(apiKey, {
    apiVersion: '2024-12-18.acacia',
  });
};

// Default Stripe instance for backward compatibility
export const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  }) : null;

// Client-side Stripe instance
export const getStripe = (publishableKey) => {
  if (typeof window !== 'undefined' && publishableKey) {
    return require('@stripe/stripe-js').loadStripe(publishableKey);
  }
  // Fallback to environment variable
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return require('@stripe/stripe-js').loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return null;
};

// Helper function to format price for display
export const formatPrice = (amount, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

// Helper function to create payment intent with dynamic API key
export const createPaymentIntent = async (amount, currency = 'usd', apiKey, shipping = null) => {
  try {
    const stripeInstance = createStripeInstance(apiKey);
    
    const paymentIntentData = {
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // Add shipping information if provided
    if (shipping) {
      paymentIntentData.shipping = shipping;
    }

    const paymentIntent = await stripeInstance.paymentIntents.create(paymentIntentData);
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}; 