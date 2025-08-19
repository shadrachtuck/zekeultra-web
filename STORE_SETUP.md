# Store Setup Guide

## Overview
The store is now fully functional with Stripe integration. Here's what's been implemented:

### ✅ Completed Features
- **Product Display**: Products are fetched from Stripe and displayed in a responsive grid
- **Shopping Cart**: Global cart state with add/remove/update functionality
- **Cart Widget**: Slide-out cart drawer with item management
- **Checkout**: Stripe-powered checkout with card payment processing
- **Price Formatting**: Proper currency formatting for all prices
- **Error Handling**: Graceful error handling for missing configuration
- **Responsive Design**: Works on all device sizes

### 🔧 Setup Requirements

#### 1. Stripe Account Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add products and prices in your Stripe Dashboard

#### 2. Prismic Configuration
Add these fields to your `site_settings` custom type in Prismic:

```json
{
  "stripe_private_api_key": {
    "type": "Text",
    "config": {
      "label": "Stripe Private API Key",
      "placeholder": "sk_test_..."
    }
  },
  "stripe_public_api_key": {
    "type": "Text", 
    "config": {
      "label": "Stripe Public API Key",
      "placeholder": "pk_test_..."
    }
  }
}
```

#### 3. Environment Variables (Optional Fallback)
You can also set these environment variables as fallbacks:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 🛍️ How It Works

1. **Product Loading**: Products are fetched from Stripe when the page loads
2. **Add to Cart**: Users can add products to their cart from the store
3. **Cart Management**: Cart widget shows all items with quantity controls
4. **Checkout**: Users can proceed to checkout with Stripe payment processing
5. **Order Completion**: Successful payments clear the cart and show confirmation

### 🎨 Customization

#### Product Cards
- Product images, names, descriptions, and prices are displayed
- "Add to Cart" button is disabled for products without prices
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)

#### Cart Widget
- Slide-out drawer from the right
- Item quantity controls (+/- buttons)
- Remove item functionality
- Clear cart option
- Total calculation with shipping

#### Checkout
- Stripe Elements for secure card input
- Real-time validation
- Error handling and success states

### 🚀 Testing

1. **Test Mode**: Use Stripe test keys for development
2. **Test Cards**: Use Stripe's test card numbers (e.g., 4242 4242 4242 4242)
3. **Test Products**: Create test products in your Stripe Dashboard

### 🔒 Security

- Private API keys are only used server-side
- Public keys are used client-side for Stripe Elements
- All payment processing goes through Stripe's secure infrastructure

### 📱 Mobile Support

- Responsive design works on all devices
- Touch-friendly cart controls
- Mobile-optimized checkout flow

The store is now ready to use! Just add your Stripe API keys to Prismic and create some products in your Stripe Dashboard. 