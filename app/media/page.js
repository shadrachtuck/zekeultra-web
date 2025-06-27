import { createClient } from '../../lib/prismic';
import { PrismicRichText } from '@prismicio/react';

export default async function MediaPage() {
  const client = createClient();
  
  try {
    const page = await client.getByUID('page', 'media');
    
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{page.data.title}</h1>
          
          <div className="prose prose-lg max-w-none">
            <PrismicRichText field={page.data.body} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Media</h1>
          <p>Media page content will be managed through Prismic CMS.</p>
        </div>
      </div>
    );
  }
} 