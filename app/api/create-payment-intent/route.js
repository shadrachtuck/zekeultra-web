import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import { createPaymentIntent } from '../../../lib/stripe';

export async function POST(request) {
  try {
    const { amount, currency = 'usd', shipping } = await request.json();

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

    // Create a PaymentIntent with the order amount, currency, and shipping info
    const paymentIntentOptions = {
      amount,
      currency,
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

    const paymentIntent = await createPaymentIntent(
      paymentIntentOptions.amount, 
      paymentIntentOptions.currency, 
      stripeApiKey,
      paymentIntentOptions.shipping
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 