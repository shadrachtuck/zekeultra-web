# Featured Products Filtering

This feature allows you to show only specific featured products in the ProductCarousel slice, filtering them based on product names specified in your site settings.

## How to Use

### 1. Configure Featured Product Names

1. In your homepage, add or edit a **ProductCarousel** slice
2. Add product names to the **Featured Product Names** field:
   - Click "Add Item" to add a new featured product
   - Enter the exact product name (e.g., "Babel T-Shirts", "Speak To The Jungle In The Hills CD")
   - You can add multiple featured products

### 2. Enable Featured Products Filtering

1. Set **Show Only Featured Products** to `true`
2. The carousel will now only display products whose names match the featured product names

## How It Works

- **Stripe Products**: When using Stripe products, the system filters products by comparing product names with the featured product names
- **Manual Products**: When using manual products, the same filtering logic applies to the manually entered product names
- **Fuzzy Matching**: The system uses partial matching, so "Babel T-Shirts" will match products containing "Babel" or "T-Shirts"

## Example Configuration

### ProductCarousel Slice
```json
{
  "primary": {
    "show_only_featured": true,
    "featured_product_names": [
      { "product_name": "Babel T-Shirts" },
      { "product_name": "Speak To The Jungle In The Hills CD" }
    ]
  }
}
```

### Complete Example
```json
{
  "primary": {
    "section_title": "Featured Products",
    "use_stripe_products": true,
    "show_only_featured": true,
    "featured_product_names": [
      { "product_name": "Babel T-Shirts" },
      { "product_name": "Speak To The Jungle In The Hills CD" }
    ]
  }
}
```

## Benefits

- **Curated Display**: Show only your most important products
- **Slice-Level Control**: Each carousel can have its own list of featured products
- **Easy Configuration**: Set featured products directly in the slice without external dependencies
- **Consistent Branding**: Ensure key products are always visible
- **Performance**: Reduce the number of products loaded when filtering is enabled

## Troubleshooting

- **No Products Showing**: Check that the featured product names exactly match your Stripe/manual product names
- **Case Sensitivity**: Product names are compared case-insensitively
- **Partial Matches**: The system will match partial names, so "Babel" will match "Babel T-Shirts" 