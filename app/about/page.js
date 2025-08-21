import { createClient } from '../../lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

export default async function AboutPage() {
  const client = createClient();
  
  try {
    console.log('[AboutPage] Fetching about page data...');
    const page = await client.getSingle('about_page');
    console.log('[AboutPage] Loaded about page data:', page);
    
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        {page.data.hero_image && (
          <div className="relative h-[50vh] ">
            <PrismicNextImage
              field={page.data.hero_image}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
            </div>
          </div>
        )}

        
        <div className="container mx-auto py-12 px-2">
          <div className="max-w-4xl mx-auto">
            {/* Bio Section */}
            <h1 className="text-2xl font-bold mb-8 pb-4">{page.data.page_title || 'About'}</h1>
            {page.data.bio && (
              <div className="mb-16">
                <div className="prose prose-lg max-w-none text-black">
                  <PrismicRichText field={page.data.bio} />
                </div>
              </div>
            )}
            
            {/* Slices */}
            {page.data.slices && (
              <SliceZone slices={page.data.slices} components={components} />
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[AboutPage] Error loading about page:', error);
    return (
      <div className="container mx-auto page-container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">About Page</h1>
          <div className="prose prose-lg max-w-none text-black">
            <p>About page content will be managed through Prismic CMS.</p>
            <p>Please create an &quot;about_page&quot; document in your Prismic repository to display content here.</p>
          </div>
        </div>
      </div>
    );
  }
} 