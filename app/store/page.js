import { createClient } from '../../lib/prismic';
import { createStripeInstance } from '../../lib/stripe';
import ProductCard from '../../components/ui/ProductCard';
import StoreClientWrapper from '../../components/store/StoreClientWrapper';
import DrawerXIcon from '../../components/ui/DrawerXIcon';
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
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          price: price ? price.unit_amount : null,
          priceId: price ? price.id : null,
          currency: price ? price.currency : 'usd',
        };
      });

    return (
      <StoreClientWrapper>
        <main className="min-h-screen">
          <div className="container mx-auto py-20 px-4">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">Store</h1>
              <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity mt-2">
                <DrawerXIcon />
              </Link>
            </div>
            {productList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="container mx-auto py-20 px-4">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">Store</h1>
            <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity mt-2">
              <DrawerXIcon />
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