'use client';

import { useState } from 'react';
import { PrismicNextImage } from '@prismicio/next';

export default function MediaGallery({ slice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = slice.items || [];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No media items available.</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {slice.primary.gallery_title && (
        <h2 className="text-2xl font-bold mb-6 pb-2">{slice.primary.gallery_title}</h2>
      )}
      
      {/* Desktop Grid View */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="border p-2">
            {item.media_type === 'image' && item.image && (
              <div className="relative aspect-video">
                <PrismicNextImage 
                  field={item.image} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx === 0}
                />
              </div>
            )}
            {item.media_type === 'video' && item.video_url?.url && (
              <div className="aspect-video">
                <video controls className="w-full h-full rounded object-cover">
                  <source src={item.video_url.url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {item.media_type === 'embed' && item.embed_code && (
              <div 
                className="w-full aspect-video rounded overflow-hidden"
                dangerouslySetInnerHTML={{ __html: item.embed_code[0]?.text || '' }} 
              />
            )}
            {item.title && <div className="mt-2 text-center font-medium">{item.title}</div>}
          </div>
        ))}
      </div>

      {/* Tablet Grid View */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="border p-2">
            {item.media_type === 'image' && item.image && (
              <div className="relative aspect-video">
                <PrismicNextImage 
                  field={item.image} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx === 0}
                />
              </div>
            )}
            {item.media_type === 'video' && item.video_url?.url && (
              <div className="aspect-video">
                <video controls className="w-full h-full rounded object-cover">
                  <source src={item.video_url.url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {item.media_type === 'embed' && item.embed_code && (
              <div 
                className="w-full aspect-video rounded overflow-hidden"
                dangerouslySetInnerHTML={{ __html: item.embed_code[0]?.text || '' }} 
              />
            )}
            {item.title && <div className="mt-2 text-center font-medium">{item.title}</div>}
          </div>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className="md:hidden">
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {items.map((item, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-2">
                  <div className="border p-2">
                    {item.media_type === 'image' && item.image && (
                      <div className="relative aspect-video">
                        <PrismicNextImage 
                          field={item.image} 
                          fill 
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={idx === 0}
                        />
                      </div>
                    )}
                    {item.media_type === 'video' && item.video_url?.url && (
                      <div className="aspect-video">
                        <video controls className="w-full h-full rounded object-cover">
                          <source src={item.video_url.url} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                    {item.media_type === 'embed' && item.embed_code && (
                      <div 
                        className="w-full aspect-video rounded overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: item.embed_code[0]?.text || '' }} 
                      />
                    )}
                    {item.title && <div className="mt-2 text-center font-medium">{item.title}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-opacity-75 p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 z-10"
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M19 12H5M12 19L5 12L12 5" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-opacity-75 p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 z-10"
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M5 12H19M12 5L19 12L12 19" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {items.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    idx === currentIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 