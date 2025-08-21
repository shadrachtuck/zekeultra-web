import { createClient } from '../../../lib/prismic';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CloseIcon from '../../../components/ui/CloseIcon';
import Button from '../../../components/ui/Button';

export async function generateMetadata({ params }) {
  const client = createClient();
  
  try {
    const release = await client.getByUID('release', params.slug);
    
    if (!release) {
      return {
        title: 'Release Not Found',
      };
    }
    
    return {
      title: `${release.data.title} | Music`,
      description: release.data.description?.[0]?.text || `Listen to ${release.data.title}`,
    };
  } catch (error) {
    return {
      title: 'Release Not Found',
    };
  }
}

export default async function ReleasePage({ params }) {
  const client = createClient();
  
  try {
    const release = await client.getByUID('release', params.slug);
    
    if (!release) {
      notFound();
    }
    
    return (
      <div className="container mx-auto page-container relative">
        <main className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="aspect-square relative">
                  <PrismicNextImage 
                    field={release.data.cover_image}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-8">
                  <h1 className="text-2xl font-bold pb-4">{release.data.title}</h1>
                  <Link href="/" aria-label="Back to homepage" className="hover:opacity-60 transition-opacity">
                    <CloseIcon className="w-8 h-8" />
                  </Link>
                </div>
                
                <div className="text-lg opacity-75 mb-6">
                  {new Date(release.data.release_date).toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
                
                <div className="mb-8">
                  <PrismicRichText field={release.data.description} />
                </div>
                
                {release.data.links && release.data.links.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium mb-2">Listen/Buy</h2>
                    <div className="flex flex-wrap gap-3">
                      {release.data.links.map((link, index) => (
                        <a 
                          key={index}
                          href={link.url?.url || link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-fit p-3">
                            {link.platform_name}
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {release.data.media_items && release.data.media_items.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-medium mb-6">Media</h2>
                <div className="space-y-8">
                  {release.data.media_items.map((item, index) => (
                    <div key={index} className="aspect-video">
                      <div dangerouslySetInnerHTML={{ __html: item.embed_code }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
    
  } catch (error) {
    notFound();
  }
} 