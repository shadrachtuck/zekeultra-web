import { PrismicRichText } from '@prismicio/react';

export default function UpcomingEvents({ slice }) {
  return (
    <section className="py-8 md:py-16 px-2 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {slice.primary.section_title && (
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12 pb-2">
            {slice.primary.section_title}
          </h2>
        )}
        
        {slice.primary.section_description && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <PrismicRichText field={slice.primary.section_description} />
          </div>
        )}
        
        <div className="space-y-6">
          {slice.items.map((item, idx) => {
            const eventDate = item.date ? new Date(item.date) : null;
            const formatDate = (date) => {
              return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            };
            
            return (
              <div key={idx} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    {eventDate && (
                      <div className="text-lg font-medium text-gray-600 mb-1">
                        {formatDate(eventDate)}
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{item.venue}</h3>
                    <p className="text-gray-600">{item.location}</p>
                    {item.description && (
                      <div className="mt-3 text-gray-700">
                        <PrismicRichText field={item.description} />
                      </div>
                    )}
                  </div>
                  
                  {item.ticket_link?.url && (
                    <a
                      href={item.ticket_link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2  text-black rounded-full hover:bg-gray-800 transition-colors font-medium"
                    >
                      Get Tickets
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {slice.primary.view_all_link?.url && (
          <div className="text-center mt-12">
            <a
              href={slice.primary.view_all_link.url}
              className="inline-block px-8 py-3 text-black rounded-full hover: hover:text-black transition-colors font-medium"
            >
              {slice.primary.view_all_text || 'View All Events'}
            </a>
          </div>
        )}
      </div>
    </section>
  );
} 