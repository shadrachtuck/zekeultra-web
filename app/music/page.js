// app/music/page.js
import { createClient } from '../../lib/prismic';
import ReleaseCard from '../../components/ui/ReleaseCard';

export default async function MusicPage() {
  const client = createClient();
  
  try {
    const releases = await client.getAllByType('release', {
      orderings: {
        field: 'my.release.release_date',
        direction: 'desc',
      },
    });

    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-12">Music</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {releases.map(release => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
        
        {releases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl">No releases available at this time.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    // Fallback content if Prismic data is not available
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-12">Music</h1>
        
        <div className="text-center py-12">
          <p className="text-xl">Music releases will be available soon.</p>
        </div>
      </div>
    );
  }
}
