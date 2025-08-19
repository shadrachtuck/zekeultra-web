"use client";
import { useRef, useEffect, useState } from 'react';
import { createClient } from '../../lib/prismic';

export default function BackgroundVideo() {
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const client = createClient();
        const siteSettings = await client.getSingle('site_settings');
        const url = siteSettings?.data?.background_video_url;
        setVideoUrl(url || null);
      } catch (e) {
        setVideoUrl(null);
      }
    }
    fetchVideoUrl();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      className="w-full h-auto object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-hidden="true"
    />
  );
} 