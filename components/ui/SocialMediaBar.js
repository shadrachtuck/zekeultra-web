"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/prismic';

// Checkmark icon component
const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
  </svg>
);

// Social media icons using provided PNG images with checkmark animation
const SocialIcon = ({ src, alt, onClick }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowCheckmark(true);
    
    // Wait a moment to show the checkmark, then navigate
    setTimeout(() => {
      if (onClick) {
        onClick();
      }
      // Reset checkmark after navigation
      setTimeout(() => {
        setShowCheckmark(false);
      }, 500);
    }, 800);
  };

  return (
    <div className="w-6 h-6 flex items-center justify-center cursor-pointer" onClick={handleClick}>
      {showCheckmark ? (
        <div className="animate-pulse">
          <CheckmarkIcon />
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className="w-6 h-6 object-contain"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default function SocialMediaBar() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const client = createClient();
        const settings = await client.getSingle('site_settings');
        console.log('Site settings for social bar:', settings?.data);
        setSiteSettings(settings?.data);
      } catch (error) {
        console.error('Error fetching site settings for social bar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Show loading state for debugging
  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center items-center">
            <span className="text-xs text-gray-400">Loading social links...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!siteSettings) return null;

  const socialLinks = [
    { 
      name: 'YouTube', 
      url: siteSettings.youtube_link?.url, 
      src: "/social-icons/youtube.png",
      alt: "YouTube"
    },
    { 
      name: 'Spotify', 
      url: siteSettings.spotify_link?.url, 
      src: "/social-icons/spotify.png",
      alt: "Spotify"
    },
    { 
      name: 'Instagram', 
      url: siteSettings.instagram_link?.url, 
      src: "/social-icons/instagram.png",
      alt: "Instagram"
    },
    { 
      name: 'Apple Music', 
      url: siteSettings.apple_music_link?.url, 
      src: "/social-icons/apple-music.png",
      alt: "Apple Music"
    },
    { 
      name: 'SoundCloud', 
      url: siteSettings.soundcloud_link?.url, 
      src: "/social-icons/soundcloud.png",
      alt: "SoundCloud"
    },
    { 
      name: 'Bandcamp', 
      url: siteSettings.bandcamp_link?.url, 
      src: "/social-icons/bandcamp.png",
      alt: "Bandcamp"
    },
    { 
      name: 'Tidal', 
      url: siteSettings.tidal_link?.url, 
      src: "/social-icons/tidal.png",
      alt: "Tidal"
    },
  ].filter(link => link.url); // Only show links that have URLs

  console.log('Social links found:', socialLinks.length);

  // Show a placeholder if no links are configured
  if (socialLinks.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center items-center">
            <span className="text-xs text-gray-500">Add social media links in Prismic Site Settings</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white z-30">
      <div className="container mx-auto px-4 py-3">
        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mb-2">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:opacity-60 transition-opacity"
              aria-label={link.name}
            >
              <SocialIcon 
                src={link.src} 
                alt={link.alt}
                onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
              />
            </a>
          ))}
        </div>
        
        {/* Footer Text */}
        <div className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} ZekeUltra; Mishap Creative Works 
        </div>
      </div>
    </div>
  );
}