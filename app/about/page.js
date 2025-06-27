import { createClient } from '../../lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

export default async function AboutPage() {
  const client = createClient();
  
  try {
    const page = await client.getSingle('about_page');
    
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        {page.data.hero_image && (
          <div className="relative h-[50vh] mb-12">
            <PrismicNextImage
              field={page.data.hero_image}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {page.data.artist_name || 'About'}
                </h1>
              </div>
            </div>
          </div>
        )}
        
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
            {/* Bio Section */}
            {page.data.bio && (
              <div className="mb-16">
          <div className="prose prose-lg max-w-none">
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
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About</h1>
          <p>About page content will be managed through Prismic CMS.</p>
        </div>
      </div>
    );
  }
} 