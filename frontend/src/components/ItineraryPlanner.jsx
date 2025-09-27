import React, { useState } from 'react';
import { api } from '../api/api';

export default function ItineraryPlanner({ onPlanGenerated, onClose }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [duration, setDuration] = useState(4);
  const [baseCity, setBaseCity] = useState('Hazaribagh');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const interestsOptions = ['Ecotourism', 'Adventure', 'Culture', 'Heritage', 'Scenic', 'Trek'];
  const cities = ['Hazaribagh', 'Ranchi', 'Jamshedpur', 'Deoghar', 'Bokaro'];

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setItinerary(null); // Clear previous itinerary
    try {
      const payload = {
        interests: selectedInterests,
        duration: duration,
        location: baseCity,
      };
      const response = await api.post('/api/ai/plan', payload);
      setItinerary(response.data);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      onPlanGenerated({ error: 'Failed to generate itinerary. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-80 h-[500px] flex flex-col bg-white rounded-xl shadow-2xl z-50">
      <div className="p-4 bg-green-700 text-white rounded-t-xl flex justify-between items-center">
        <h2 className="text-xl font-bold">AI-powered itinerary planner</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        <p className="text-sm text-gray-600">Choose your interests, trip length, and a base city.</p>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">INTERESTS</label>
          <div className="flex flex-wrap gap-2">
            {interestsOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedInterests.includes(interest)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">DAYS</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-16 text-center">{duration} days</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">BASE CITY</label>
          <select
            value={baseCity}
            onChange={(e) => setBaseCity(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGeneratePlan}
          className="w-full p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
          disabled={loading || selectedInterests.length === 0}
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>

      {itinerary && (
        <div className="p-4 bg-gray-200 rounded-b-xl overflow-y-auto max-h-1/3">
          <h3 className="text-lg font-bold mb-2">{itinerary.title}</h3>
          {itinerary.days.map((dayPlan, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold">Day {dayPlan.day}</p>
              <ul className="list-disc list-inside ml-4">
                {dayPlan.activities.map((activity, j) => (
                  <li key={j}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}