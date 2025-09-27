// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Destinations from './pages/Destinations.jsx';
import SpotDetail from './pages/SpotDetail.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Events from './pages/Events.jsx';
import Homestays from './pages/Homestays.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx'; // Import the new page
import LiveInfo from './pages/LiveInfo.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Feedback from './components/Feedback.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminRoute from './components/AdminRoute.jsx'; // Import the protected route
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Chatbot />
      
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/spot/:id" element={<SpotDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/homestays" element={<Homestays />} />
          <Route path="/live" element={<LiveInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        </Routes>
      </main>

      <Feedback />
      <Footer />
    </BrowserRouter>
  );
}