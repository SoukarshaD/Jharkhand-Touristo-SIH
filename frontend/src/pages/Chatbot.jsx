import React, { useState } from 'react';
import ItineraryPlanner from '../components/ItineraryPlanner';
import ChatModal from '../components/ChatModal';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null); // 'chat' or 'planner'

  const toggleBubble = () => {
    if (selectedTool) {
      setSelectedTool(null);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const closeTool = () => {
    setSelectedTool(null);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleBubble}
        className="fixed bottom-8 right-8 p-4 bg-green-700 text-white rounded-full shadow-lg z-50 hover:bg-green-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {isOpen && !selectedTool && (
        <div className="fixed bottom-24 right-8 p-4 bg-white rounded-xl shadow-2xl z-50">
          <h3 className="font-semibold mb-4">Choose a Tool</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedTool('chat')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              AI Chatbot
            </button>
            <button
              onClick={() => setSelectedTool('planner')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Itinerary Planner
            </button>
          </div>
        </div>
      )}

      {selectedTool === 'chat' && <ChatModal onClose={closeTool} />}
      {selectedTool === 'planner' && <ItineraryPlanner onClose={closeTool} />}
    </>
  );
}