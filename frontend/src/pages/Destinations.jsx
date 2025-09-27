import React, { useEffect, useState } from 'react';
import { fetchDestinations } from '../api/api';
import DestinationCard from '../components/DestinationCard';
import Map from '../components/Map';

export default function Destinations() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function load() {
      try {
        const data = await fetchDestinations();
        if (Array.isArray(data)) {
          setSpots(data);
        } else {
          setSpots([]);
        }
      } catch (e) {
        console.error('Error fetching destinations:', e);
        setError('Failed to load destinations. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Prepare safe markers for the map
  const markers = spots.filter(
    s =>
      s?.coordinates &&
      typeof s.coordinates.lat === 'number' &&
      typeof s.coordinates.lng === 'number'
  );

  return (
    <>
      <div className="container">
        <h1 className="text-2xl font-bold mt-6">All Destinations</h1>
        {loading ? (
          <p className="mt-4">Loading…</p>
        ) : error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : spots.length === 0 ? (
          <p className="mt-4">No destinations available right now.</p>
        ) : (
          <div className="grid">
            {spots.map(s => (
              <DestinationCard key={s._id} spot={s} />
            ))}
          </div>
        )}
        
        {/* The map is now at the bottom of the page */}
        <div className="mt-6">
          <Map center={[23.5, 85]} zoom={6} markers={markers} />
        </div>
      </div>
    </>
  );
}