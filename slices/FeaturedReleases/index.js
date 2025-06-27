import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export default function FeaturedReleases({ slice }) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {slice.primary.section_title && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {slice.primary.section_title}
          </h2>
        )}
        
        {slice.primary.section_description && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <PrismicRichText field={slice.primary.section_description} />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {slice.items.map((item, idx) => (
            <div key={idx} className="group">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                <PrismicNextImage
                  field={item.cover_image}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
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
                  <PrismicRichText field={item.description} />
                </div>
              )}
              
              {item.platform_name && item.platform_url?.url && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={item.platform_url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                  >
                    {item.platform_name}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 