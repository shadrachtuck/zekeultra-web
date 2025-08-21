import { PrismicRichText } from '@prismicio/react';

export default function EventItem({ event, isPast = false }) {
  const eventDate = new Date(event.data.date);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className={`border p-6 ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <div className="text-lg font-medium">
            {formatDate(eventDate)}
          </div>
          <h3 className="text-xl font-bold mt-1">{event.data.venue}</h3>
          <div className="mt-1">{event.data.location}</div>
        </div>
        
        {!isPast && event.data.ticket_link && (
          <div className="flex items-start">
            <a 
              href={event.data.ticket_link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-2 border hover: hover:text-black transition-colors"
            >
              Tickets
            </a>
          </div>
        )}
      </div>
      
      {event.data.description && (
        <div className="mt-4">
          <PrismicRichText field={event.data.description} />
        </div>
      )}
    </div>
  );
} 