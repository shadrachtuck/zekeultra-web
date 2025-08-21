import { createClient } from '../../lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import ContactForm from '../../components/ui/ContactForm';

export default async function ContactPage() {
  const client = createClient();
  try {
    const page = await client.getSingle('contact');
    const data = page.data;
    
    return (
      <div className="container mx-auto page-container">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 pb-4">{data.contact_title || 'Contact'}</h1>

          <ContactForm 
            contactName={data.contact_name || 'Your Name'}
            contactEmail={data.contact_email || 'Your Email'}
            contactMessage={data.contact_message || 'Your Message'}
            submitText={data.submit_button_text || 'Send Message'}
            successMessage={data.success_message || 'Message sent successfully!'}
            failureMessage={data.failure_message || 'Failed to send message. Please try again.'}
          />

          {/* Optional contact info */}
          {/* {(data.contact_email || data.contact_phone) && (
            <div className="mt-8 p-6 border-main bg-transparent text-black">
              <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
              {data.contact_email && (
                <p className="mb-2">
                  Email: <a href={`mailto:${data.contact_email}`} className="text-blue-400">
                    {data.contact_email}
                  </a>
                </p>
              )}
              {data.contact_phone && (
                <p className="mb-2">
                  Phone: <a href={`tel:${data.contact_phone}`} className="text-blue-400">
                    {data.contact_phone}
                  </a>
                </p>
              )}
            </div>
          )} */}
        </div>
      </div>
    );
  } catch (error) {
    console.error('[ContactPage] Error fetching contact page:', error);
    return (
      <div className="container mx-auto py-12 px-2">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 pb-4">Contact</h1>
          <p>Contact page content will be managed through Prismic CMS.</p>
        </div>
      </div>
    );
  }
} 