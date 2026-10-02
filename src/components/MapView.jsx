import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Layers, Navigation } from 'lucide-react';
import { getOpeningStatus } from '../utils/openingStatus.js';

export default function MapView({
  userLocation,
  libraries,
  selectedLibrary,
  onSelectLibrary,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation ? userLocation.lat : 12.9716;
      const initialLon = userLocation ? userLocation.lon : 77.5946;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="user-pulse-dot">
          <div class="user-pulse-ring"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lon], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    const accuracyText = userLocation.accuracy ? `<br/><span style="color:#64748b;font-size:11px">Accuracy: ±${Math.round(userLocation.accuracy)}m</span>` : '';
    userMarker.bindPopup(`
      <div style="font-family:system-ui, sans-serif; padding: 2px;">
        <strong style="color:#1e293b;">📍 Your Current Location</strong>
        ${accuracyText}
      </div>
    `);

    userMarkerRef.current = userMarker;
  }, [userLocation]);

  // Update Library Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing library markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lon]);
    }

    libraries.forEach((library) => {
      const isSelected = selectedLibrary && selectedLibrary.id === library.id;

      const icon = L.divIcon({
        className: `custom-library-marker ${isSelected ? 'active-marker' : ''}`,
        html: `
          <div class="library-pin-bubble">
            <div class="library-pin-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                <path d="M6 2v20"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([library.lat, library.lon], { icon }).addTo(map);

      const opening = getOpeningStatus(library.openingHours, library.isOpenNow);
      const openingBadge = opening
        ? `<div style="font-size:11px; font-weight:600; color:${opening.status === 'open' ? '#15803d' : '#be123c'}; margin-top:2px;">
            ${opening.status === 'open' ? '🟢 Open now' : '🔴 Closed'}
           </div>`
        : '';

      const popupHtml = `
        <div style="font-family:system-ui, sans-serif; min-width: 190px; max-width: 250px; padding: 2px;">
          <div style="font-size:10px; font-weight:700; color:#059669; text-transform:uppercase; letter-spacing:0.5px;">${library.libraryType || 'Library'}</div>
          <h4 style="font-weight:700; font-size:14px; margin: 3px 0; color:#0f172a; line-height:1.2;">${library.name}</h4>
          <div style="font-size:12px; font-weight:600; color:#2563eb; margin-bottom:4px;">📍 ${library.formattedDistance} away</div>
          <div style="font-size:11px; color:#475569; margin-bottom:6px; line-height:1.3;">${library.address}</div>
          ${openingBadge}
          <div style="margin-top:8px; display:flex; gap:6px;">
            <a href="${library.directionsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; flex:1; text-align:center; background:#16a34a; color:white; font-size:11px; font-weight:600; padding:5px 8px; border-radius:6px; text-decoration:none;">
              Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectLibrary(library);
      });

      markersRef.current[library.id] = marker;
      bounds.extend([library.lat, library.lon]);
    });

    // Auto fit bounds if we have elements
    if (bounds.isValid() && libraries.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [libraries, userLocation, onSelectLibrary]);

  // Center on Selected Library
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedLibrary) return;

    const marker = markersRef.current[selectedLibrary.id];
    if (marker) {
      map.setView([selectedLibrary.lat, selectedLibrary.lon], 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedLibrary]);

  // Trigger map resize recalculation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  });

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;
    map.setView([userLocation.lat, userLocation.lon], 14, { animate: true });
    if (userMarkerRef.current) {
      userMarkerRef.current.openPopup();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Floating Tools */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {userLocation && (
          <button
            onClick={handleRecenter}
            className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 rounded-xl shadow-md border border-slate-200 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Recenter on your location"
            aria-label="Recenter on your location"
          >
            <Crosshair className="w-5 h-5 text-emerald-600" />
          </button>
        )}
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
          <span className="font-medium">You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
          <span className="font-medium">Library</span>
        </div>
      </div>
    </div>
  );
}
