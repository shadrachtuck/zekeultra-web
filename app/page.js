import { createClient } from '../lib/prismic';
import { getArtistEvents, getUpcomingEvents } from '../lib/bandsintown';
import BandsintownEventItem from '../components/ui/BandsintownEventItem';
import BandsintownWidget from '../components/ui/BandsintownWidget';
import { SliceZone } from '@prismicio/react';
import { components } from '../slices';
import { PrismicRichText } from '@prismicio/react';
import ContactForm from '../components/ui/ContactForm';

export default async function Home() {
  const client = createClient();

  // HOMEPAGE DATA
  let homepage = null;
  try {
    homepage = await client.getSingle('homepage');
  } catch (error) {
    homepage = null;
  }

  // MEDIA SECTION
  let mediaPage = null;
  try {
    mediaPage = await client.getSingle('media_page');
  } catch (error) {
    mediaPage = null;
  }

  // RELEASES SECTION - Get from releases page
  let releasesPage = null;
  try {
    releasesPage = await client.getSingle('releases');
  } catch (error) {
    releasesPage = null;
  }

    // TOUR SECTION
    let events = [];
    let tourError = null;
    let siteSettings = null;
    try {
      siteSettings = await client.getSingle('site_settings');
      const enableBandsintown = siteSettings?.data?.enable_bandsintown ?? true;
      const bandsintownAppId = siteSettings?.data?.bandsintown_api_id || '';
      const artistName = siteSettings?.data?.bandsintown_artist_name || '';
      if (enableBandsintown && artistName && bandsintownAppId) {
        try {
          const bandsintownEvents = await getArtistEvents(artistName, bandsintownAppId);
          events = getUpcomingEvents(bandsintownEvents);
        } catch (err) {
          tourError = err;
        }
      }
    } catch (error) {
      tourError = error;
    }

  // CONTACT SECTION
  let contactData = null;
  try {
    const page = await client.getSingle('contact');
    contactData = page.data;
  } catch (error) {
    contactData = null;
  }

  return (
    <div className="py-6 md:py-12">
      {/* SLICE ZONE */}
      <SliceZone 
        slices={homepage?.data?.slices || []} 
        components={components}
      />
    </div>
  );
}
