'use client';

import React from 'react';

// Create a wrapper component that handles the Behold widget
function BeholdWidgetWrapper({ feedId, onLoad }) {
  const widgetRef = React.useRef(null);

  React.useEffect(() => {
    if (!widgetRef.current) return;

    // Create the behold-widget element
    const widget = document.createElement('behold-widget');
    widget.setAttribute('feed-id', feedId);
    
    // Add event listener for load
    widget.addEventListener('load', () => {
      if (onLoad) onLoad();
    });

    // Clear and append
    widgetRef.current.innerHTML = '';
    widgetRef.current.appendChild(widget);

    // Load the script if not already loaded
    if (!document.querySelector('[src="https://w.behold.so/widget.js"]') && !customElements.get('behold-widget')) {
      const script = document.createElement('script');
      script.src = 'https://w.behold.so/widget.js';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, [feedId, onLoad]);

  return <div ref={widgetRef} className="w-full" />;
}

export default function InstagramGallery({ slice }) {
  // Extract feed ID from the embed code
  let feedId = '';
  
  if (slice.primary.embed_code && Array.isArray(slice.primary.embed_code)) {
    // Look for the feed-id in the embed code
    const embedText = slice.primary.embed_code
      .map(item => item.text || '')
      .join('');
    
    const feedIdMatch = embedText.match(/feed-id="([^"]+)"/);
    if (feedIdMatch) {
      feedId = feedIdMatch[1];
    }
  }
  
  return (
    <section className="w-full py-12">
      {slice.primary.instagram_username && (
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          {slice.primary.instagram_username}
        </h2>
      )}
      
      {feedId ? (
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <BeholdWidgetWrapper 
              feedId={feedId}
              onLoad={() => console.log('Instagram feed loaded!')}
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>Instagram gallery coming soon.</p>
          <p className="text-sm mt-2">No feed ID found in embed code.</p>
        </div>
      )}
    </section>
  );
} 