// frontend/src/pages/UserManagement.jsx

import React, { useEffect, useState } from 'react';
import { fetchAllUsers, toggleUserVerification } from '../api/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleVerifyClick = async (userId) => {
    try {
      const updatedUser = await toggleUserVerification(userId);
      // Update the user in the local state to reflect the change immediately
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
    } catch (err) {
      setError('Failed to update user verification.');
    }
  };

  if (loading) return <div className="container p-6">Loading users...</div>;

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Verified</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 text-center">
                  {user.isVerified ? 
                    <span className="text-green-600 font-bold">Yes 🛡️</span> : 
                    <span className="text-gray-500">No</span>
                  }
                </td>
                <td className="p-3 text-center">
                  <button 
                    className="btn"
                    style={{ 
                      backgroundColor: user.isVerified ? '#f4a261' : '#006400', 
                      color: 'white',
                      padding: '0.4rem 0.8rem',
                      fontSize: '0.9rem'
                    }}
                    onClick={() => handleVerifyClick(user._id)}
                  >
                    {user.isVerified ? 'Un-verify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}