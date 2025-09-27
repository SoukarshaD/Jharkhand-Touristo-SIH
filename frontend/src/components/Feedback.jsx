// frontend/src/components/Feedback.jsx

import React, { useState } from 'react';
import { submitFeedback } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Feedback() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  // Pre-fill the user's name if they are logged in
  const [name, setName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  
  // When the modal opens, ensure the name is up-to-date
  const handleOpen = () => {
    setName(user?.name || '');
    setOpen(true);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const res = await submitFeedback({ name, rating, comments });
      setMsg(res?.stored === 'local' ? 'Saved offline; will sync when backend is available.' : 'Thanks for your feedback!');
      // Clear fields after submission
      setName(user?.name || ''); 
      setRating(5); 
      setComments('');
      // Close modal after a short delay
      setTimeout(() => {
        setOpen(false);
        setMsg('');
      }, 2000);
    } catch (err) {
      setMsg('Failed to submit. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        // These are the changed classes for positioning
        className="fixed bottom-24 right-8 p-4 bg-blue-700 text-white rounded-full shadow-lg z-50 hover:bg-blue-600 transition"
        aria-label="Open feedback form"
      >
        {/* Replaced text with an icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 m-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Share your feedback</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <input className="w-full p-2 border rounded" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
              <label className="block">
                Rating: 
                <input type="range" min="1" max="5" value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="ml-2 align-middle w-48"/> 
                <span className="ml-4 font-bold text-lg">{rating} ★</span>
              </label>
              <textarea className="w-full p-2 border rounded" rows={4} placeholder="Comments" value={comments} onChange={(e)=>setComments(e.target.value)} required />
              <button disabled={busy} className="btn w-full" type="submit">{busy ? 'Submitting…' : 'Submit'}</button>
              {msg && <p className="text-sm text-center text-gray-600 mt-2">{msg}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}