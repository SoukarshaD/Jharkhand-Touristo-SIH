// frontend/src/components/Navbar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Import NavLink
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Jharkhand Touristo
        </Link>
      </h1>
      <div className="nav-links">
        {/* Use NavLink for links that can be "active" */}
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