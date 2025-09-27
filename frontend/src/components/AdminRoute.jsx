// frontend/src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    // If user is not an admin, redirect them to the homepage
    return <Navigate to="/" />;
  }

  return children;
}