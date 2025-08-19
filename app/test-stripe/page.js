import { createClient } from '../../lib/prismic';
import { createStripeInstance } from '../../lib/stripe';

export default async function TestStripe() {
  const client = createClient();
  
  try {
    const siteSettings = await client.getSingle('site_settings');
    const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
    
    if (!siteSettings) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Stripe Test</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ No site settings document found
          </div>
          <p className="mt-4">You need to create a &quot;Site Settings&quot; document in your Prismic dashboard.</p>
        </div>
      );
    }
    
    if (!stripeApiKey) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Stripe Test</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            ❌ No Stripe API key found in site settings
          </div>
          <p className="mt-4">Please add your Stripe private API key to the site settings in Prismic.</p>
        </div>
      );
    }
    
    const stripe = createStripeInstance(stripeApiKey);
    const products = await stripe.products.list({ active: true, limit: 5 });
    const prices = await stripe.prices.list({ active: true, limit: 10 });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Stripe Test</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Stripe connection successful
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-bold">Products Found: {products.data.length}</h2>
            <ul className="mt-2">
              {products.data.map(product => (
                <li key={product.id} className="text-sm">
                  • {product.name} (ID: {product.id})
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="font-bold">Prices Found: {prices.data.length}</h2>
            <ul className="mt-2">
              {prices.data.map(price => (
                <li key={price.id} className="text-sm">
                  • ${price.unit_amount / 100} {price.currency} (ID: {price.id})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Stripe Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Error connecting to Stripe
        </div>
        <p className="mt-4">Error: {error.message}</p>
      </div>
    );
  }
} 