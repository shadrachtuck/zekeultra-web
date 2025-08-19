import { formatEvent } from '../../lib/bandsintown';

export default function BandsintownEventItem({ event, isPast = false }) {
  const formattedEvent = formatEvent(event);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTicketStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'text-green-400';
      case 'unavailable':
        return 'text-red-400';
      case 'sold out':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getTicketStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'Tickets Available';
      case 'unavailable':
        return 'Tickets Unavailable';
      case 'sold out':
        return 'Sold Out';
      default:
        return 'Check Availability';
    }
  };

  // Generate title from artist name and venue if no title
  const getEventTitle = () => {
    if (formattedEvent.title && formattedEvent.title !== 'Untitled Event') {
      return formattedEvent.title;
    }
    
    const artistName = formattedEvent.artist?.name || 'ZekeUltra';
    const venueName = formattedEvent.venue.name;
    return `${artistName} at ${venueName}`;
  };

  return (
    <div className={`border p-6 ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{getEventTitle()}</h3>
          
          <div className="text-gray-300 mb-2">
            <div className="font-medium">{formattedEvent.venue.name}</div>
            <div className="text-sm">
              {[
                formattedEvent.venue.city,
                formattedEvent.venue.region,
                formattedEvent.venue.country
              ].filter(Boolean).join(', ')}
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            <div>{formatDate(formattedEvent.date)}</div>
            <div>Doors: {formatTime(formattedEvent.date)}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className={`text-sm font-medium ${getTicketStatusColor(formattedEvent.ticketStatus)}`}>
            {getTicketStatusText(formattedEvent.ticketStatus)}
          </div>
          
          {formattedEvent.ticketUrl && (
            <a
              href={formattedEvent.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 font-medium transition-colors ${
                isPast 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              onClick={isPast ? (e) => e.preventDefault() : undefined}
            >
              {isPast ? 'Event Passed' : 'Get Tickets'}
            </a>
          )}
        </div>
      </div>
      
      {formattedEvent.lineup && formattedEvent.lineup.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-1">Lineup:</div>
          <div className="text-sm">
            {formattedEvent.lineup.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
} 