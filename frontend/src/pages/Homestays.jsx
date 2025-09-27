// frontend/src/pages/Homestays.jsx

import React, { useEffect, useState } from 'react';
import { fetchHomestays, createBooking } from '../api/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Homestays() {
  const { user } = useAuth(); // Get the logged-in user
  const [items, setItems] = useState([]);
  
  const [booking, setBooking] = useState({ 
    name: user?.name || '', 
    phone: '', 
    checkIn: '', 
    checkOut: '', 
    guests: 1 
  });
  const [targetId, setTargetId] = useState(null); // This will hold the ID of the homestay being booked

  useEffect(() => {
    async function load() {
      const data = await fetchHomestays();
      setItems(data || []);
    }
    load();
  }, []);
  
  // When the user clicks "Request Booking", set the target and pre-fill their name
  const handleRequestClick = (homestayId) => {
    setTargetId(homestayId);
    setBooking(prev => ({ ...prev, name: user?.name || '' }));
  };

  async function submitBooking(e) {
    e.preventDefault();
    if (!targetId) return;
    
    try {
        const payload = {
            homestayId: targetId,
            startDate: booking.checkIn,
            endDate: booking.checkOut,
            guests: booking.guests,
            name: booking.name,
            phone: booking.phone,
        };
        await createBooking(payload);
        alert('Booking request submitted successfully!');
        setTargetId(null); // Close the form
    } catch (err) {
        console.error("Booking failed:", err);
        alert('Booking failed. Please make sure you are logged in and try again.');
    }
  }

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold">Homestays & Ecotourism</h1>
      <p className="mb-6">Find unique and authentic places to stay, hosted by local communities.</p>
      <div className="grid">
        {items.map(h => (
          <div className="card" key={h._id}>
            <img src={h.images?.[0] || 'https://placehold.co/600x400?text=Homestay'} alt={h.name} />
            <div className="card-body">
              <div className="card-info">
                <h3>{h.name}</h3>
                <p>{h.location}</p>
                <p style={{marginTop:6}}>{h.description}</p>
                <p style={{marginTop:6}}><b>₹{h.pricePerNight}</b> / night</p>
              </div>
              <div className="card-actions">
                {/* Only show button if a user is logged in */}
                {user && (
                    <button className="btn" onClick={() => handleRequestClick(h._id)}>
                        Request Booking
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {targetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setTargetId(null)}>
            <div className="card" style={{maxWidth: 520}} onClick={(e) => e.stopPropagation()}>
                <form className="card-body" onSubmit={submitBooking}>
                    <h3 className="text-xl font-bold mb-4">Booking Request for {items.find(h => h._id === targetId)?.name}</h3>
                    <div style={{display:'grid', gap:12, gridTemplateColumns: '1fr 1fr'}}>
                        <input required placeholder="Your name" value={booking.name} onChange={e=>setBooking(b=>({...b, name:e.target.value}))} className="w-full p-2 border rounded" style={{gridColumn: '1 / -1'}} />
                        <input required placeholder="Phone" type="tel" value={booking.phone} onChange={e=>setBooking(b=>({...b, phone:e.target.value}))} className="w-full p-2 border rounded" style={{gridColumn: '1 / -1'}}/>
                        <label>Check-in: <input required type="date" value={booking.checkIn} onChange={e=>setBooking(b=>({...b, checkIn:e.target.value}))} className="w-full p-2 border rounded"/></label>
                        <label>Check-out: <input required type="date" value={booking.checkOut} onChange={e=>setBooking(b=>({...b, checkOut:e.target.value}))} className="w-full p-2 border rounded"/></label>
                    </div>
                     <label className="mt-4 block">Guests: <input required type="number" min={1} value={booking.guests} onChange={e=>setBooking(b=>({...b, guests:Number(e.target.value)}))} className="w-full p-2 border rounded"/></label>
                    <div style={{display:'flex', gap:8, marginTop:16}}>
                        <button className="btn" type="submit">Submit Request</button>
                        <button type="button" className="btn" onClick={()=>setTargetId(null)} style={{background:'#888'}}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}