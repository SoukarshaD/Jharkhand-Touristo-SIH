import React, { useEffect, useMemo, useState } from 'react';
import { fetchDestinations } from '../api/api';

function haversine(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function LiveInfo() {
  const [pos, setPos] = useState(null);
  const [addr, setAddr] = useState(null);
  const [spots, setSpots] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setError(e.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    (async () => {
      try { setSpots(await fetchDestinations()); } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!pos) return;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`;
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(r => r.json())
      .then(j => setAddr(j.address))
      .catch(() => setAddr(null));
  }, [pos]);

  const nearest = useMemo(() => {
    if (!pos || !Array.isArray(spots)) return [];
    const withDist = spots
      .filter(s => s?.coordinates && typeof s.coordinates.lat === 'number' && typeof s.coordinates.lng === 'number')
      .map(s => ({ spot: s, dist: haversine(pos, s.coordinates) }))
      .sort((a,b) => a.dist - b.dist)
      .slice(0, 5);
    return withDist;
  }, [pos, spots]);

  const transitUrl = pos ? `https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}&travelmode=transit` : '#';

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mt-6">Live Transport & Location</h1>
      {!pos ? (
        <p className="mt-4">Getting your location… {error && <span className="text-red-500">({error})</span>}</p>
      ) : (
        <div className="card mt-4"><div className="card-body">
          <h3>Your location</h3>
          <p style={{marginTop:6}}>Lat: {pos.lat.toFixed(5)} · Lng: {pos.lng.toFixed(5)}</p>
          {addr && <p style={{marginTop:6}}>{[addr.city, addr.state, addr.country].filter(Boolean).join(', ')}</p>}
          <a className="btn mt-4" href={transitUrl} target="_blank" rel="noreferrer">Open Transit Directions</a>
        </div></div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-bold">Nearest Destinations</h3>
        <div className="grid">
          {nearest.map(({spot, dist}) => (
            <div key={spot._id} className="card">
              <img src={spot.image || spot.images?.[0]} alt={spot.name} />
              <div className="card-body">
                <div>
                  <h3>{spot.name}</h3>
                  <p>{spot.location}</p>
                  <p style={{marginTop:6}}>{dist.toFixed(1)} km away</p>
                </div>
                <div className="card-actions">
                  {spot.coordinates && (
                    <a className="btn" href={`https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}`}
                       target="_blank" rel="noreferrer">Directions</a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {pos && nearest.length === 0 && <p>No nearby destinations found.</p>}
        </div>
      </div>
    </div>
  );
}
