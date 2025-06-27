import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';

export default function ReleaseCard({ release }) {
  return (
    <Link href={`/music/${release.uid}`} className="block hover:opacity-90 transition-opacity">
      <div className="border p-4">
        <div className="relative aspect-square mb-4">
          <PrismicNextImage 
            field={release.data.cover_image}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <h2 className="text-xl font-medium mb-2">{release.data.title}</h2>
        
        <div className="text-sm opacity-75 mb-2">
          {new Date(release.data.release_date).getFullYear()}
        </div>
        
        <div className="line-clamp-3">
          <PrismicRichText field={release.data.description} />
        </div>
      </div>
    </Link>
  );
} 