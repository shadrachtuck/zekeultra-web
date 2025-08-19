"use client";
import { useEffect, useRef, useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export default function HeroSection({ slice }) {
  const { primary } = slice;
  const { title, subtitle } = primary;

  return (
    <>
      <style jsx>{`
        .hero-video-container:hover video::-webkit-media-controls {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-panel {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-play-button {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-timeline {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-current-time-display {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-time-remaining-display {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-mute-button {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-toggle-closed-captions-button {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-volume-slider {
          display: none !important;
        }
        
        .hero-video-container:hover video::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
        
        /* Hide controls by default and show on hover for iframes */
        .hero-video-container iframe {
          pointer-events: none;
        }
        
        .hero-video-container:hover iframe {
          pointer-events: auto;
        }

        /* Color inversion effects for hero content */
        .hero-blend {
          mix-blend-mode: difference;
        }

        .hero-blend:hover {
          mix-blend-mode: difference;
        }

        /* Ensure text remains readable with blend modes */
        .hero-content {
          position: relative;
        }

        .hero-content h1,
        .hero-content div {
          mix-blend-mode: difference;
          opacity: 1;
        }

        .hero-buttons a {
          mix-blend-mode: difference;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .hero-buttons a:hover {
          mix-blend-mode: difference;
          transform: scale(1.05);
        }
      `}</style>
      
      <section className="relative h-screen flex items-center justify-center overflow-visible bg-transparent">
        {/* Background Video */}
        
        {/* Content */}
        <div className="hero-content text-center px-4 max-w-4xl mx-auto bg-transparent">
          {title && (
            <h1 className="font-brigends text-hero font-bold tracking-tight mb-6 leading-none">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <div className="font-zekeultra-body text-subtitle font-medium max-w-2xl mx-auto">
              {subtitle}
            </div>
          )}
          
          {/* Call to action buttons */}
          <div className="hero-buttons mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/music"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-zekeultra-body font-semibold border-2 border-white"
            >
              Listen Now
            </a>
            <a
              href="/tour"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-black font-zekeultra-body font-semibold"
            >
              See Tour Dates
            </a>
          </div>
        </div>
        
      </section>
    </>
  );
} 