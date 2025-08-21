import { createClient } from '../../lib/prismic';

export default async function DebugSettings() {
  const client = createClient();
  
  try {
    const siteSettings = await client.getSingle('site_settings');
    
    if (!siteSettings) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Site Settings Debug</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-3 rounded">
            ❌ No site settings document found
          </div>
          <p className="mt-4">You need to create a &quot;Site Settings&quot; document in your Prismic dashboard.</p>
        </div>
      );
    }
    
    const stripeApiKey = siteSettings?.data?.stripe_private_api_key;
    const hasStripeKey = !!stripeApiKey;
    const keyPreview = hasStripeKey ? `${stripeApiKey.substring(0, 10)}...` : 'Not set';
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Site Settings Debug</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-2 py-3 rounded mb-4">
          ✅ Site settings document found
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-100 p-2 rounded">
            <h2 className="font-bold">Stripe Configuration</h2>
            <p><strong>Stripe API Key Present:</strong> {hasStripeKey ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Key Preview:</strong> {keyPreview}</p>
            {!hasStripeKey && (
              <p className="text-red-600 mt-2">
                You need to add your Stripe private API key to the site settings in Prismic.
              </p>
            )}
          </div>
          
          <div className="bg-blue-100 p-2 rounded">
            <h2 className="font-bold">Other Settings</h2>
            <p><strong>Artist Name:</strong> {siteSettings?.data?.artist_name || 'Not set'}</p>
            <p><strong>Contact Email:</strong> {siteSettings?.data?.contact_email || 'Not set'}</p>
            <p><strong>Bandsintown Enabled:</strong> {siteSettings?.data?.enable_bandsintown ? 'Yes' : 'No'}</p>
            <p><strong>Bandsintown Artist Name:</strong> {siteSettings?.data?.bandsintown_artist_name || 'Not set'}</p>
          </div>
          
          <div className="bg-gray-100 p-2 rounded">
            <h2 className="font-bold">Raw Data</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(siteSettings.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Site Settings Debug</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-3 rounded">
          ❌ Error fetching site settings
        </div>
        <p className="mt-4">Error: {error.message}</p>
      </div>
    );
  }
} 