import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Link from 'next/link';

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

export default function FeaturedReleases({ slice }) {
  return (
    <section className="py-16 px-2">
      <div className="max-w-6xl mx-auto">
        {slice.primary.section_title && (
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 pb-2">
            {slice.primary.section_title}
          </h2>
        )}
        
        {slice.primary.section_description && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <PrismicRichText field={slice.primary.section_description} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {slice.items.map((item, idx) => {
            const slug = generateSlug(item.title);

            return (
              <div key={idx} className="group">
                <div className="border border-black bg-transparent p-2">
                  <Link href={`/releases/${slug}`} className="block hover:opacity-90 transition-opacity">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                      <PrismicNextImage
                        field={item.cover_image}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    
                    {item.release_date && (
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(item.release_date).getFullYear()}
                      </p>
                    )}
                    
                    {item.description && (
                      <div className="text-gray-700 mb-4 line-clamp-3">
                        <PrismicRichText 
                          field={item.description}
                          components={{
                            hyperlink: ({ children }) => children, // Prevent links in description
                          }}
                        />
                      </div>
                    )}
                  </Link>
                  
                  {item.platform_name && item.platform_url?.url && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <a
                        href={item.platform_url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-black text-sm rounded-full hover:bg-gray-800 transition-colors"
                      >
                        {item.platform_name}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}