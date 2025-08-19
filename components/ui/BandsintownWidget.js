"use client";
import { useEffect, useRef } from "react";

export default function BandsintownWidget({ artistName, appId }) {
  const widgetRef = useRef(null);

  // Debug log for props
  console.log('[BandsintownWidget] artistName:', artistName, 'appId:', appId);

  useEffect(() => {
    if (!document.getElementById("bit-widget-script")) {
      const script = document.createElement("script");
      script.id = "bit-widget-script";
      script.src = "https://widgetv3.bandsintown.com/main.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div ref={widgetRef} className="w-full flex justify-center py-8">
      <a
        className="bit-widget-initializer"
        data-artist-name={artistName}
        data-app-id={appId}
        data-background-color="rgba(0,0,0,1)"
        data-separator-color="rgba(255,255,255,1)"
        data-text-color="rgba(255,255,255,1)"
        data-font="Helvetica"
        data-auto-style="true"
        data-button-label-capitalization="uppercase"
        data-header-capitalization="uppercase"
        data-location-capitalization="uppercase"
        data-venue-capitalization="uppercase"
        data-display-local-dates="true"
        data-local-dates-position="tab"
        data-display-past-dates="true"
        data-display-details="false"
        data-display-lineup="false"
        data-display-start-time="false"
        data-social-share-icon="false"
        data-display-limit="all"
        data-date-format="MMM. D, YYYY"
        data-date-orientation="horizontal"
        data-date-border-color="#4A4A4A"
        data-date-border-width="1px"
        data-date-capitalization="capitalize"
        data-date-border-radius="0px"
        data-event-ticket-cta-size="medium"
        data-event-custom-ticket-text=""
        data-event-ticket-text="TICKETS"
        data-event-ticket-icon="false"
        data-event-ticket-cta-text-color="rgba(255,255,255,1)"
        data-event-ticket-cta-bg-color="rgba(74,74,74,1)"
        data-event-ticket-cta-border-color="rgba(74,74,74,1)"
        data-event-ticket-cta-border-width="0px"
        data-event-ticket-cta-border-radius="0px"
        data-sold-out-button-text-color="rgba(255,255,255,1)"
        data-sold-out-button-background-color="rgba(74,74,74,1)"
        data-sold-out-button-border-color="rgba(74,74,74,1)"
        data-sold-out-button-clickable="true"
        data-event-rsvp-position="left"
        data-event-rsvp-cta-size="medium"
        data-event-rsvp-only-show-icon="false"
        data-event-rsvp-text="RSVP"
        data-event-rsvp-icon="false"
        data-event-rsvp-cta-text-color="rgba(74,74,74,1)"
        data-event-rsvp-cta-bg-color="rgba(255,255,255,1)"
        data-event-rsvp-cta-border-color="rgba(74,74,74,1)"
        data-event-rsvp-cta-border-width="1px"
        data-event-rsvp-cta-border-radius="0px"
        data-follow-section-position="top"
        data-follow-section-alignment="center"
        data-follow-section-header-text="Get updates on new shows, new music, and more"
        data-follow-section-cta-size="medium"
        data-follow-section-cta-text="FOLLOW"
        data-follow-section-cta-icon="false"
        data-follow-section-cta-text-color="rgba(255,255,255,1)"
        data-follow-section-cta-bg-color="rgba(74,74,74,1)"
        data-follow-section-cta-border-color="rgba(74,74,74,1)"
        data-follow-section-cta-border-width="0px"
        data-follow-section-cta-border-radius="0px"
        data-play-my-city-position="bottom"
        data-play-my-city-alignment="center"
        data-play-my-city-header-text="Don't see a show near you?"
        data-play-my-city-cta-size="medium"
        data-play-my-city-cta-text="REQUEST A SHOW"
        data-play-my-city-cta-icon="false"
        data-play-my-city-cta-text-color="rgba(255,255,255,1)"
        data-play-my-city-cta-bg-color="rgba(74,74,74,1)"
        data-play-my-city-cta-border-color="rgba(74,74,74,1)"
        data-play-my-city-cta-border-width="0px"
        data-play-my-city-cta-border-radius="0px"
        data-language="en"
        data-layout-breakpoint="900"
        data-bit-logo-position="bottomRight"
        data-bit-logo-color="rgba(255,255,255,1)"
      ></a>
    </div>
  );
} 