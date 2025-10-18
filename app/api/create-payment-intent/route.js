import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import { createPaymentIntent } from '../../../lib/stripe';

export async function POST(request) {
  try {
    const { amount, currency = 'usd', shipping, paymentIntentId } = await request.json();

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
    
    if (!stripeApiKey) {
      console.error('Stripe private API key not found in site settings');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

    // Import stripe with the API key
    const stripe = require('stripe')(stripeApiKey);

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
        paymentIntent = await createNewPaymentIntent(stripe, amount, currency, shipping);
      }
    } else {
      // Create a new payment intent
      paymentIntent = await createNewPaymentIntent(stripe, amount, currency, shipping);
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

async function createNewPaymentIntent(stripe, amount, currency, shipping) {
  const paymentIntentOptions = {
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  };

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

  return await stripe.paymentIntents.create(paymentIntentOptions);
} 