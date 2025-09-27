// frontend/src/components/DestinationCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function DestinationCard({ spot }) {
  const img =
    (Array.isArray(spot.images) && spot.images.length > 0 && spot.images[0]) ||
    spot.image ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd6itEH13lMk7JYChKomlC5qg6n5m8v1QDQ&s";

  const hasCoord =
    spot?.coordinates &&
    typeof spot.coordinates.lat === "number" &&
    typeof spot.coordinates.lng === "number";

  const gdir = hasCoord
    ? `https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}`
    : null;

  return (
    <div className="card">
      <img src={img} alt={spot.name} />
      <div className="card-body">
        <div className="card-info">
          {/* ADD THIS TAGS SECTION */}
          {spot.tags && spot.tags.length > 0 && (
            <div className="card-tags">
              {spot.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}
            </div>
          )}

          <h3>{spot.name}</h3>
          {spot.location && <p>{spot.location}</p>}
          <p style={{ marginTop: "6px" }}>
            {spot.description?.slice(0, 90)}
            {spot.description?.length > 90 ? "…" : ""}
          </p>
        </div>

        <div className="card-actions">
          {gdir && (
            <a className="btn" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}} href={gdir} target="_blank" rel="noreferrer">
              Directions
            </a>
          )}
          {spot._id && (
            <Link className="btn" style={{fontSize: '0.9rem', padding: '0.5rem 1rem'}} to={`/spot/${spot._id}`}>
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}