// frontend/src/pages/Marketplace.jsx

import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api';

export default function Marketplace() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setItems(data || []);
    }
    load();
  }, []);

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold">Marketplace – Tribal Handicrafts</h1>
      <p className="mb-6">Discover authentic crafts made by local artisans from across Jharkhand.</p>

      <div className="grid">
        {items.map(p => (
          <div className="card" key={p._id}>
            <img src={p.images?.[0] || 'https://placehold.co/600x400?text=Handicraft'} alt={p.name} />
            <div className="card-body">
              <div className="card-info">
                <h3>{p.name}</h3>
                <p><b>₹{p.price}</b></p>
                <p style={{marginTop:6}}>{p.description}</p>
                
                {/* THIS IS THE NEW PART */}
                {p?.sellerId?.name && (
                  <p style={{marginTop:6}}>
                    Seller: {p.sellerId.name} 
                    {p.sellerId.isVerified && <span title="Verified Seller"> 🛡️</span>}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}