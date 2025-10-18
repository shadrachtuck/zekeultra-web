import { createClient } from '../../lib/prismic';
import { createStripeInstance } from '../../lib/stripe';
import ProductCard from '../../components/ui/ProductCard';
import StoreClientWrapper from '../../components/store/StoreClientWrapper';
import CloseIcon from '../../components/ui/CloseIcon';
import Link from 'next/link';

export default async function StorePage() {
  const client = createClient();
  
  try {
    // Fetch Stripe API key from Prismic settings
    const siteSettings = await client.getSingle('site_settings');
    const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
    
    if (!stripeApiKey) {
      throw new Error('Stripe private API key not found in site settings');
    }

    // Create Stripe instance with the API key from settings
    const stripe = createStripeInstance(stripeApiKey);
    
    // Fetch products and prices from Stripe
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true }),
      stripe.prices.list({ active: true, expand: ['data.product'] })
    ]);

    // Map prices to products
    const productMap = {};
    products.data.forEach(product => {
      productMap[product.id] = { ...product, prices: [] };
    });
    
    prices.data.forEach(price => {
      if (price.product && productMap[price.product.id]) {
        productMap[price.product.id].prices.push(price);
      }
    });
    
    const productList = Object.values(productMap)
      .filter(product => product.prices.length > 0) // Only show products with prices
      .map(product => {
        // Use the first price for display
        const price = product.prices[0];
        
        // Parse variant information from metadata
        let variants = null;
        let variantType = 'size'; // default
        
        if (product.metadata) {
          // Check if product has variants defined in metadata
          // Format: { variants: "S,M,L,XL" } or { variants: "Small,Medium,Large" }
          if (product.metadata.variants) {
            variants = product.metadata.variants.split(',').map(v => v.trim());
          }
          if (product.metadata.variant_type) {
            variantType = product.metadata.variant_type;
          }
        }
        
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          price: price ? price.unit_amount : null,
          priceId: price ? price.id : null,
          currency: price ? price.currency : 'usd',
          variants: variants,
          variantType: variantType,
          metadata: product.metadata,
        };
      });

    return (
              <StoreClientWrapper>
          <main className="min-h-screen">
            <div className="container mx-auto py-12 px-2 md:py-20 md:px-0">
            <div className="flex justify-between items-start mb-2">
              {/* <h1 className="text-2xl font-bold">Store</h1> */}
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full px-2">
                All merch
              </div>
              <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity">
                <CloseIcon className="w-8 h-8" />
              </Link>
            </div>
            {productList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productList.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-300 mb-4">No products available at this time.</p>
                <p className="text-gray-400 text-sm">
                  Check back soon for new merchandise!
                </p>
              </div>
            )}
          </div>
        </main>
      </StoreClientWrapper>
    );
  } catch (error) {
    console.error('Error loading store:', error);
    
    // Show a helpful error message
          return (
        <main className="min-h-screen">
          <div className="container mx-auto py-12 px-2 md:py-20 md:px-0">
          <div className="flex justify-between items-start mb-2">
            {/* <h1 className="text-2xl font-bold">Store</h1> */}
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full px-2">
                All merch
              </div>
            <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity">
              <CloseIcon className="w-8 h-8" />
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-xl text-gray-300 mb-4">
              {error.message === 'Stripe private API key not found in site settings' 
                ? 'Store is not configured yet. Please add your Stripe API keys to the site settings.'
                : 'Unable to load products. Please check your Stripe configuration.'}
            </p>
            <p className="text-gray-400 text-sm">
              Error: {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }
} 