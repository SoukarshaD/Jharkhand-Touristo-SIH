// frontend/src/api/api.js

import axios from 'axios';

// Use Vite env if set, otherwise default to backend port 5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// THIS IS THE NEW PART -- Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Helper to safely parse request bodies
function safeParse(val) {
  if (!val) return {};
  try {
    return typeof val === 'string' ? JSON.parse(val) : val;
  } catch {
    return {};
  }
}

// ---------- Mock data (used only if network fails) ----------
const mock = {
  destinations: [
    {
      _id: 'd1',
      name: 'Hundru Falls',
      location: 'Ranchi',
      description: 'A stunning waterfall surrounded by lush greenery, ideal for picnics and photography.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Hundru_Falls.jpg',
      coordinates: { lat: 23.2807, lng: 85.4736 },
    },
    {
      _id: 'd2',
      name: 'Betla National Park',
      location: 'Latehar',
      description: 'Rich wildlife sanctuary with elephants, leopards, and scenic forest trails.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Betla_National_Park.jpg',
      coordinates: { lat: 23.8467, lng: 84.2119 },
    },
  ],
  products: [
    {
      _id: 'p1',
      name: 'Dhokra Handicraft Bowl',
      description: 'Traditional metal casting artwork by tribal artisans.',
      price: 1499,
      images: ['https://images.unsplash.com/photo-1523419409543-8c1c8700e7d7?q=80&w=1200&auto=format&fit=crop'],
      sellerId: { name: 'Adivasi Handicrafts Co-op' },
    },
  ],
  events: [
    {
      _id: 'e1',
      title: 'Sarhul Festival',
      type: 'Cultural',
      location: 'Ranchi',
      image: 'https://images.unsplash.com/photo-1542996965-2cfb8f5c6c2f?q=80&w=1200&auto=format&fit=crop',
      description: 'Spring festival celebrating nature and community.',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
    },
  ],
  homestays: [
    {
      _id: 'h1',
      name: 'Forest Edge Homestay',
      address: 'Near Betla Gate, Latehar',
      description: 'Eco-friendly stay amidst sal forests, locally sourced meals.',
      images: ['https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1200&auto=format&fit=crop'],
      pricePerNight: 2200,
      capacity: 4,
    },
  ],
  analytics: {
    totals: { destinations: 12, products: 8, events: 5, homestays: 6, bookings: 21 },
    topDestinationTags: [
      { tag: 'Waterfalls', count: 5 },
      { tag: 'Wildlife', count: 4 },
      { tag: 'Trekking', count: 3 },
    ],
    sentiment_analysis: {
      Positive: 75,
      Negative: 8,
      Neutral: 12,
    },
    generatedAt: new Date().toISOString(),
  },
};

function isNetworkError(err) {
  return !!err && (!!err.isAxiosError || !!err.request) && !err.response;
}

// Inject axios interceptor to gracefully mock AI endpoints when offline
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!isNetworkError(err) || !err.config) return Promise.reject(err);
    const { url = '', method = 'get', data } = err.config;
    const body = safeParse(data);

    if (url.includes('/api/ai/chat') && method.toLowerCase() === 'post') {
      const lang = body.language || 'en';
      const msg = String(body.message || '').trim();
      const replyEn = msg
        ? `Here are tips for Jharkhand travel: plan around waterfalls like Hundru, use Ranchi as base, and consider Betla NP for wildlife. Query: "${msg}"`
        : 'Ask me anything about Jharkhand travel, destinations, homestays, or events.';
      const replyHi = msg
        ? `झारखंड यात्रा सुझाव: हुदरू फॉल्स, बेटला नेशनल पार्क, और रांची बेस के रूप में रखें। आपका प्रश्न: "${msg}"`
        : 'झारखंड यात्रा, होमस्टे या इवेंट्स के बारे में पूछें।';
      return Promise.resolve({ data: { response: lang === 'hi' ? replyHi : replyEn }, status: 200, statusText: 'OK', headers: {}, config: err.config });
    }

    if (url.includes('/api/ai/plan') && method.toLowerCase() === 'post') {
      const duration = Math.max(1, Math.min(10, Number(body.duration) || 3));
      const interests = Array.isArray(body.interests) && body.interests.length ? body.interests : ['Scenic'];
      const location = body.location || 'Ranchi';
      const days = Array.from({ length: duration }).map((_, i) => ({
        day: i + 1,
        activities: [
          `Morning: Explore ${interests[0]} spot near ${location}`,
          `Afternoon: Local cuisine and museum visit`,
          `Evening: Cultural walk / market visit`,
        ],
      }));
      const plan = { title: `${duration}-day plan for ${location} • ${interests.join(', ')}`, days };
      return Promise.resolve({ data: plan, status: 200, statusText: 'OK', headers: {}, config: err.config });
    }

    return Promise.reject(err);
  }
);

