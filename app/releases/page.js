// app/releases/page.js
import { createClient } from '../../lib/prismic';
import { SliceZone } from '@prismicio/react';
import { components } from '../../slices';

export default async function ReleasesPage() {
  const client = createClient();
  
  try {
    const releasesPage = await client.getSingle('releases');

    return (
      <div className="container mx-auto py-12 px-2">
        <h1 className="text-2xl font-bold pb-4">Releases</h1>
        
        {releasesPage ? (
          <SliceZone slices={releasesPage.data.slices} components={components} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl">No releases available at this time.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching releases page:', error);
    return (
      <div className="container mx-auto py-12 px-2">
        <h1 className="text-2xl font-bold pb-4">Releases</h1>
        
        <div className="text-center py-12">
          <p className="text-xl">Releases will be available soon.</p>
        </div>
      </div>
    );
  }
}