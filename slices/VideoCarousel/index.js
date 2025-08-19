'use client';

import React, { useState, useEffect, useRef } from 'react';

function getEmbedUrl(url) {
  if (!url) return null;
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:[^\/]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (yt) {
    const videoId = yt[1];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}`;
  }
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
  if (vimeo) {
    const videoId = vimeo[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  // Fallback
  return url;
}

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="square"/>
  </svg>
);

export default function VideoCarousel({ slice }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const items = slice.items || [];
  const messageHandlerRef = useRef(null);

  const nextSlide = () => {
    if (items.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      setIsPlaying(false); // Reset playing state when changing videos
    }
  };

  const prevSlide = () => {
    if (items.length > 1) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
      setIsPlaying(false); // Reset playing state when changing videos
    }
  };

  // Function to auto-play the current video
  const autoPlayCurrentVideo = () => {
    const iframe = document.querySelector('.aspect-video iframe');
    if (iframe) {
      const src = iframe.src;
      
      if (src.includes('youtube.com/embed/')) {
        const videoId = src.match(/embed\/([^?]+)/)?.[1];
        if (videoId) {
          const autoplayUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`;
          iframe.src = autoplayUrl;
          setIsPlaying(true);
        }
      } else if (src.includes('player.vimeo.com/video/')) {
        const videoId = src.match(/video\/(\d+)/)?.[1];
        if (videoId) {
          const autoplayUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
          iframe.src = autoplayUrl;
          setIsPlaying(true);
        }
      }
    }
  };

  // Function to handle video end and auto-advance
  const handleVideoEnd = () => {
    console.log('Video ended, auto-advancing to next video');
    // Reset the button to play state when video ends
    setIsPlaying(false);
    
    if (items.length > 1) {
      // Add a small delay before advancing to the next video
      setTimeout(() => {
        nextSlide();
        // Auto-play the next video after a brief delay
        setTimeout(() => {
          autoPlayCurrentVideo();
        }, 200);
      }, 1000); // 1 second delay before advancing
    }
  };

  // Clean up event listeners when component unmounts or video changes
  useEffect(() => {
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
      }
    };
  }, [currentIndex]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos available.</p>
      </div>
    );
  }

  const item = items[currentIndex];
  const embedUrl = getEmbedUrl(item.video_url);

  return (
    <section className="w-full">
      <div className="container mx-auto">

        <div className="max-w-3xl mx-auto">
          {/* Video Card */}
          <div className="bg-white overflow-hidden w-full">
            <div className="aspect-video w-full">
              {embedUrl && (
                <iframe
                  src={embedUrl}
                  title={`Video ${currentIndex + 1}`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  onLoad={() => {
                    console.log('Iframe loaded, setting up event listeners');
                    
                    // Remove previous event listener if it exists
                    if (messageHandlerRef.current) {
                      window.removeEventListener('message', messageHandlerRef.current);
                    }
                    
                    // Add event listeners for video end detection
                    const handleMessage = (event) => {
                      console.log('Message received:', event.origin, event.data);
                      
                      if (event.origin !== 'https://www.youtube.com' && 
                          event.origin !== 'https://player.vimeo.com') {
                        return;
                      }
                      
                      // YouTube end event
                      if (event.data && event.data.event === 'onStateChange' && event.data.info === 0) {
                        console.log('YouTube video ended');
                        handleVideoEnd();
                      }
                      
                      // Vimeo end event
                      if (event.data && event.data.event === 'finish') {
                        console.log('Vimeo video ended');
                        handleVideoEnd();
                      }
                    };
                    
                    window.addEventListener('message', handleMessage);
                    messageHandlerRef.current = handleMessage;
                  }}
                />
              )}
            </div>
            {item.caption && (
              <div className="p-4 text-center">
                <h3 className="text-xl font-bold text-black">{item.caption}</h3>
              </div>
            )}

            {/* Navigation with Arrows and Dots */}
            {items.length > 1 && (
              <div className="flex items-center justify-between px-4 pb-4">
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="w-8 flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors p-1"
                  aria-label="Previous"
                >
                  <ArrowLeft />
                </button>

                {/* Center Section with Dots and Play/Stop Button */}
                <div className="flex items-center justify-center flex-1 mx-4 relative">
                  {/* Left Dots - Evenly spread */}
                  <div className="flex space-x-3 mr-12">
                    {items.slice(0, Math.ceil(items.length / 2)).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${idx === currentIndex ? 'bg-black scale-140' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Play/Stop Button - Centered */}
                  <button
                    onClick={() => {
                      // Get the current video iframe
                      const iframe = document.querySelector('.aspect-video iframe');
                      if (iframe) {
                        const src = iframe.src;
                        
                        if (!isPlaying) {
                          // Play functionality
                          autoPlayCurrentVideo();
                        } else {
                          // Stop functionality
                          if (src.includes('youtube.com/embed/')) {
                            const videoId = src.match(/embed\/([^?]+)/)?.[1];
                            if (videoId) {
                              const pauseUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
                              iframe.src = pauseUrl;
                              setIsPlaying(false);
                            }
                          } else if (src.includes('player.vimeo.com/video/')) {
                            const videoId = src.match(/video\/(\d+)/)?.[1];
                            if (videoId) {
                              const pauseUrl = `https://player.vimeo.com/video/${videoId}`;
                              iframe.src = pauseUrl;
                              setIsPlaying(false);
                            }
                          }
                        }
                      }
                    }}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    aria-label={isPlaying ? "Stop video" : "Play video"}
                  >
                    {isPlaying ? (
                      // Stop icon
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6H18V18H6V6Z" fill="currentColor"/>
                      </svg>
                    ) : (
                      // Play icon
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                  
                  {/* Right Dots - Evenly spread */}
                  <div className="flex space-x-3 ml-12">
                    {items.slice(Math.ceil(items.length / 2)).map((_, idx) => (
                      <button
                        key={Math.ceil(items.length / 2) + idx}
                        onClick={() => setCurrentIndex(Math.ceil(items.length / 2) + idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${Math.ceil(items.length / 2) + idx === currentIndex ? 'bg-black scale-140' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${Math.ceil(items.length / 2) + idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="w-8 flex items-center justify-center focus:outline-none hover:bg-gray-800 transition-colors p-1"
                  aria-label="Next"
                >
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
} 