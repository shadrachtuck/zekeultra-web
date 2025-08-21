import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';

export default function ReleaseCard({ release }) {
  // Generate slug from title if uid is not available or if we want to use title
  const getSlug = () => {
    if (release.uid) {
      return release.uid;
    }
    // Fallback to generating slug from title
    return release.data.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
  };

  return (
    <div className="group">
      <div className="border border-black bg-transparent p-2">
        <Link href={`/releases/${getSlug()}`} className="block hover:opacity-90 transition-opacity">
          <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
            <PrismicNextImage 
              field={release.data.cover_image}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <h2 className="text-xl font-medium mb-2">{release.data.title}</h2>
          
          <div className="text-sm opacity-75 mb-2">
            {new Date(release.data.release_date).getFullYear()}
          </div>
          
          <div className="line-clamp-3">
            <PrismicRichText 
              field={release.data.description}
              components={{
                hyperlink: ({ children }) => children, // Prevent links in description
              }}
            />
          </div>
        </Link>
      </div>
    </div>
  );
} 