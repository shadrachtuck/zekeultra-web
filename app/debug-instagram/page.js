import { createClient } from '../../lib/prismic';

export default async function DebugInstagramPage() {
  const client = createClient();
  
  try {
    const page = await client.getSingle('media_page');
    
    return (
      <main className="min-h-screen text-black">
        <div className="container mx-auto py-12 px-2">
          <h1 className="text-2xl font-bold pb-4">Instagram Debug</h1>
          
          <div className="bg-gray-100 p-2 rounded mb-6">
            <h2 className="text-xl font-bold mb-2">Media Page Data:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(page.data, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 p-2 rounded mb-6">
            <h2 className="text-xl font-bold mb-2">Slices:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(page.data.slices, null, 2)}
            </pre>
          </div>
          
          {page.data.slices && page.data.slices.map((slice, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded mb-4">
              <h3 className="text-lg font-bold mb-2">Slice {index}: {slice.slice_type}</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(slice, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error('[DebugInstagramPage] Error:', error);
    return (
      <main className="min-h-screen text-black">
        <div className="container mx-auto py-12 px-2">
          <h1 className="text-2xl font-bold pb-4">Instagram Debug</h1>
          <div className="bg-red-100 p-2 rounded">
            <h2 className="text-xl font-bold mb-2">Error:</h2>
            <pre className="text-sm">{error.message}</pre>
          </div>
        </div>
      </main>
    );
  }
} 