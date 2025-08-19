# Stripe Store Integration Setup

This guide will help you set up the Stripe store integration for your ZekeUltra website.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Your Stripe API keys

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Stripe Configuration
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys

# Your Stripe publishable key (starts with 'pk_')
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Your Stripe secret key (starts with 'sk_')
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## Getting Your Stripe API Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your publishable key (starts with `pk_`)
3. Copy your secret key (starts with `sk_`)
4. Add them to your `.env.local` file

## Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/store` to see the product catalog
3. Navigate to `/checkout` to test the payment flow
4. Use Stripe's test card numbers for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Current Features

- ✅ Product catalog display
- ✅ Stripe payment processing
- ✅ Checkout form with card validation
- ✅ Order summary
- ✅ Payment success/error handling

## Next Steps

1. **Product Management**: Integrate with Prismic for product data
2. **Shopping Cart**: Add cart functionality with state management
3. **Inventory**: Add inventory tracking
4. **Order Management**: Add order history and tracking
5. **Email Notifications**: Add order confirmation emails
6. **Shipping**: Integrate with shipping providers

## Security Notes

- Never commit your `.env.local` file to version control
- Use test keys for development
- Switch to live keys only when ready for production
- Always validate payments on the server side

## Support

For Stripe-specific issues, check the [Stripe Documentation](https://stripe.com/docs) 