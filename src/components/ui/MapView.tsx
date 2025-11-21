"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Property {
  id: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  historyScore: string;
  incidents: { id: string; type: string }[];
}

interface MapViewProps {
  properties: Property[];
  mapboxToken: string;
}

export default function MapView({ properties, mapboxToken }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;

    // Initialize map centered on Vancouver
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-123.1207, 49.2827], // Vancouver
      zoom: 11,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !mapLoaded || properties.length === 0) return;

    // Remove existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    // Add markers for each property
    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      // Create marker color based on history score
      let color = "#64748b"; // gray for CLEAN
      if (property.historyScore === "POSSIBLE") color = "#f59e0b"; // orange
      if (property.historyScore === "CONFIRMED") color = "#dc2626"; // red

      // Create marker element
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = color;
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="color: #000; padding: 8px;">
          <strong>${property.address}</strong><br/>
          <span style="color: #666;">${property.city}</span><br/>
          <span style="color: ${color}; font-weight: bold;">
            ${property.historyScore}
          </span><br/>
          <span style="color: #666;">
            ${property.incidents.length} incident(s)
          </span><br/>
          <a href="/property/${property.id}" style="color: #dc2626; text-decoration: underline;">
            View Details
          </a>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Fit bounds to show all markers
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      properties.forEach((property) => {
        if (property.latitude && property.longitude) {
          bounds.extend([property.longitude, property.latitude]);
        }
      });
      map.current?.fitBounds(bounds, { padding: 50 });
    }
  }, [mapLoaded, properties]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!mapboxToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <p className="text-muted">Mapbox token not configured</p>
        </div>
      )}
    </div>
  );
}
