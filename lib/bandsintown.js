// lib/bandsintown.js
const BANDSINTOWN_API_BASE = 'https://rest.bandsintown.com';

/**
 * Fetch events for an artist from Bandsintown API
 * @param {string} artistName - The artist name to search for
 * @param {string} appId - Your Bandsintown app ID (optional)
 * @returns {Promise<Array>} Array of events
 */
export async function getArtistEvents(artistName, appId = null) {
  try {
    const encodedArtistName = encodeURIComponent(artistName);
    const url = `${BANDSINTOWN_API_BASE}/artists/${encodedArtistName}/events`;
    
    const params = new URLSearchParams();
    if (appId) {
      params.append('app_id', appId);
    }
    
    const response = await fetch(`${url}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Bandsintown API error: ${response.status}`);
    }
    
    const events = await response.json();
    return events || [];
  } catch (error) {
    console.error('Error fetching Bandsintown events:', error);
    return [];
  }
}

/**
 * Get upcoming events (events from today onwards)
 * @param {Array} events - Array of events from Bandsintown
 * @returns {Array} Filtered upcoming events
 */
export function getUpcomingEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return events.filter(event => {
    const eventDate = new Date(event.datetime);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

/**
 * Get past events (events before today)
 * @param {Array} events - Array of events from Bandsintown
 * @param {number} limit - Maximum number of past events to return
 * @returns {Array} Filtered past events
 */
export function getPastEvents(events, limit = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return events.filter(event => {
    const eventDate = new Date(event.datetime);
    return eventDate < today;
  })
  .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
  .slice(0, limit);
}

/**
 * Format event data for display
 * @param {Object} event - Raw event from Bandsintown API
 * @returns {Object} Formatted event data
 */
export function formatEvent(event) {
  return {
    id: event.id,
    title: event.title || 'Untitled Event',
    date: event.datetime,
    venue: {
      name: event.venue?.name || 'Unknown Venue',
      city: event.venue?.city || '',
      country: event.venue?.country || '',
      region: event.venue?.region || '',
    },
    url: event.url,
    ticketStatus: event.ticket_status || 'unknown',
    ticketUrl: event.ticket_url || event.url,
    lineup: event.lineup || [],
    artist: event.artist || {},
  };
} 