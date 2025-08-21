import { createClient } from '../../lib/prismic';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

export default async function MediaPage() {
  const client = createClient();
  
  try {
    const page = await client.getSingle('media_page');
    
    return (
      <main className="min-h-screen  text-black">
        <div className="container mx-auto py-12 px-2">
          <h1 className="text-2xl font-bold  pb-4">Media</h1>
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('[MediaPage] Error loading media page:', error);
    return (
      <main className="min-h-screen  text-black">
        <div className="container mx-auto py-12 px-2">
          <h1 className="text-2xl font-bold  pb-4">Media</h1>
          <p>Media page content will be managed through Prismic CMS.</p>
        </div>
      </main>
    );
  }
} 