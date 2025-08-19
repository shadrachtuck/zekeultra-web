// app/tour/page.js
import { createClient } from '../../lib/prismic';
import { getArtistEvents, getUpcomingEvents } from '../../lib/bandsintown';
import BandsintownEventItem from '../../components/ui/BandsintownEventItem';
import BandsintownWidget from '../../components/ui/BandsintownWidget';

export default async function TourPage() {
  const client = createClient();
  const siteSettings = await client.getSingle('site_settings');

  // Debug log for siteSettings.data
  console.log('[TourPage] siteSettings.data:', siteSettings.data);

  const enableBandsintown = siteSettings?.data?.enable_bandsintown ?? true;
  const bandsintownAppId = siteSettings?.data?.bandsintown_api_id || '';
  const artistName = siteSettings?.data?.bandsintown_artist_name || '';

  let events = [];
  let error = null;

  if (enableBandsintown && artistName && bandsintownAppId) {
    try {
      const bandsintownEvents = await getArtistEvents(artistName, bandsintownAppId);
      events = getUpcomingEvents(bandsintownEvents);
    } catch (err) {
      error = err;
    }
  }

  if (events.length > 0) {
    return (
      <main className="min-h-screen ">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold  pb-4">Tour</h1>
          <div className="max-w-4xl mx-auto space-y-6">
            {events.map(event => (
              <BandsintownEventItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Show no events message instead of widget
  return (
    <main className="min-h-screen ">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold  text-center pb-4">Tour Dates</h1>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-300 mb-8">No events right now. Check back soon...</p>
          {error && (
            <div className="text-red-500 text-center mt-4">
              There was a problem fetching events. Please try again later.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
