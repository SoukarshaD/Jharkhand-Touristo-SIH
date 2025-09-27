import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(null);

  useEffect(() => {
    if (lang === null) {
      setMessages([{
        text: 'Hello! I am the Jharkhand Tourism AI Assistant. Please select your preferred language.',
        from: 'ai',
        isLanguagePrompt: true
      }]);
    }
  }, [lang]);

  const handleLanguageSelect = (selectedLang) => {
    setLang(selectedLang);
    setMessages([{
      text: `Language set to ${selectedLang === 'en' ? 'English' : 'Hindi'}. How can I assist you today?`,
      from: 'ai'
    }]);
  };

  async function sendMessage() {
    if (!input.trim() || loading || lang === null) return;
    setLoading(true);

    const newUserMessage = { text: input, from: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');

    try {
        const res = await api.post('/api/ai/chat', { message: newUserMessage.text, language: lang });
        const newAiMessage = { text: res.data.response, from: 'ai' };
        setMessages((prev) => [...prev, newAiMessage]);
    } catch (error) {
        console.error('AI response error:', error);
        setMessages((prev) => [...prev, { text: 'Sorry, I am unable to respond right now.', from: 'ai' }]);
    } finally {
        setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-24 right-8 w-80 h-[500px] flex flex-col bg-white rounded-xl shadow-2xl z-50">
      <header className="p-4 bg-green-700 text-white rounded-t-xl flex justify-between items-center">
        <h2 className="text-xl font-bold">Jharkhand AI Assistant</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-green-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.isLanguagePrompt ? (
              <div className="p-3 rounded-lg bg-gray-300 text-gray-800 max-w-[80%]">
                <p className="mb-2">{msg.text}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleLanguageSelect('en')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">English</button>
                  <button onClick={() => handleLanguageSelect('hi')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Hindi</button>
                </div>
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.from === 'user' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-300 text-gray-800 animate-pulse">
              ...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-100 rounded-b-xl flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder={lang === null ? 'Select a language to begin...' : `Type a message...`}
          disabled={loading || lang === null}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
          disabled={loading || lang === null}
        >
          Send
        </button>
      </div>
    </div>
  );
}