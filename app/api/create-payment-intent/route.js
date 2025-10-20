import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import Stripe from 'stripe';

export async function POST(request) {
  try {
    const { amount, currency = 'usd', shipping, paymentIntentId, cartItems = [] } = await request.json();

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Fetch Stripe API key from Prismic settings
    const client = createClient();
    const siteSettings = await client.getSingle('site_settings');
    
    const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
    
    // Check for test key override
    const useTestKey = process.env.NEXT_PUBLIC_USE_STRIPE_TEST === 'true';
    const testSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
    const finalApiKey = useTestKey && testSecretKey ? testSecretKey : stripeApiKey;
    
    // Removed debug logging - Apple Pay now working
    
    if (!finalApiKey) {
      console.error('No Stripe private API key found');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

        // Create Stripe instance with the API key
        const stripe = new Stripe(finalApiKey, {
          apiVersion: '2024-12-18.acacia',
        });
        
        // Removed debug logging - Apple Pay now working

    let paymentIntent;

    // If we have an existing payment intent ID, update it
    if (paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
          amount,
        });
      } catch (updateError) {
        console.error('Error updating payment intent, creating new one:', updateError);
        // If update fails, create a new one
        paymentIntent = await createNewPaymentIntent(stripe, amount, currency, shipping, cartItems);
      }
    } else {
      // Create a new payment intent
      paymentIntent = await createNewPaymentIntent(stripe, amount, currency, shipping, cartItems);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Don't log specific Stripe errors in development to reduce console noise
    if (process.env.NODE_ENV === 'development' && error.message?.includes('payment method type')) {
      console.log('Payment method configuration issue - using fallback');
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

async function createNewPaymentIntent(stripe, amount, currency, shipping, cartItems = []) {
  const paymentIntentOptions = {
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  };
  
  // Only use payment method configuration in production (live keys)
  // Test mode doesn't need this specific configuration
  const useTestKey = process.env.NEXT_PUBLIC_USE_STRIPE_TEST === 'true';
  if (!useTestKey) {
    // Use the payment method configuration that has Apple Pay enabled (live only)
    paymentIntentOptions.payment_method_configuration = 'pmc_1SJJJTAmL1rpru9Ek1z2tMo9';
  }

  // Add shipping information if provided
  if (shipping) {
    paymentIntentOptions.shipping = {
      name: shipping.name,
      address: {
        line1: shipping.address.line1,
        line2: shipping.address.line2,
        city: shipping.address.city,
        state: shipping.address.state,
        postal_code: shipping.address.postal_code,
        country: shipping.address.country,
      },
    };
  }

  // Add cart items as metadata (Stripe metadata values must be strings)
  if (cartItems && cartItems.length > 0) {
    const metadata = {};
    
    cartItems.forEach((item, index) => {
      // Stripe metadata keys have a limit of 40 characters and values 500 characters
      const prefix = `item_${index + 1}`;
      metadata[`${prefix}_name`] = String(item.name || '').substring(0, 500);
      metadata[`${prefix}_price`] = String(item.price || '');
      metadata[`${prefix}_quantity`] = String(item.quantity || 1);
      
      // Include variant information (e.g., shirt size)
      if (item.variant) {
        metadata[`${prefix}_variant`] = String(item.variant).substring(0, 500);
      }
      if (item.variantType) {
        metadata[`${prefix}_variant_type`] = String(item.variantType).substring(0, 500);
      }
      
      // Include product ID if available
      if (item.id) {
        metadata[`${prefix}_product_id`] = String(item.id).substring(0, 500);
      }
    });
    
    // Add total item count
    metadata.total_items = String(cartItems.length);
    
    paymentIntentOptions.metadata = metadata;
    
    // Log metadata for testing
    console.log('💳 Payment Intent Metadata:', JSON.stringify(metadata, null, 2));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
    });
    throw error;
  }
} 