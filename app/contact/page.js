import { createClient } from '../../lib/prismic';
import { PrismicRichText } from '@prismicio/react';

export default async function ContactPage() {
  const client = createClient();
  
  try {
    const page = await client.getByUID('page', 'contact');
    const settings = await client.getSingle('site_settings');
    
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{page.data.title}</h1>
          
          <div className="prose prose-lg max-w-none mb-8">
            <PrismicRichText field={page.data.body} />
          </div>
          
          {settings.data.contact_email && (
            <div className="mt-8 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="mb-4">Email: <a href={`mailto:${settings.data.contact_email}`} className="text-blue-600 hover:underline">{settings.data.contact_email}</a></p>
              
              {settings.data.social_links && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    {settings.data.social_links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contact</h1>
          <p>Contact page content will be managed through Prismic CMS.</p>
        </div>
      </div>
    );
  }
} 