// --- Destinations ---
export async function fetchDestinations(params = {}) {
  try {
    const { data } = await api.get('/api/destinations', { params });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.destinations;
    throw err;
  }
}

export async function fetchDestination(id) {
  try {
    const { data } = await api.get(`/api/destinations/${id}`);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.destinations.find(d => d._id === id) || null;
    throw err;
  }
}

// --- Products ---
export async function fetchProducts(params = {}) {
  try {
    const { data } = await api.get('/api/products', { params });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.products;
    throw err;
  }
}

// --- Events ---
export async function fetchEvents(params = {}) {
  try {
    const { data } = await api.get('/api/events', { params });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.events;
    throw err;
  }
}

// --- Homestays ---
export async function fetchHomestays(params = {}) {
  try {
    const { data } = await api.get('/api/homestays', { params });
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.homestays;
    throw err;
  }
}

// --- Bookings ---
export async function createBooking(payload) {
  try {
    const { data } = await api.post('/api/bookings', payload);
    return data;
  } catch (err) {
    if (isNetworkError(err)) return { ok: true, mocked: true };
    throw err;
  }
}

// --- Reviews & Feedback ---
const FEEDBACK_KEY = 'feedbackEntries';

function readLocalFeedback() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeLocalFeedback(entries) {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
  } catch (e) {
    // Silently ignore localStorage write errors.
  }
}

export async function submitFeedback(entry) {
  const payload = { ...entry, createdAt: entry.createdAt || new Date().toISOString() };
  try {
    const { data } = await api.post('/api/feedback', payload);
    return data;
  } catch (err) {
    if (isNetworkError(err)) {
      const cur = readLocalFeedback();
      cur.push(payload);
      writeLocalFeedback(cur);
      return { ok: true, stored: 'local' };
    }
    throw err;
  }
}

// Correctly defines a single `createReview` function.
export async function createReview(payload) {
  try {
    const { data } = await api.post('/api/reviews', payload);
    return data;
  } catch (err) {
    // Fallback to local storage if network is down
    if (isNetworkError(err)) {
      const cur = readLocalFeedback();
      cur.push(payload);
      writeLocalFeedback(cur);
      return { ok: true, stored: 'local' };
    }
    throw err;
  }
}


// --- Analytics ---
export async function fetchAnalyticsSummary() {
  try {
    const { data } = await api.get('/api/analytics/summary');
    return data;
  } catch (err) {
    if (isNetworkError(err)) return mock.analytics;
    throw err;
  }
}

// ADD THESE FUNCTIONS to frontend/src/api/api.js

// --- Admin ---
export async function fetchAllUsers() {
  try {
    const { data } = await api.get('/api/admin/users');
    return data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    // Return empty array on error to prevent crashes
    return [];
  }
}

export async function toggleUserVerification(userId) {
  try {
    const { data } = await api.patch(`/api/admin/users/${userId}/verify`);
    return data;
  } catch (err) {
    console.error("Failed to verify user:", err);
    throw err; // Re-throw the error to be handled by the component
  }
}

export { api };