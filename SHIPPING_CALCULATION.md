# Shipping Calculation

This document explains how shipping is calculated in the checkout process.

## Overview

The checkout page uses a **fixed-rate shipping system** with three options that customers can choose from. The shipping cost is calculated based on the customer's selection and added to the order total.

## Shipping Options

Three shipping options are available:

1. **Free Shipping**
   - Cost: $0.00
   - Delivery: 5-7 business days
   - Use case: Standard orders, promotional free shipping

2. **Standard Shipping**
   - Cost: $5.00
   - Delivery: 3-5 business days
   - Use case: Regular orders with faster delivery

3. **Express Shipping**
   - Cost: $15.00
   - Delivery: 1-2 business days
   - Use case: Urgent orders

## How It Works

### 1. Customer Experience

1. **Add items to cart** → Customer browses and adds products
2. **Go to checkout** → Cart items are displayed with subtotal
3. **Select shipping method** → Customer chooses from 3 shipping options
4. **See total update** → Total automatically updates with selected shipping cost
5. **Complete payment** → Payment intent is created/updated with final total

### 2. Technical Implementation

#### Checkout Page (`app/checkout/page.js`)

```javascript
const SHIPPING_OPTIONS = [
  { id: 'free', name: 'Free Shipping', price: 0, days: '5-7 business days' },
  { id: 'standard', name: 'Standard Shipping', price: 500, days: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 1500, days: '1-2 business days' },
];

const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shippingCost = selectedShipping.price;
const total = subtotal + shippingCost;
```

#### Checkout Form (`components/ui/CheckoutForm.js`)

- Receives the total amount (subtotal + shipping)
- Creates/updates Stripe Payment Intent with the total
- When shipping option changes, the amount prop updates
- Payment Intent is automatically updated via the API

#### Payment Intent API (`app/api/create-payment-intent/route.js`)

- Accepts `amount` and optional `paymentIntentId`
- If `paymentIntentId` exists, updates the existing payment intent amount
- If no `paymentIntentId`, creates a new payment intent
- Returns both `clientSecret` and `paymentIntentId`

## Calculation Flow

```
1. Customer adds items to cart
   └─> Subtotal = sum of (item price × quantity)

2. Customer goes to checkout
   └─> Default shipping = Free ($0.00)
   └─> Initial total = subtotal + $0.00

3. Customer selects shipping option
   └─> Shipping cost updates (e.g., $5.00 for standard)
   └─> Total = subtotal + $5.00
   └─> Payment Intent is updated with new total

4. Payment is completed
   └─> Stripe charges the final total amount
```

## Customization

### Adding New Shipping Options

To add more shipping options, update the `SHIPPING_OPTIONS` array in `app/checkout/page.js`:

```javascript
const SHIPPING_OPTIONS = [
  { id: 'free', name: 'Free Shipping', price: 0, days: '5-7 business days' },
  { id: 'standard', name: 'Standard Shipping', price: 500, days: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 1500, days: '1-2 business days' },
  { id: 'overnight', name: 'Overnight', price: 2500, days: 'Next day' }, // New option
];
```

### Changing Shipping Prices

Shipping prices are in **cents** (Stripe format):
- $0.00 = 0 cents
- $5.00 = 500 cents
- $15.00 = 1500 cents
- $25.00 = 2500 cents

### Free Shipping Threshold

To offer free shipping for orders over a certain amount:

```javascript
const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Automatically select free shipping for orders over $50
const [selectedShipping, setSelectedShipping] = useState(
  subtotal >= 5000 ? SHIPPING_OPTIONS[0] : SHIPPING_OPTIONS[1]
);

// Or hide the free shipping option for small orders
const availableShippingOptions = SHIPPING_OPTIONS.filter(option => {
  if (option.id === 'free' && subtotal < 5000) return false;
  return true;
});
```

### Address-Based Shipping

To calculate shipping based on the customer's address, you would need to:

1. Get the shipping address from the form
2. Call a shipping rate API (USPS, UPS, FedEx, etc.)
3. Display calculated rates instead of fixed rates
4. Update the payment intent with the selected rate

This would require additional API integrations and is more complex than fixed rates.

## Benefits of This Approach

✅ **Simple** - No external shipping API required
✅ **Fast** - Instant calculation, no API delays
✅ **Transparent** - Customers see costs upfront
✅ **Predictable** - Consistent pricing regardless of location
✅ **Easy to manage** - Change prices in one place

## Limitations

⚠️ **No weight-based calculation** - Same price for all items
⚠️ **No address-based calculation** - Same price for all locations
⚠️ **No carrier integration** - Manual delivery estimates
⚠️ **Fixed rates only** - Can't adjust based on order value (except manually)

## Future Enhancements

If you need more advanced shipping calculation, consider:

1. **Flat rate by order value**
   - Free shipping over $50
   - $5 shipping for orders under $50

2. **Weight-based calculation**
   - Add weight metadata to products
   - Calculate total weight
   - Use weight tiers for shipping costs

3. **Carrier API integration**
   - Integrate with USPS, UPS, FedEx APIs
   - Calculate real-time shipping rates
   - Display actual delivery dates

4. **International shipping**
   - Add country detection
   - Different rates for different countries
   - Handle customs and duties

## Testing

To test shipping calculation:

1. Add items to cart
2. Go to checkout
3. Select different shipping options
4. Verify total updates correctly
5. Complete a test payment
6. Check Stripe Dashboard for correct amount

## Notes

- All prices are in **cents** (Stripe format)
- Shipping is added to the subtotal before creating the payment intent
- The payment intent is automatically updated when shipping changes
- Customers must select a shipping option before payment
- Free shipping is selected by default

