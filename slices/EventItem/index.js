import { PrismicRichText } from '@prismicio/react';

export default function EventItem({ slice }) {
  const event = slice.primary;
  const eventDate = event.date ? new Date(event.date) : null;
  const formatDate = (date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <div className="border p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <div className="text-lg font-medium">
            {eventDate ? formatDate(eventDate) : ''}
          </div>
          <h3 className="text-xl font-bold mt-1">{event.venue}</h3>
          <div className="mt-1">{event.location}</div>
        </div>
        {event.ticket_link?.url && (
          <div className="flex items-start">
            <a href={event.ticket_link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border hover: hover:text-black transition-colors">
              Tickets
            </a>
          </div>
        )}
      </div>
      {event.description && (
        <div className="mt-4">
          <PrismicRichText field={event.description} />
        </div>
      )}
    </div>
  );
} 