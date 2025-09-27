// frontend/src/pages/Events.jsx

import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/api';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function load() {
      try {
        const data = await fetchEvents();
        setItems(data || []);
      } catch (e) {
        console.error('Error fetching events:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const eventsByType = items.reduce((acc, event) => {
    const type = event.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(event);
    return acc;
  }, {});

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mt-6">Jharkhand Events</h1>
      {loading ? (
        <p className="mt-4">Loading…</p>
      ) : Object.keys(eventsByType).length === 0 ? (
        <p className="mt-4">No events available right now.</p>
      ) : (
        // A single grid container for ALL events
        <div className="grid">
          {Object.keys(eventsByType).map(type => (
            // Use a React.Fragment to group each section
            <React.Fragment key={type}>
              {/* This heading will span the full width of the grid */}
              <h3 
                className="text-xl font-bold" 
                style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '-1rem' }}
              >
                {type} Events
              </h3>
              {eventsByType[type].map(e => (
                <div className="card" key={e._id}>
                  <img
                    src={e.image || 'https://placehold.co/600x400?text=Event'}
                    alt={e.title}
                  />
                  <div className="card-body">
                    <div className="card-info">
                        <h3>{e.title}</h3>
                        <p>{e.location}</p>
                        <p style={{ marginTop: 6 }}>
                          {new Date(e.startDate).toLocaleDateString()} →{" "}
                          {new Date(e.endDate).toLocaleDateString()}
                        </p>
                        <p style={{ marginTop: 6 }}>{e.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}