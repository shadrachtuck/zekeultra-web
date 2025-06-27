import { PrismicNextImage } from '@prismicio/next';

export default function MediaGallery({ slice }) {
  return (
    <div className="my-8">
      {slice.primary.gallery_title && (
        <h2 className="text-2xl font-bold mb-6">{slice.primary.gallery_title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slice.items.map((item, idx) => (
          <div key={idx} className="border p-2">
            {item.media_type === 'image' && item.image && (
              <div className="relative aspect-video">
                <PrismicNextImage 
                  field={item.image} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
            )}
            {item.media_type === 'video' && item.video_url?.url && (
              <video controls className="w-full h-auto rounded">
                <source src={item.video_url.url} />
                Your browser does not support the video tag.
              </video>
            )}
            {item.media_type === 'embed' && item.embed_code && (
              <div 
                className="w-full aspect-video rounded"
                dangerouslySetInnerHTML={{ __html: item.embed_code[0]?.text || '' }} 
              />
            )}
            {item.title && <div className="mt-2 text-center font-medium">{item.title}</div>}
          </div>
        ))}
      </div>
    </div>
  );
} 