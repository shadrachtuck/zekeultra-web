# Product Variants Setup Guide

This guide explains how to add product variants (like shirt sizes, colors, etc.) to your Stripe products so they display correctly in your store.

## Overview

The variant system allows you to:
- Add size options (S, M, L, XL, etc.) to products like t-shirts
- Add color options or other custom variants
- Track different variants as separate cart items
- Display variant information throughout the shopping experience

## How to Set Up Variants in Stripe

### Method 1: Using Stripe Dashboard

1. **Navigate to your product** in the [Stripe Dashboard](https://dashboard.stripe.com/products)

2. **Click on the product** you want to add variants to (e.g., a t-shirt)

3. **Scroll to the "Metadata" section** and click "Add metadata"

4. **Add the following metadata fields:**

   **For size variants (most common):**
   - Key: `variants`
   - Value: `S,M,L,XL` (comma-separated list of available sizes)
   
   - Key: `variant_type` (optional, defaults to "size")
   - Value: `size`

   **For color variants:**
   - Key: `variants`
   - Value: `Black,White,Gray,Navy`
   
   - Key: `variant_type`
   - Value: `color`

   **For custom variants:**
   - Key: `variants`
   - Value: `Option 1,Option 2,Option 3`
   
   - Key: `variant_type`
   - Value: `style` (or whatever makes sense for your product)

5. **Save the product**

### Method 2: Using Stripe API

```javascript
// Example: Update a product with size variants
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

await stripe.products.update('prod_xxxxxxxxxxxxx', {
  metadata: {
    variants: 'S,M,L,XL',
    variant_type: 'size'
  }
});
```

## Variant Configuration Examples

### T-Shirt with Standard Sizes
```
variants: S,M,L,XL
variant_type: size
```

### T-Shirt with Descriptive Sizes
```
variants: Small,Medium,Large,X-Large
variant_type: size
```

### Product with Colors
```
variants: Black,White,Red,Blue
variant_type: color
```

### Hat with Sizes
```
variants: One Size,Small/Medium,Large/XL
variant_type: size
```

### Album with Format Options
```
variants: Vinyl,CD,Cassette
variant_type: format
```

## How It Works

### Product Page
- When a product has variants defined, a selector UI appears below the product description
- Users must select a variant before adding the item to cart
- The selected variant is stored with the cart item

### Cart
- Items with different variants are treated as separate cart items
- Example: "T-Shirt (Size: M)" and "T-Shirt (Size: L)" are two different items
- Variant information is displayed under the product name

### Checkout
- All variant information is shown in the order summary
- Variants are included in the payment intent metadata for order fulfillment

## Important Notes

1. **Products without variants still work normally** - if you don't add the `variants` metadata, the product behaves like it did before

2. **Variant type is optional** - if you don't specify `variant_type`, it defaults to "size"

3. **Same price for all variants** - Currently, all variants of a product use the same price. If you need different prices for different variants, create separate products in Stripe

4. **Comma-separated values** - Always separate variant options with commas (e.g., `S,M,L,XL`)

5. **No spaces around commas** - The system automatically trims spaces, but it's best practice to avoid them: use `S,M,L` not `S, M, L`

## Inventory Management

For now, variants don't affect inventory tracking. If you need to track inventory per variant, you have two options:

1. **Manual tracking** - Use Stripe's inventory field for total stock across all variants
2. **Separate products** - Create separate Stripe products for each variant (e.g., "T-Shirt - Small", "T-Shirt - Medium") if you need per-variant inventory

## Future Enhancements

Potential future improvements:
- Per-variant pricing
- Per-variant inventory tracking  
- Image swapping based on selected variant
- Multiple variant types per product (e.g., size AND color)

## Testing

To test the variant system:

1. Add metadata to a test product in Stripe
2. Refresh your store page
3. Click on the product
4. Verify the variant selector appears
5. Select a variant and add to cart
6. Check that the variant shows in the cart widget
7. Proceed to checkout and verify it appears there too
8. Try adding the same product with different variants - they should be separate cart items

## Troubleshooting

**Variants not showing up?**
- Check that the metadata key is exactly `variants` (lowercase, plural)
- Verify there are no extra spaces in the metadata value
- Try refreshing the page or clearing your browser cache

**Getting an error when adding to cart?**
- Make sure you've selected a variant before clicking "Add to Cart"
- Check the browser console for any error messages

**Cart items not separating by variant?**
- Clear your cart (it may have old items without variant data)
- Try adding the items again

## Support

If you need help setting up variants, check:
- [Stripe Documentation on Metadata](https://stripe.com/docs/api/metadata)
- [Stripe Products Documentation](https://stripe.com/docs/api/products)

