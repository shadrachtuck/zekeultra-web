import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/prismic';
import Stripe from 'stripe';

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
    
    // Check for test key override
    const useTestKey = process.env.NEXT_PUBLIC_USE_STRIPE_TEST === 'true';
    const testSecretKey = process.env.STRIPE_TEST_SECRET_KEY;
    const finalApiKey = useTestKey && testSecretKey ? testSecretKey : stripeApiKey;
    
        console.log('iOS Debug - Server payment intent creation:', {
          hasSiteSettings: !!siteSettings,
          hasStripeApiKey: !!stripeApiKey,
          useTestKey,
          hasTestSecretKey: !!testSecretKey,
          finalKeyLength: finalApiKey ? finalApiKey.length : 0,
          finalKeyPrefix: finalApiKey ? finalApiKey.substring(0, 10) + '...' : 'none',
          accountId: finalApiKey ? finalApiKey.split('_')[2] : 'none'
        });
    
    if (!finalApiKey) {
      console.error('iOS Debug - No Stripe private API key found (live or test)');
      return NextResponse.json(
        { error: 'Payment processing not configured' },
        { status: 500 }
      );
    }

        // Create Stripe instance with the API key
        const stripe = new Stripe(finalApiKey, {
          apiVersion: '2024-12-18.acacia',
        });
        
        // Check account capabilities for Apple Pay
        try {
          const account = await stripe.accounts.retrieve();
          console.log('iOS Debug - Stripe account info:', {
            id: account.id,
            country: account.country,
            capabilities: account.capabilities,
            applePayCapability: account.capabilities?.apple_pay || 'not found',
            cardPaymentsCapability: account.capabilities?.card_payments || 'not found',
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled
          });
        } catch (accountError) {
          console.error('iOS Debug - Error fetching account info:', {
            message: accountError.message,
            type: accountError.type,
            code: accountError.code,
            fullError: JSON.stringify(accountError, null, 2)
          });
        }
        
        // Also check payment method configurations
        try {
          const paymentMethodConfigs = await stripe.paymentMethodConfigurations.list({ limit: 1 });
          console.log('iOS Debug - Payment method configurations:', {
            count: paymentMethodConfigs.data.length,
            firstConfig: paymentMethodConfigs.data[0] || 'none',
            applePayConfig: paymentMethodConfigs.data[0]?.apple_pay || 'not found'
          });
        } catch (configError) {
          console.error('iOS Debug - Error fetching payment method configs:', configError.message);
        }

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

  console.log('iOS Debug - Creating payment intent with options:', {
    amount: paymentIntentOptions.amount,
    currency: paymentIntentOptions.currency,
    hasAutomaticPaymentMethods: !!paymentIntentOptions.automatic_payment_methods,
    hasShipping: !!paymentIntentOptions.shipping
  });
  
  try {
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    
    console.log('iOS Debug - Payment intent created:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret ? 'present' : 'missing',
      paymentMethodTypes: paymentIntent.payment_method_types || 'not provided',
      automaticPaymentMethods: paymentIntent.automatic_payment_methods || 'not provided',
      applePayEnabled: paymentIntent.payment_method_types?.includes('apple_pay') || false,
      googlePayEnabled: paymentIntent.payment_method_types?.includes('google_pay') || false,
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('iOS Debug - Stripe API error creating payment intent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      statusCode: error.statusCode,
      rawError: error.raw || error
    });
    throw error;
  }
} 