import { PrismicNextImage } from '@prismicio/next';

export default function MediaGallery({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No media items available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div key={index} className="group">
          {item.media_type === 'Image' && item.image && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <PrismicNextImage
                field={item.image}
                fill
                style={{ objectFit: 'cover' }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                  <p className="text-sm">{item.caption}</p>
                </div>
              )}
            </div>
          )}
          
          {item.media_type === 'Video' && item.embed_code && (
            <div className="aspect-video">
              <div 
                className="w-full h-full rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: item.embed_code }} 
              />
            </div>
          )}
          
          {item.media_type === 'Audio' && item.embed_code && (
            <div className="p-4 border rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: item.embed_code }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 