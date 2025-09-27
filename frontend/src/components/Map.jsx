import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ coordinates, name, userLocation, markers, center, zoom }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Initialize the map on the element with the ID 'map'
    mapRef.current = L.map('map').setView(center || [23.36, 85.33], zoom || 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // --- LOGIC FOR MARKERS (no changes here) ---
    if (markers && markers.length > 0) {
      const markerBounds = L.latLngBounds();
      markers.forEach(marker => {
        if (marker.coordinates?.lat && marker.coordinates?.lng) {
            const markerCoords = [marker.coordinates.lat, marker.coordinates.lng];
            L.marker(markerCoords).addTo(mapRef.current).bindPopup(`<b>${marker.name}</b>`);
            markerBounds.extend(markerCoords);
        }
      });
      if(markerBounds.isValid()) {
        mapRef.current.fitBounds(markerBounds, { padding: [50, 50] });
      }
    }
    // --- LOGIC FOR A SINGLE DESTINATION ---
    else if (coordinates) {
      const mapCoords = [coordinates.lat, coordinates.lng];
      L.marker(mapCoords).addTo(mapRef.current).bindPopup(`<b>${name}</b><br><a href="http://googleusercontent.com/maps.google.com/search/?api=1&query=${coordinates.lat},${coordinates.lng}" target="_blank" rel="noopener noreferrer">Get Directions</a>`);

      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng]).addTo(mapRef.current).bindPopup("<b>Your Location</b>");
        const bounds = L.latLngBounds([userLocation.lat, userLocation.lng], mapCoords);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapRef.current.setView(mapCoords, 13);
      }
    }
    
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

  }, [coordinates, name, userLocation, markers, center, zoom]);

  // Use id="map" and remove the className and ref
  return <div id="map"></div>;
}