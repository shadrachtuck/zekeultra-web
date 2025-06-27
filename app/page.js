import { createClient } from '../lib/prismic';
import { SliceZone } from '@prismicio/react';
import { components } from '../slices';

export default async function Home() {
  const client = createClient();
  
  try {
    const page = await client.getSingle('homepage');
    
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <SliceZone slices={page.data.slices} components={components} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    // Fallback content if Prismic data is not available
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="font-brigends text-hero font-bold tracking-tight mb-6 leading-none">
              ZekeUltra
            </h1>
            
            <div className="font-zekeultra-body text-subtitle font-medium max-w-2xl mx-auto mb-8">
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/music"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-zekeultra-body font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Listen Now
              </a>
              <a
                href="/tour"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-zekeultra-body font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-200"
              >
                See Tour Dates
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
