import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Map from '../components/Map';
import { api, createReview } from '../api/api';
import '../styles/global.css';

export default function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ userName: '', comment: '', rating: 5 });

  // Fetch spot details
  useEffect(() => {
    async function fetchSpot() {
      try {
        const res = await api.get(`/api/destinations/${id}`);
        setSpot(res.data);
      } catch (err) {
        console.error('Failed to fetch spot details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpot();
  }, [id]);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);
  
  // Handler for submitting the review form
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.userName.trim() || !review.comment.trim()) {
      alert('Please fill out your name and comment.');
      return;
    }
    try {
      await createReview({ ...review, spotId: id });
      alert('Thank you for your review!');
      setReview({ userName: '', comment: '', rating: 5 }); // Reset form
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!spot) {
    return <div className="text-center mt-20">Spot not found.</div>;
  }
  
  // ✅ Correct Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${spot.coordinates.lat},${spot.coordinates.lng}`;

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-center my-8">{spot.name}</h1>
      <div className="flex justify-center mb-8">
        <img src={spot.image} alt={spot.name} className="main-spot-image" />
      </div>

      <p className="text-lg text-center text-gray-700">{spot.description}</p>
      <p className="mt-2 text-center">{spot.location}</p>

      {/* Action Buttons Section */}
      <div className="mt-4 text-center flex justify-center gap-4 flex-wrap">
        {userLocation && (
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn inline-block">
            Get Directions
          </a>
        )}
        
        {/* Link to Google Maps 360° View */}
        {spot.googleMaps360Url && (
          <a href={spot.googleMaps360Url} target="_blank" rel="noopener noreferrer" className="btn">
            Open 360° View
          </a>
        )}
      </div>

      {/* Map Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Map</h2>
        <Map
          coordinates={spot.coordinates}
          name={spot.name}
          userLocation={userLocation}
        />
      </div>

      {/* Review Form Section */}
      <div className="mt-8 pt-8 border-t">
        <h2 className="text-2xl font-semibold mb-4 text-center">Leave a Review</h2>
        <form onSubmit={handleReviewSubmit} className="max-w-xl mx-auto space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="userName"
              value={review.userName}
              onChange={(e) => setReview({ ...review, userName: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              id="comment"
              rows="4"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              id="rating"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <button type="submit" className="btn w-full">Submit Review</button>
        </form>
      </div>
    </div>
  );
}