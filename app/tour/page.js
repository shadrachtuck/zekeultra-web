// app/tour/page.js
import { createClient } from '../../lib/prismic';
import EventItem from '../../components/ui/EventItem';

export default async function TourPage() {
  const client = createClient();
  
  try {
    // Get upcoming events
    const events = await client.getAllByType('event', {
      orderings: {
        field: 'my.event.date',
        direction: 'asc',
      }
    });

    // Filter events by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.data.date);
      return eventDate >= today;
    });

    const pastEvents = events.filter(event => {
      const eventDate = new Date(event.data.date);
      return eventDate < today;
    }).slice(0, 10); // Limit to 10 most recent past events

    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-12">Tour</h1>
        
        <div className="max-w-3xl mx-auto">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-8 mb-16">
              <h2 className="text-2xl font-medium mb-6">Upcoming Events</h2>
              {upcomingEvents.map(event => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="mb-16">
              <p className="text-xl">No upcoming events scheduled at this time.</p>
            </div>
          )}
          
          {pastEvents.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium mb-6">Past Events</h2>
              {pastEvents.map(event => (
                <EventItem key={event.id} event={event} isPast />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    // Fallback content if Prismic data is not available
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-12">Tour</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <p className="text-xl">Tour dates will be announced soon.</p>
          </div>
        </div>
      </div>
    );
  }
}
