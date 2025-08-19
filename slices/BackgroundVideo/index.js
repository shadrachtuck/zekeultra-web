"use client";
import { useRef, useEffect } from "react";
import { PrismicNextImage } from '@prismicio/next';

/**
 * @typedef {import("@prismicio/client").Content.BackgroundVideoSlice} BackgroundVideoSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<BackgroundVideoSlice>} BackgroundVideoProps
 * @type {import("react").FC<BackgroundVideoProps>}
 */
const BackgroundVideo = ({ slice }) => {
  const { background_video_url, video_provider, background_image } = slice.primary;

  console.log(background_video_url);

  // Helper to get the correct embed URL
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

  const videoUrl = getVideoEmbedUrl(background_video_url, video_provider);
  const isDirectVideo = video_provider !== 'youtube' && video_provider !== 'vimeo' && background_video_url;

  return (
    <>
      {/* Video Background */}
      {videoUrl && (video_provider === 'youtube' || video_provider === 'vimeo') && (
        <iframe
          src={videoUrl}
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Background Video"
          style={{ border: 0 }}
        />
      )}
      {isDirectVideo && (
        <video
          src={background_video_url}
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{ minWidth: '100vw', minHeight: '100vh', top: 0, left: 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          aria-hidden="true"
        />
      )}
      {/* Fallback Image */}
      {!videoUrl && background_image && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <PrismicNextImage
            field={background_image}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            fallbackAlt=""
          />
        </div>
      )}
    </>
  );
};

export default BackgroundVideo;
