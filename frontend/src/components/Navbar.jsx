// frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react'; // Import hooks
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // --- START of new logic for auto-hiding navbar ---
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Show navbar if scrolling up OR if at the very top
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  // --- END of new logic ---

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    // Add a conditional class 'navbar--hidden' based on the 'visible' state
    <nav className={`navbar ${!visible ? 'navbar--hidden' : ''}`}>
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Jharkhand Tourism
        </Link>
      </h1>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
        <NavLink to="/destinations" className={({ isActive }) => (isActive ? 'active' : '')}>Destinations</NavLink>
        <NavLink to="/marketplace" className={({ isActive }) => (isActive ? 'active' : '')}>Marketplace</NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>Events</NavLink>
        <NavLink to="/homestays" className={({ isActive }) => (isActive ? 'active' : '')}>Homestays</NavLink>
        <NavLink to="/live" className={({ isActive }) => (isActive ? 'active' : '')}>Live</NavLink>
        
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Analytics</NavLink>
        )}
        
        {user ? (
          <>
            <span className="nav-welcome-user">Welcome, {user.name}</span>
            <a href="#" onClick={handleLogout} className="nav-logout-button">Logout</a>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}