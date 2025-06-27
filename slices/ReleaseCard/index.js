import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export default function ReleaseCard({ slice }) {
  const release = slice.primary;
  return (
    <div className="border p-4">
      <div className="relative aspect-square mb-4">
        <PrismicNextImage field={release.cover_image} fill style={{ objectFit: 'cover' }} />
      </div>
      <h2 className="text-xl font-medium mb-2">{release.title}</h2>
      <div className="text-sm opacity-75 mb-2">
        {release.release_date && new Date(release.release_date).getFullYear()}
      </div>
      <div className="line-clamp-3">
        <PrismicRichText field={release.description} />
      </div>
      {slice.items && slice.items.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Links</h3>
          <div className="flex flex-wrap gap-2">
            {slice.items.map((item, idx) => (
              <a key={idx} href={item.url?.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 border rounded hover:bg-black hover:text-white transition-colors">
                {item.platform_name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 