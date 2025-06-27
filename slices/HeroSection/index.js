import { PrismicRichText, PrismicText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export default function HeroSection({ slice }) {
  const { primary } = slice;
  const { title, subtitle, background_image, background_video, video_provider } = primary;

  const getVideoEmbedUrl = (url, provider) => {
    if (!url) return null;
    
    if (provider === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1` : null;
    }
    
    if (provider === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&playsinline=1` : null;
    }
    
    return url;
  };

  const videoUrl = getVideoEmbedUrl(background_video?.url, video_provider);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={videoUrl}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Hero Background Video"
            style={{ border: 0 }}
          />
        </div>
      )}
      
      {/* Background Image Fallback */}
      {!videoUrl && background_image && (
        <div className="absolute inset-0 z-0">
          <PrismicNextImage
            field={background_image}
            fill
            className="object-cover"
            priority
            fallbackAlt="ZekeUltra"
          />
        </div>
      )}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        {title && (
          <h1 className="font-brigends text-hero font-bold tracking-tight mb-6 leading-none">
            <PrismicText field={title} />
          </h1>
        )}
        
        {subtitle && (
          <div className="font-zekeultra-body text-subtitle font-medium max-w-2xl mx-auto">
            <PrismicText field={subtitle} />
          </div>
        )}
        
        {/* Call to action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/music"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-zekeultra-body font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Listen Now
          </a>
          <a
            href="/tour"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-zekeultra-body font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-200"
          >
            See Tour Dates
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
} 