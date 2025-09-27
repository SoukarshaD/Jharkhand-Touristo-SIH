import React, { useEffect, useState } from 'react';
import { fetchDestinations } from '../api/api';
import DestinationCard from '../components/DestinationCard';

export default function Home() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function load() {
      try {
        const data = await fetchDestinations();
        console.log('API response (destinations):', data);
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

  const scrollToExplore = () => {
    const section = document.getElementById('explore-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="hero">
        <h2>Explore Jharkhand</h2>
        <p>Waterfalls, forests, hills and culture — plan your next trip.</p>
        <button className="btn" onClick={scrollToExplore}>
          Start Exploring
        </button>
      </section>

      <div className="container">
        <h3 className="mt-6">Top Destinations</h3>
        {loading ? (
          <p className="mt-4">Loading…</p>
        ) : error ? (
          <p className="mt-4 text-red-500">{error}</p>
        ) : spots.length === 0 ? (
          <p className="mt-4">No destinations available right now.</p>
        ) : (
          <div id="explore-section" className="grid">
            {spots.map(s => (
              <DestinationCard key={s._id} spot={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}